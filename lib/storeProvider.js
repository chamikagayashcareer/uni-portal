'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { seed } from './data';

const Ctx = createContext(null);
export const uid = (p) => p + Math.random().toString(36).slice(2, 8);

export function StoreProviders({ children }) {
  const [db, setDb] = useState(seed);
  const [meId, setMeId] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try { setMeId(sessionStorage.getItem('uid')); } catch { }
    setReady(true);
  }, []);

  const me = db.users.find((u) => u.id === meId) || null;

  const add = (t, item) => {
    console.log(process.env.BASE_URL)
    // const r = { id: uid(t[0]), ...item };
    // setDb((d) => ({ ...d, [t]: [...d[t], r] })); return r;
  };

  const update = (t, id, patch) => setDb((d) => ({ ...d, [t]: d[t].map((x) => (x.id === id ? { ...x, ...patch } : x)) }));

  const remove = (t, id) => setDb((d) => ({ ...d, [t]: d[t].filter((x) => x.id !== id) }));

  const setSession = (id) => { setMeId(id); try { id ? sessionStorage.setItem('uid', id) : sessionStorage.removeItem('uid'); } catch { } };

  const login = (email, password) => {
    const u = db.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase() && x.password === password);
    if (!u) return 'Email or password is incorrect.';
    setSession(u.id); return null;
  };
  const register = (data) => {
    if (db.users.some((x) => x.email.toLowerCase() === data.email.trim().toLowerCase())) return 'An account with this email already exists.';
    const u = add('users', { ...data, email: data.email.trim(), phone: '' });
    setSession(u.id); return null;
  };
  const logout = () => setSession(null);

  // module helpers: change one module's weeks
  const updateModule = (id, fn) => setDb((d) => ({ ...d, modules: d.modules.map((m) => (m.id === id ? fn(m) : m)) }));

  return (
    <Ctx.Provider value={{ db, me, ready, add, update, remove, login, register, logout, updateModule }}>{children}</Ctx.Provider>
  );
}
export const useStore = () => useContext(Ctx);

// what the signed-in role may manage
export const perms = (me) => ({
  admin: me?.role === 'admin',
  manageUsers: me?.role === 'admin',
  manageDepts: me?.role === 'admin',
  manageCourses: me?.role === 'admin' || me?.role === 'hod',
  manageBatches: me?.role === 'admin' || me?.role === 'hod',
});
export const canEditModule = (me, m) => me && (me.role === 'admin' || me.role === 'hod' || m.lecturerId === me.id);
