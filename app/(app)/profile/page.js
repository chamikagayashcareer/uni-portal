'use client';
import { useState } from 'react';
import { useStore } from '@/lib/storeProvider';
import { ROLES } from '@/lib/data';
import { PageHeader, Field, RoleBadge } from '@/components/ui';

export default function Profile() {
  const { db, me, update } = useStore();
  const [f, setF] = useState({ name: me.name, phone: me.phone || '' });
  const [pw, setPw] = useState({ cur: '', next: '' });
  const [msg, setMsg] = useState('');
  const dept = db.departments.find((d) => d.id === me.deptId)?.name;
  const batch = db.batches.find((b) => b.id === me.batchId)?.name;
  const changePw = (e) => {
    e.preventDefault();
    if (pw.cur !== me.password) return setMsg('Current password is incorrect.');
    if (pw.next.length < 6) return setMsg('New password needs at least 6 characters.');
    update('users', me.id, { password: pw.next }); setPw({ cur: '', next: '' }); setMsg('Password changed.');
  };
  return (
    <>
      <PageHeader title="Profile" sub="Your details as the university sees them." />
      <div className="grid max-w-4xl gap-6 md:grid-cols-2">
        <form className="card p-5" onSubmit={(e) => { e.preventDefault(); update('users', me.id, f); setMsg('Profile saved.'); }}>
          <div className="mb-4 flex items-center gap-3"><RoleBadge role={me.role} label={ROLES[me.role]} /><span className="text-sm text-slate-500">{[dept, batch].filter(Boolean).join(' · ')}</span></div>
          <Field label="Full name"><input className="inp" required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></Field>
          <Field label="Email"><input className="inp bg-slate-100" disabled value={me.email} /></Field>
          <Field label="Phone"><input className="inp" value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></Field>
          <button className="btn">Save changes</button>
        </form>
        <form className="card p-5" onSubmit={changePw}>
          <h2 className="mb-3 font-display text-xl text-forest">Change password</h2>
          <Field label="Current password"><input className="inp" type="password" required value={pw.cur} onChange={(e) => setPw({ ...pw, cur: e.target.value })} /></Field>
          <Field label="New password"><input className="inp" type="password" required value={pw.next} onChange={(e) => setPw({ ...pw, next: e.target.value })} /></Field>
          <button className="btn">Update password</button>
        </form>
      </div>
      {msg && <p role="status" className="mt-4 text-sm text-forest">{msg}</p>}
    </>
  );
}
