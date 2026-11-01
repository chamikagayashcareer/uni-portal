'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useStore, canEditModule, uid } from '@/lib/storeProvider';
import { PageHeader, Modal, Field, Empty, fmtSize } from '@/components/ui';

export default function ModulePage() {
  const { id } = useParams();
  const { db, me, updateModule } = useStore();
  const [edit, setEdit] = useState(null);
  const m = db.modules.find((x) => x.id === id);
  if (!m) return <Empty>Module not found. <Link href="/courses" className="underline">Back to courses</Link></Empty>;
  const course = db.courses.find((c) => c.id === m.courseId);
  const lecturer = db.users.find((u) => u.id === m.lecturerId);
  const canEdit = canEditModule(me, m);
  const students = db.users.filter((u) => u.role === 'student' && db.batches.find((b) => b.id === u.batchId)?.courseId === m.courseId);
  const weeks = [...m.weeks].sort((a, b) => a.week - b.week);

  const saveWeek = () => {
    updateModule(id, (mod) => ({
      ...mod, weeks: edit.id
        ? mod.weeks.map((w) => (w.id === edit.id ? { ...w, week: +edit.week, title: edit.title, note: edit.note } : w))
        : [...mod.weeks, { id: uid('w'), week: +edit.week, title: edit.title, note: edit.note, files: [] }]
    }));
    setEdit(null);
  };
  const upload = (wid, list) => {
    const files = [...list].map((f) => ({ id: uid('f'), name: f.name, size: f.size, url: URL.createObjectURL(f) }));
    updateModule(id, (mod) => ({ ...mod, weeks: mod.weeks.map((w) => (w.id === wid ? { ...w, files: [...w.files, ...files] } : w)) }));
  };
  const delFile = (wid, fid) => updateModule(id, (mod) => ({ ...mod, weeks: mod.weeks.map((w) => (w.id === wid ? { ...w, files: w.files.filter((f) => f.id !== fid) } : w)) }));
  const delWeek = (wid) => confirm('Delete this week and its files?') && updateModule(id, (mod) => ({ ...mod, weeks: mod.weeks.filter((w) => w.id !== wid) }));

  return (
    <>
      <PageHeader title={m.title} sub={`${m.code} · ${m.credits} credits · Semester ${m.semester} · ${lecturer?.name || 'No lecturer'} · ${course?.name}`}
        action={canEdit && <button className="btn" onClick={() => setEdit({ week: weeks.length + 1, title: '', note: '' })}>Add week</button>} />
      {weeks.length === 0 ? <Empty>No weeks published yet.{canEdit && ' Add week 1 to start sharing material.'}</Empty> : (
        <ol className="space-y-4">
          {weeks.map((w) => (
            <li key={w.id} className="card flex flex-col gap-3 p-4 md:flex-row">
              <div className="w-20 shrink-0 font-display text-2xl text-gold-dark">Week {w.week}</div>
              <div className="flex-1">
                <div className="flex justify-between gap-2">
                  <h3 className="font-medium">{w.title}</h3>
                  {canEdit && <div className="shrink-0"><button className="btn-ghost mr-1" onClick={() => setEdit({ ...w })}>Edit</button><button className="btn-danger" onClick={() => delWeek(w.id)}>Delete</button></div>}
                </div>
                {w.note && <p className="mt-1 text-sm text-slate-600">{w.note}</p>}
                <ul className="mt-3 space-y-1">
                  {w.files.map((f) => (
                    <li key={f.id} className="flex items-center justify-between rounded bg-slate-50 px-3 py-2 text-sm">
                      {f.url ? <a href={f.url} download={f.name} className="font-medium text-forest underline">{f.name}</a> : <span className="font-medium" title="Sample file, no content">{f.name}</span>}
                      <span className="text-slate-500">{fmtSize(f.size)} {canEdit && <button className="btn-danger ml-2" onClick={() => delFile(w.id, f.id)}>Remove</button>}</span>
                    </li>
                  ))}
                  {w.files.length === 0 && <li className="text-sm text-slate-400">No documents for this week.</li>}
                </ul>
                {canEdit && (
                  <label className="btn-ghost mt-3 cursor-pointer">Upload documents
                    <input type="file" multiple className="sr-only" onChange={(e) => { upload(w.id, e.target.files); e.target.value = ''; }} />
                  </label>
                )}
              </div>
            </li>
          ))}
        </ol>
      )}
      {me.role !== 'student' && (
        <>
          <h2 className="mb-3 mt-8 font-display text-xl text-forest">Enrolled students ({students.length})</h2>
          <div className="card divide-y text-sm">
            {students.map((s) => (<div key={s.id} className="flex justify-between p-3"><span>{s.name}</span><span className="text-slate-500">{db.batches.find((b) => b.id === s.batchId)?.name}</span></div>))}
            {students.length === 0 && <div className="p-4 text-slate-500">No students enrolled.</div>}
          </div>
        </>
      )}
      {edit && (
        <Modal title={edit.id ? 'Edit week' : 'Add week'} onClose={() => setEdit(null)}>
          <form onSubmit={(e) => { e.preventDefault(); saveWeek(); }}>
            <Field label="Week number"><input className="inp" type="number" min="1" max="30" required value={edit.week} onChange={(e) => setEdit({ ...edit, week: e.target.value })} /></Field>
            <Field label="Topic"><input className="inp" required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <Field label="Notes for students"><textarea className="inp" rows={3} value={edit.note} onChange={(e) => setEdit({ ...edit, note: e.target.value })} /></Field>
            <button className="btn w-full">Save week</button>
          </form>
        </Modal>
      )}
    </>
  );
}
