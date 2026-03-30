export default function RootLoading() {
  return (
    <div className="fixed inset-0 bg-white flex flex-col items-center justify-center space-y-6 z-[100]">
      <div className="relative w-20 h-20">
        <div className="absolute inset-0 border-t-2 border-primary rounded-full animate-spin" />
        <div className="absolute inset-2 border-t-2 border-accent rounded-full animate-spin-slow" />
      </div>
      <div className="space-y-2 text-center">
        <h2 className="font-serif text-2xl font-bold text-accent tracking-tighter">
          Celebration<span className="text-primary italic font-medium">Finds</span>
        </h2>
        <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-slate-400">Curating Moments...</p>
      </div>
    </div>
  );
}
