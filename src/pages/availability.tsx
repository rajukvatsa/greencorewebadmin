const teams = [
  {
    name: "Administration",
    role: "Admin",
    coverage: "Full",
    windows: ["07:00 - 12:00", "13:00 - 18:00"],
    status: "Green",
  },
  {
    name: "Field Support",
    role: "Staff",
    coverage: "Partial",
    windows: ["09:00 - 14:00", "17:00 - 21:00"],
    status: "Amber",
  },
  {
    name: "Logistics Vendors",
    role: "Vendors",
    coverage: "Limited",
    windows: ["10:00 - 16:00"],
    status: "Red",
  },
  {
    name: "Customer Success",
    role: "Customer",
    coverage: "Full",
    windows: ["08:00 - 20:00"],
    status: "Green",
  },
];

const statusMap: Record<string, string> = {
  Green: "bg-emerald-100 text-emerald-700",
  Amber: "bg-amber-100 text-amber-700",
  Red: "bg-rose-100 text-rose-700",
};

export default function AvailabilityPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Availability Matrix</h1>
          <p className="text-sm text-slate-500">
            Track real-time coverage and fill gaps before they impact customers.
          </p>
        </div>
        <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700">
          Recalculate Coverage
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {teams.map((team) => (
          <div
            key={team.name}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">{team.name}</h2>
                <div className="mt-1 text-sm text-slate-500">{team.role}</div>
              </div>
              <span
                className={`rounded-full px-3 py-1 text-xs font-medium ${statusMap[team.status]}`}
              >
                {team.coverage}
              </span>
            </div>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              {team.windows.map((window) => (
                <div
                  key={window}
                  className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span>Shift</span>
                  <span className="font-medium text-slate-900">{window}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
