'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useStore } from '@/lib/storeProvider';
export default function Home() {
  const { me, ready } = useStore(); const r = useRouter();
  useEffect(() => { if (ready) r.replace(me ? '/dashboard' : '/login'); }, [ready, me, r]);
  return null;
}
