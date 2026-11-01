'use client';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useStore } from '@/lib/storeProvider';
import { ROLES } from '@/lib/data';

const NAV = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/courses', label: 'Courses' },
  { href: '/departments', label: 'Departments' },
  { href: '/batches', label: 'Batches', roles: ['admin', 'hod', 'lecturer'] },
  { href: '/users', label: 'Users', roles: ['admin', 'hod', 'lecturer'] },
  { href: '/profile', label: 'Profile' },
];

export default function Shell({ children }) {
  const { me, ready, logout } = useStore();
  const path = usePathname();
  const router = useRouter();
  const [open, setOpen] = useState(false);
  useEffect(() => { if (ready && !me) router.replace('/login'); }, [ready, me, router]);
  useEffect(() => setOpen(false), [path]);
  if (!me) return <div className="p-10 text-sm text-slate-500">Loading…</div>;

  const links = NAV.filter((n) => !n.roles || n.roles.includes(me.role));
  return (
    <div className="min-h-screen md:flex">
      <header className="flex items-center justify-between bg-forest p-3 text-white md:hidden">
        <span className="font-display text-lg">Ashlar University</span>
        <button onClick={() => setOpen(!open)} className="rounded border border-forest-line px-2 py-1 text-sm">Menu</button>
      </header>
      <aside className={`${open ? 'block' : 'hidden'} w-full shrink-0 bg-forest text-white md:sticky md:top-0 md:block md:h-screen md:w-60`}>
        <div className="hidden px-5 py-6 md:block">
          <div className="font-display text-xl leading-tight">Ashlar<br />University</div>
          <div className="mt-1 text-xs text-white/50">Academic portal</div>
        </div>
        <nav className="space-y-1 px-3 pb-3">
          {links.map((l) => {
            const on = path === l.href || path.startsWith(l.href + '/');
            return (
              <Link key={l.href} href={l.href} className={`block rounded-md border-l-4 px-3 py-2 text-sm ${on ? 'border-gold bg-forest-soft font-medium' : 'border-transparent text-white/75 hover:bg-forest-soft'}`}>{l.label}</Link>
            );
          })}
        </nav>
        <div className="border-t border-forest-line px-5 py-4 text-sm md:absolute md:bottom-0 md:w-60">
          <div className="font-medium">{me.name}</div>
          <div className="text-xs text-white/60">{ROLES[me.role]}</div>
          <button onClick={() => { logout(); router.replace('/login'); }} className="mt-2 text-xs text-gold underline">Sign out</button>
        </div>
      </aside>
      <main className="min-w-0 flex-1 p-5 md:p-8">{children}</main>
    </div>
  );
}
