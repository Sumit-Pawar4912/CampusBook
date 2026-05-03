const FeatureCard = ({ icon, title, description, accent }) => {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-200/40 transition duration-300 hover:-translate-y-1 hover:border-emerald-300 hover:bg-emerald-50/80">
      <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white shadow-xl shadow-slate-900/20">
        {icon}
      </div>
      <div className="mt-6 space-y-3">
        <div className="flex items-center gap-2">
          {accent && <span className="inline-flex rounded-full bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700">{accent}</span>}
          <h3 className="text-xl font-semibold text-slate-950">{title}</h3>
        </div>
        <p className="text-sm leading-6 text-slate-600">{description}</p>
      </div>
    </div>
  );
};

export default FeatureCard;
