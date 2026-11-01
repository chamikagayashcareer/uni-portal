'use client';
export function PageHeader({ title, sub, action }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
      <div>
        <h1 className="font-display text-3xl text-forest">{title}</h1>
        {sub && <p className="mt-1 text-sm text-slate-500">{sub}</p>}
      </div>
      {action}
    </div>
  );
}
export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-black/40 p-4" onClick={onClose}>
      <div className="mt-12 w-full max-w-md rounded-lg bg-white p-5 shadow-xl" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={title}>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl text-forest">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700" aria-label="Close">✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}
export function Field({ label, children }) {
  return (<label className="mb-3 block"><span className="mb-1 block text-sm font-medium text-slate-700">{label}</span>{children}</label>);
}
export function Select({ value, onChange, options, placeholder, ...p }) {
  return (
    <select className="inp" value={value ?? ''} onChange={(e) => onChange(e.target.value)} {...p}>
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => (<option key={o.value} value={o.value}>{o.label}</option>))}
    </select>
  );
}
const tone = { admin: 'bg-gold/20 text-gold-dark', hod: 'bg-forest text-white', lecturer: 'bg-sky-100 text-sky-800', student: 'bg-slate-100 text-slate-700' };
export const RoleBadge = ({ role, label }) => (<span className={`rounded-full px-2 py-0.5 text-xs font-medium ${tone[role]}`}>{label}</span>);
export const Empty = ({ children }) => (<div className="card p-8 text-center text-sm text-slate-500">{children}</div>);
export const fmtSize = (b) => (b > 1048576 ? (b / 1048576).toFixed(1) + ' MB' : Math.max(1, Math.round(b / 1024)) + ' KB');