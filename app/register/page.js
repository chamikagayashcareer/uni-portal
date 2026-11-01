'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/storeProvider';
import AuthFrame from '@/components/AuthFrame';
import { Field, Select } from '@/components/ui';

export default function Register() {
  const { db, register } = useStore(); const router = useRouter();
  const [f, setF] = useState({ name: '', email: '', password: '', role: 'student', deptId: '', batchId: '' });
  const [err, setErr] = useState('');
  const set = (k) => (v) => setF((s) => ({ ...s, [k]: v, ...(k === 'deptId' ? { batchId: '' } : {}) }));
  const batches = db.batches.filter((b) => db.courses.find((c) => c.id === b.courseId)?.deptId === f.deptId);
  const submit = (e) => {
    e.preventDefault();
    if (f.password.length < 6) return setErr('Password needs at least 6 characters.');
    if (f.role === 'student' && !f.batchId) return setErr('Choose your batch.');
    const m = register({ ...f, deptId: f.deptId || null, batchId: f.role === 'student' ? f.batchId : null });
    if (m) setErr(m); else router.replace('/dashboard');
  };
  return (
    <AuthFrame title="Create account" sub="Register as a student or lecturer.">
      <form onSubmit={submit}>
        <Field label="Full name"><input className="inp" required value={f.name} onChange={(e) => set('name')(e.target.value)} /></Field>
        <Field label="Email"><input className="inp" type="email" required value={f.email} onChange={(e) => set('email')(e.target.value)} /></Field>
        <Field label="Password"><input className="inp" type="password" required value={f.password} onChange={(e) => set('password')(e.target.value)} /></Field>
        <Field label="I am a"><Select value={f.role} onChange={set('role')} options={[{ value: 'student', label: 'Student' }, { value: 'lecturer', label: 'Lecturer' }]} /></Field>
        <Field label="Department"><Select required value={f.deptId} onChange={set('deptId')} placeholder="Select department" options={db.departments.map((d) => ({ value: d.id, label: d.name }))} /></Field>
        {f.role === 'student' && f.deptId && (
          <Field label="Batch"><Select value={f.batchId} onChange={set('batchId')} placeholder="Select batch" options={batches.map((b) => ({ value: b.id, label: b.name }))} /></Field>
        )}
        {err && <p role="alert" className="mb-3 text-sm text-red-700">{err}</p>}
        <button className="btn w-full">Create account</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">Already registered? <Link href="/login" className="font-medium text-forest underline">Sign in</Link></p>
    </AuthFrame>
  );
}
