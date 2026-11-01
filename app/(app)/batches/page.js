'use client';
import { useEffect, useState } from 'react';
import { useStore, perms } from '@/lib/storeProvider';
import { PageHeader, Modal, Field, Select, Empty } from '@/components/ui';
import { useDispatch, useSelector } from 'react-redux';
import { createBatchApi, getBatchesApi, deleteBatchApi, assignStudentApi, fetchBatchesApi } from '@/services/batchService';
import { updateBatch } from '@/lib/redux/batchSlice';

export default function Batches() {
  const { db, me, add, update, remove } = useStore();
  const [loading, setLoading] = useState({
    getBatch: false,
    createBatch: false
  });
  const p = perms(me);
  const [edit, setEdit] = useState(null);
  const unassigned = db.users.filter((u) => u.role === 'student' && !u.batchId);

  const courses = useSelector((state) => state.courses.value);
  const batches = useSelector((state) => state.batches.value);
  const [open, setOpen] = useState(batches[0]?.id);

  const dispatch = useDispatch();

  useEffect(() => {
    getBatches();
  }, [])

  const addBatch = (e) => {
    e.preventDefault();
    setLoading((data) => ({ ...data, addBatch: true }));

    createBatchApi(edit).finally(() => {
      getBatches();
    }).finally(() => {
      setLoading((data) => ({ ...data, addBatch: false }));
      setEdit(null);
    });
  }

  const getBatches = () => {
    setLoading((data) => ({ ...data, getBatches: true }));

    fetchBatchesApi().then((response) => {
      dispatch(updateBatch(response.data))
    }).finally(() => {
      setLoading((data) => ({ ...data, getBatches: false }));
    });
  }

  const deleteBatch = (id) => {
    deleteBatchApi(id).finally(() => {
      getBatches();
    })
  }

  return (
    <>
      <PageHeader title="Batches" sub="Students are grouped by the year they joined a course." action={p.manageBatches && <button className="btn" onClick={() => setEdit({ name: '', courseId: courses[0] ? courses[0].id : null, intakeYear: new Date().getFullYear() })}>Add batch</button>} />
      {batches.length === 0 ? <Empty>No batches yet.</Empty> : (
        <div className="space-y-3">
          {batches.map((b) => {
            const on = open === b.id;
            return (
              <div key={b.id} className="card">
                <button className="flex w-full items-center justify-between p-4 text-left" onClick={() => setOpen(on ? null : b.id)} aria-expanded={on}>
                  <span><span className="font-display text-lg text-forest">{b.name}</span><span className="ml-3 text-sm text-slate-500">{b.courseName} · intake {b.intakeYear}</span></span>
                  <span className="text-sm text-slate-600">{b.students.length} students {on ? '▴' : '▾'}</span>
                </button>
                {on && (
                  <div className="border-t p-4">
                    <ul className="divide-y text-sm">
                      {b.students.map((s) => (<li key={s.id} className="flex items-center justify-between py-2"><span>{s.firstName + " " + s.lastName} <span className="text-slate-500">{s.email}</span></span>{p.manageBatches && <button className="btn-danger" onClick={() => update('users', s.id, { batchId: null })}>Remove</button>}</li>))}
                      {b.students.length === 0 && <li className="py-2 text-slate-500">No students in this batch.</li>}
                    </ul>
                    {p.manageBatches && (
                      <div className="mt-3 flex flex-wrap items-center gap-2">
                        <div className="w-60"><Select value="" onChange={(v) => v && update('users', v, { batchId: b.id })} placeholder="Add unassigned student…" options={unassigned.map((u) => ({ value: u.id, label: u.name }))} /></div>
                        <button className="btn-danger" onClick={() => confirm('Delete batch? Students become unassigned.') && (deleteBatch(b.id))}>Delete batch</button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
      {edit && (
        <Modal title="Add batch" onClose={() => setEdit(null)}>
          <form onSubmit={addBatch}>
            <Field label="Batch name"><input className="inp" required placeholder="CS 2026" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Course"><Select required value={edit.courseId} onChange={(v) => setEdit({ ...edit, courseId: v })} options={courses.map((c) => ({ value: c.id, label: c.name }))} /></Field>
            <Field label="Intake year"><input className="inp" type="number" value={edit.intakeYear} onChange={(e) => setEdit({ ...edit, intakeYear: e.target.value })} /></Field>
            <button className="btn w-full">Save batch</button>
          </form>
        </Modal>
      )}
    </>
  );
}
