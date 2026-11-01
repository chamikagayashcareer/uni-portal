'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { useStore, perms } from '@/lib/storeProvider';
import { PageHeader, Modal, Field, Select, Empty } from '@/components/ui';

export default function CourseDetail() {
  const { id } = useParams(); const router = useRouter();
  const { db, me, add, remove } = useStore();
  const p = perms(me);
  const [edit, setEdit] = useState(null);
  const c = db.courses.find((x) => x.id === id);
  if (!c) return <Empty>Course not found. <Link href="/courses" className="underline">Back to courses</Link></Empty>;
  const modules = db.modules.filter((m) => m.courseId === id);
  const batches = db.batches.filter((b) => b.courseId === id);
  const lecturers = db.users.filter((u) => u.role === 'lecturer' || u.role === 'hod');
  return (
    <>
      <PageHeader title={c.name} sub={`${c.code} · ${db.departments.find((d) => d.id === c.deptId)?.name} · ${c.years} years`}
        action={p.manageCourses && <button className="btn-danger" onClick={() => { if (confirm('Delete this course?')) { remove('courses', id); router.replace('/courses'); } }}>Delete course</button>} />
      <p className="mb-6 max-w-2xl text-slate-600">{c.description}</p>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-display text-xl text-forest">Modules</h2>
        {p.manageCourses && <button className="btn" onClick={() => setEdit({ code: '', title: '', credits: 3, semester: 1, lecturerId: '' })}>Add module</button>}
      </div>
      {modules.length === 0 ? <Empty>This course has no modules yet.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-500"><tr><th className="p-3">Module</th><th>Semester</th><th>Credits</th><th>Lecturer</th><th /></tr></thead>
            <tbody className="divide-y">
              {modules.sort((a, b) => a.semester - b.semester).map((m) => (
                <tr key={m.id}>
                  <td className="p-3"><Link href={`/modules/${m.id}`} className="font-medium text-forest underline">{m.title}</Link><div className="text-slate-500">{m.code}</div></td>
                  <td>{m.semester}</td><td>{m.credits}</td><td>{db.users.find((u) => u.id === m.lecturerId)?.name || 'Unassigned'}</td>
                  <td className="pr-3 text-right">{p.manageCourses && <button className="btn-danger" onClick={() => confirm('Delete module?') && remove('modules', m.id)}>Delete</button>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <h2 className="mb-3 mt-8 font-display text-xl text-forest">Batches</h2>
      {batches.length === 0 ? <Empty>No batches for this course.</Empty> : (
        <div className="flex flex-wrap gap-3">
          {batches.map((b) => (<div key={b.id} className="card px-4 py-3 text-sm"><div className="font-medium">{b.name}</div><div className="text-slate-500">{db.users.filter((u) => u.batchId === b.id).length} students</div></div>))}
        </div>
      )}
      {edit && (
        <Modal title="Add module" onClose={() => setEdit(null)}>
          <form onSubmit={(e) => { e.preventDefault(); add('modules', { ...edit, courseId: id, credits: +edit.credits, semester: +edit.semester, lecturerId: edit.lecturerId || null, weeks: [] }); setEdit(null); }}>
            <Field label="Module code"><input className="inp" required value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value })} /></Field>
            <Field label="Title"><input className="inp" required value={edit.title} onChange={(e) => setEdit({ ...edit, title: e.target.value })} /></Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label="Credits"><input className="inp" type="number" min="1" value={edit.credits} onChange={(e) => setEdit({ ...edit, credits: e.target.value })} /></Field>
              <Field label="Semester"><input className="inp" type="number" min="1" max="8" value={edit.semester} onChange={(e) => setEdit({ ...edit, semester: e.target.value })} /></Field>
            </div>
            <Field label="Lecturer"><Select value={edit.lecturerId} onChange={(v) => setEdit({ ...edit, lecturerId: v })} placeholder="Unassigned" options={lecturers.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            <button className="btn w-full">Save module</button>
          </form>
        </Modal>
      )}
    </>
  );
}
