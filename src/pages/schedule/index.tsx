const pipeline = [
  {
    title: "Morning Standup",
    owner: "Staff",
    window: "08:30 - 09:00",
    notes: "Review overnight escalations and success metrics.",
  },
  {
    title: "Operations Sync",
    owner: "Admin",
    window: "11:00 - 12:00",
    notes: "Confirm resource coverage and vendor compliance checks.",
  },
  {
    title: "Vendor Dispatch",
    owner: "Vendors",
    window: "14:00 - 15:30",
    notes: "Finalise routing and capture handoff photos.",
  },
  {
    title: "Customer Pulse",
    owner: "Customer",
    window: "16:00 - 17:00",
    notes: "Survey feedback and service satisfaction assessment.",
  },
];

export default function SchedulePage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Schedule Planner</h1>
          <p className="text-sm text-slate-500">
            Coordinate daily milestones and handoffs across every role.
          </p>
        </div>
        <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700">
          Publish Day Plan
        </button>
      </div>

      <div className="space-y-6">
        {pipeline.map((item, index) => (
          <div
            key={item.title}
            className="relative flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg font-semibold text-white">
              {index + 1}
            </div>
            <div className="flex-1">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="text-lg font-semibold text-slate-900">{item.title}</h2>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                  {item.owner}
                </span>
              </div>
              <div className="mt-2 text-sm text-slate-500">{item.window}</div>
              <p className="mt-4 text-sm text-slate-600">{item.notes}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
