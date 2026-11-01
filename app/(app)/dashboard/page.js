'use client';
import Link from 'next/link';
import { useStore } from '@/lib/storeProvider';
import { PageHeader, Empty } from '@/components/ui';

export default function Dashboard() {
  const { db, me } = useStore();
  const batch = db.batches.find((b) => b.id === me.batchId);
  const myModules = db.modules.filter((m) =>
    me.role === 'student' ? m.courseId === batch?.courseId : me.role === 'lecturer' ? m.lecturerId === me.id : me.role === 'hod' ? db.courses.find((c) => c.id === m.courseId)?.deptId === me.deptId : true);
  const recent = myModules.flatMap((m) => m.weeks.flatMap((w) => w.files.map((f) => ({ ...f, m, w })))).slice(-5).reverse();
  const stats = me.role === 'student' || me.role === 'lecturer'
    ? [['Modules', myModules.length], ['Materials', myModules.reduce((n, m) => n + m.weeks.reduce((k, w) => k + w.files.length, 0), 0)]]
    : [['Users', db.users.length], ['Students', db.users.filter((u) => u.role === 'student').length], ['Courses', db.courses.length], ['Batches', db.batches.length], ['Departments', db.departments.length]];
  return (
    <>
      <PageHeader title={`Welcome, ${me.name.split(' ')[0]}`} sub={me.role === 'student' && batch ? `Batch ${batch.name}` : 'Here is what is happening across the university.'} />
      <div className="mb-8 flex flex-wrap gap-x-10 gap-y-3 border-y border-slate-300 py-4">
        {stats.map(([l, n]) => (<div key={l}><div className="font-display text-3xl text-forest">{n}</div><div className="text-sm text-slate-500">{l}</div></div>))}
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <section>
          <h2 className="mb-3 font-display text-xl text-forest">{me.role === 'student' ? 'Your modules' : 'Modules'}</h2>
          {myModules.length === 0 ? <Empty>No modules yet.</Empty> : (
            <ul className="card divide-y">
              {myModules.map((m) => (
                <li key={m.id}><Link href={`/modules/${m.id}`} className="flex justify-between p-3 hover:bg-slate-50">
                  <span><span className="font-medium">{m.title}</span> <span className="text-sm text-slate-500">{m.code}</span></span>
                  <span className="text-sm text-slate-500">{m.weeks.length} weeks</span></Link></li>
              ))}
            </ul>
          )}
        </section>
        <section>
          <h2 className="mb-3 font-display text-xl text-forest">Latest materials</h2>
          {recent.length === 0 ? <Empty>Nothing uploaded yet.</Empty> : (
            <ul className="card divide-y">
              {recent.map((f) => (<li key={f.id} className="p-3 text-sm"><div className="font-medium">{f.name}</div><div className="text-slate-500">{f.m.title}, week {f.w.week}</div></li>))}
            </ul>
          )}
        </section>
      </div>
    </>
  );
}
