export default function AuthFrame({ title, sub, children }) {
  return (
    <div className="grid min-h-screen md:grid-cols-2">
      <div className="hidden flex-col justify-between bg-forest p-10 text-white md:flex">
        <div className="font-display text-2xl">Ashlar University</div>
        <div>
          <p className="font-display text-4xl leading-tight">Every course, module and batch in one place.</p>
          <p className="mt-4 max-w-sm text-white/65">Lecturers publish weekly material, heads of department shape courses, students find everything for their batch.</p>
        </div>
        <div className="text-xs text-white/40">Demo data only. Nothing is saved after a refresh.</div>
      </div>
      <div className="flex items-center justify-center p-6">
        <div className="w-full max-w-sm">
          <h1 className="font-display text-3xl text-forest">{title}</h1>
          <p className="mb-6 mt-1 text-sm text-slate-500">{sub}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
