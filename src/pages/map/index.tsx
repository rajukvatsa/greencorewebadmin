const regions = [
  {
    title: "North Zone",
    vendors: 12,
    status: "On Time",
    notes: "Delivery routes cleared, no incidents reported.",
  },
  {
    title: "Central Hub",
    vendors: 9,
    status: "Attention",
    notes: "Customer escalations require site supervisor approval.",
  },
  {
    title: "Coastal Area",
    vendors: 7,
    status: "Delayed",
    notes: "Weather monitoring in effect. Expect 45 minute delay.",
  },
];

export default function MapPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Operations Map</h1>
          <p className="text-sm text-slate-500">
            Visualise vendor routes, customer clusters, and escalation zones.
          </p>
        </div>
        <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700">
          Sync GPS Feed
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-900 p-8 text-slate-200 shadow-sm">
        <div className="grid gap-8 xl:grid-cols-2">
          <div className="rounded-xl bg-slate-800 px-6 py-16 text-center text-sm text-slate-400">
            Integrate with your preferred mapping provider to unlock live tracking overlays.
          </div>
          <div className="space-y-4">
            {regions.map((region) => (
              <div
                key={region.title}
                className="rounded-xl bg-slate-800 px-5 py-4"
              >
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-white">{region.title}</span>
                  <span className="text-slate-400">{region.vendors} vendors</span>
                </div>
                <div className="mt-2 text-xs text-emerald-400">{region.status}</div>
                <p className="mt-3 text-xs text-slate-400">{region.notes}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
