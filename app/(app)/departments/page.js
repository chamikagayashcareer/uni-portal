'use client';
import { useEffect, useState } from 'react';
import { useStore, perms } from '@/lib/storeProvider';
import { PageHeader, Modal, Field, Select, Empty } from '@/components/ui';
import { useDispatch, useSelector } from 'react-redux';
import { createDepartmentApi, fetchDepartmentsApi } from '@/services/departmentService';
import { updateDepartments } from '@/lib/redux/departmentSlice';

export default function Departments() {
  const { db, me, update, remove } = useStore();
  const p = perms(me);
  const [edit, setEdit] = useState(null);
  const [loading, setLoading] = useState({
    addDepartment: false,
    getDepartments: false
  });
  const heads = db.users.filter((u) => u.role === 'hod' || u.role === 'lecturer');

  const departments = useSelector((state) => state.departments.value);
  const dispatch = useDispatch();

  useEffect(() => {
    if (departments.length == 0) {
      getDepartments()
    }
  }, [])

  const getDepartments = () => {
    if (loading.getDepartments) return;
    setLoading({ ...loading, getDepartments: true })
    fetchDepartmentsApi().then((response) => {
      dispatch(updateDepartments(response.data))
    }).finally(() => {
      setLoading({ ...loading, getDepartments: false })
    })
  }

  const addDepartment = async (e) => {
    if (loading.addDepartment) return;
    e.preventDefault();
    setLoading({ ...loading, addDepartment: true })
    createDepartmentApi(edit).finally(() => {
      setLoading({ ...loading, addDepartment: false })
      setEdit(null)
      getDepartments();
    });
  }


  return (
    <>
      <PageHeader title="Departments" sub="Each department owns its courses, staff and students." action={p.manageDepts && <button className="btn" onClick={() => setEdit({ name: '', code: '', description: '', hodId: '' })}>Add department</button>} />
      {departments !== null && departments.length == 0 ? <Empty>No departments yet.</Empty> : (
        <div className="grid gap-4 md:grid-cols-2">
          {departments.map((d) => {
            const hod = db.users.find((u) => u.id === d.hodId);
            const courses = db.courses.filter((c) => c.deptId === d.id);
            return (
              <div key={d.id} className="card border-l-4 border-l-gold p-5">
                <div className="flex items-start justify-between">
                  <div><h2 className="font-display text-xl text-forest">{d.name}</h2><div className="text-xs text-slate-500">{d.code}</div></div>
                  {p.manageDepts && <div><button className="btn-ghost mr-1" onClick={() => setEdit({ ...d })}>Edit</button><button className="btn-danger" onClick={() => confirm('Delete department?') && remove('departments', d.id)}>Delete</button></div>}
                </div>
                <p className="mt-2 text-sm text-slate-600">{d.description}</p>
                <dl className="mt-3 grid grid-cols-3 text-sm">
                  <div><dt className="text-slate-500">Head</dt><dd className="font-medium">{hod?.name || 'Unassigned'}</dd></div>
                  <div><dt className="text-slate-500">Courses</dt><dd className="font-medium">{courses.length}</dd></div>
                  <div><dt className="text-slate-500">Staff</dt><dd className="font-medium">{db.users.filter((u) => u.deptId === d.id && u.role !== 'student').length}</dd></div>
                </dl>
              </div>
            );
          })}
        </div>
      )}
      {edit && (
        <Modal title={edit.id ? 'Edit department' : 'Add department'} onClose={() => setEdit(null)}>
          <form onSubmit={addDepartment}>
            <Field label="Name"><input className="inp" required value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Code"><input className="inp" required value={edit.code} onChange={(e) => setEdit({ ...edit, code: e.target.value })} /></Field>
            <Field label="Description"><textarea className="inp" rows={3} value={edit.description} onChange={(e) => setEdit({ ...edit, description: e.target.value })} /></Field>
            <Field label="Head of department"><Select value={edit.hodId} onChange={(v) => setEdit({ ...edit, hodId: v })} placeholder="Unassigned" options={heads.map((u) => ({ value: u.id, label: u.name }))} /></Field>
            <button className="btn w-full">
              {loading.addDepartment ? <div className="h-5 w-5 loading-circle" /> : "Save department"}
            </button>
          </form>
        </Modal>
      )}
    </>
  );
}
