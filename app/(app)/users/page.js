'use client';
import { useState } from 'react';
import { useStore, perms } from '@/lib/storeProvider';
import { ROLES } from '@/lib/data';
import { PageHeader, Modal, Field, Select, RoleBadge, Empty } from '@/components/ui';

const blank = { name: '', email: '', password: 'changeme1', role: 'student', deptId: '', batchId: '' };

export default function Users() {
  const { db, me, add, update, remove } = useStore();
  const p = perms(me);
  const [q, setQ] = useState(''); const [role, setRole] = useState(''); const [batch, setBatch] = useState('');
  const [edit, setEdit] = useState(null);
  const dept = (id) => db.departments.find((d) => d.id === id)?.name || '—';
  const bname = (id) => db.batches.find((b) => b.id === id)?.name || '—';
  const rows = db.users.filter((u) => (!role || u.role === role) && (!batch || u.batchId === batch) && (u.name + u.email).toLowerCase().includes(q.toLowerCase()));
  const save = () => {
    const d = { ...edit, deptId: edit.deptId || null, batchId: edit.role === 'student' ? edit.batchId || null : null };
    edit.id ? update('users', edit.id, d) : add('users', { ...d, phone: '' });
    setEdit(null);
  };
  return (
    <>
      <PageHeader title="Users" sub="Students, lecturers, heads of department and administrators." action={p.manageUsers && <button className="btn" onClick={() => setEdit({ ...blank })}>Add user</button>} />
      <div className="mb-4 flex flex-wrap gap-2">
        <input className="inp max-w-xs" placeholder="Search name or email" value={q} onChange={(e) => setQ(e.target.value)} />
        <div className="w-44"><Select value={role} onChange={setRole} placeholder="All roles" options={Object.entries(ROLES).map(([v, l]) => ({ value: v, label: l }))} /></div>
        <div className="w-44"><Select value={batch} onChange={setBatch} placeholder="All batches" options={db.batches.map((b) => ({ value: b.id, label: b.name }))} /></div>
      </div>
      {rows.length === 0 ? <Empty>No users match these filters.</Empty> : (
        <div className="card overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-slate-50 text-slate-500"><tr><th className="p-3">Name</th><th>Role</th><th>Department</th><th>Batch</th><th /></tr></thead>
            <tbody className="divide-y">
              {rows.map((u) => (
                <tr key={u.id}>
                  <td className="p-3"><div className="font-medium">{u.name}</div><div className="text-slate-500">{u.email}</div></td>
                  <td><RoleBadge role={u.role} label={ROLES[u.role]} /></td><td>{dept(u.deptId)}</td><td>{bname(u.batchId)}</td>
                  <td className="whitespace-nowrap pr-3 text-right">{p.manageUsers && (<>
                    <button className="btn-ghost mr-1" onClick={() => setEdit({ ...u })}>Edit</button>
                    {u.id !== me.id && <button className="btn-danger" onClick={() => confirm(`Delete ${u.name}?`) && remove('users', u.id)}>Delete</button>}
                  </>)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {edit && (
        <Modal title={edit.id ? 'Edit user' : 'Add user'} onClose={() => setEdit(null)}>
          <form onSubmit={(e) => { e.preventDefault(); save(); }}>
            <Field label="First name"><input className="inp" required value={edit.firstName} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Last name"><input className="inp" required value={edit.lastName} onChange={(e) => setEdit({ ...edit, name: e.target.value })} /></Field>
            <Field label="Email"><input className="inp" type="email" required value={edit.email} onChange={(e) => setEdit({ ...edit, email: e.target.value })} /></Field>
            {!edit.id && <Field label="Temporary password"><input className="inp" required value={edit.password} onChange={(e) => setEdit({ ...edit, password: e.target.value })} /></Field>}
            <Field label="Role"><Select value={edit.role} onChange={(v) => setEdit({ ...edit, role: v })}
              options={Object.entries(ROLES).map(([v, l]) => ({ value: v, label: l }))} />
            </Field>
            <Field label="Department"><Select value={edit.deptId} onChange={(v) => setEdit({ ...edit, deptId: v })} placeholder="None" options={db.departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
            {edit.role === 'student' && <Field label="Batch"><Select value={edit.batchId} onChange={(v) => setEdit({ ...edit, batchId: v })} placeholder="No batch" options={db.batches.map((b) => ({ value: b.id, label: b.name }))} /></Field>}
            <button className="btn w-full">Save user</button>
          </form>
        </Modal>
      )}
    </>
  );
}
