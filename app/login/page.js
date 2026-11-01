'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/storeProvider';
import AuthFrame from '@/components/AuthFrame';
import { Field } from '@/components/ui';

const DEMO = [['Admin', 'admin@uni.edu', 'admin123'], ['Head of dept', 'hod@uni.edu', 'hod123'], ['Lecturer', 'lecturer@uni.edu', 'lec123'], ['Student', 'student@uni.edu', 'stu123']];

export default function Login() {
  const { login } = useStore(); const router = useRouter();
  const [email, setEmail] = useState(''); const [pw, setPw] = useState(''); const [err, setErr] = useState('');
  const go = (e, p) => { const m = login(e, p); if (m) setErr(m); else router.replace('/dashboard'); };
  return (
    <AuthFrame title="Sign in" sub="Use your university email.">
      <form onSubmit={(e) => { e.preventDefault(); go(email, pw); }}>
        <Field label="Email"><input className="inp" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
        <Field label="Password"><input className="inp" type="password" required value={pw} onChange={(e) => setPw(e.target.value)} /></Field>
        {err && <p role="alert" className="mb-3 text-sm text-red-700">{err}</p>}
        <button className="btn w-full">Sign in</button>
      </form>
      <p className="mt-4 text-sm text-slate-600">New here? <Link href="/register" className="font-medium text-forest underline">Create an account</Link></p>
      <div className="mt-8 border-t pt-4">
        <p className="mb-2 text-xs text-slate-500">Try a demo account</p>
        <div className="flex flex-wrap gap-2">
          {DEMO.map(([l, e, p]) => (<button key={e} onClick={() => go(e, p)} className="btn-ghost">{l}</button>))}
        </div>
      </div>
    </AuthFrame>
  );
}
