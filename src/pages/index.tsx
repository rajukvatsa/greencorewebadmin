const metrics = [
  { label: "Active Users", value: "1,248", change: "+12% vs last week" },
  { label: "Upcoming Shifts", value: "34", change: "6 need coverage" },
  { label: "Open Tickets", value: "18", change: "5 high priority" },
  { label: "Vendor Tasks", value: "42", change: "68% completed" },
];

const scheduleItems = [
  {
    title: "Warehouse Inventory",
    time: "09:00 - 11:00",
    owner: "Staff",
    status: "On Track",
  },
  {
    title: "Client Onboarding",
    time: "12:30 - 14:00",
    owner: "Admin",
    status: "Requires Docs",
  },
  {
    title: "Vendor Delivery",
    time: "15:00 - 16:30",
    owner: "Vendors",
    status: "Awaiting Check-In",
  },
];

const availability = [
  { label: "Staff", value: 78 },
  { label: "Admin", value: 92 },
  { label: "Vendors", value: 64 },
  { label: "Customer Requests", value: 55 },
];

const notifications = [
  {
    title: "Policy update shared",
    detail: "Admin role published a new compliance memo",
    time: "15m ago",
  },
  {
    title: "Schedule conflict",
    detail: "Staff shift overlaps with maintenance window",
    time: "1h ago",
  },
  {
    title: "Vendor invoice pending",
    detail: "Vendor networks invoice needs approval",
    time: "3h ago",
  },
];

export default function Home() {
  return (
    <div className="space-y-8">
      <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map((item) => (
          <div
            key={item.label}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <div className="text-sm font-medium text-slate-500">{item.label}</div>
            <div className="mt-3 text-3xl font-semibold text-slate-900">
              {item.value}
            </div>
            <div className="mt-2 text-sm text-emerald-600">{item.change}</div>
          </div>
        ))}
      </section>

      <section className="grid gap-6 xl:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-900">
              Daily Schedule
            </h2>
            <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700">
              Manage Schedule
            </button>
          </div>
          <div className="mt-6 space-y-4">
            {scheduleItems.map((item) => (
              <div
                key={item.title}
                className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-3"
              >
                <div>
                  <div className="text-sm font-semibold text-slate-900">
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-500">{item.owner}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-medium text-slate-500">
                    {item.time}
                  </div>
                  <div className="text-xs text-emerald-600">{item.status}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Availability</h2>
          <div className="mt-6 space-y-4">
            {availability.map((item) => (
              <div key={item.label}>
                <div className="flex items-center justify-between text-sm font-medium text-slate-600">
                  <span>{item.label}</span>
                  <span>{item.value}%</span>
                </div>
                <div className="mt-2 h-2 w-full rounded-full bg-slate-100">
                  <div
                    className="h-2 rounded-full bg-emerald-500"
                    style={{ width: `${item.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-6 md:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Map Overview</h2>
          <div className="mt-4 rounded-xl bg-slate-100 px-6 py-12 text-center text-sm text-slate-500">
            Map integrations can be configured to track live vendor locations and customer visits.
          </div>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Notifications</h2>
          <div className="mt-4 space-y-4">
            {notifications.map((item) => (
              <div key={item.title} className="rounded-xl bg-slate-50 px-4 py-3">
                <div className="text-sm font-semibold text-slate-900">
                  {item.title}
                </div>
                <div className="text-xs text-slate-500">{item.detail}</div>
                <div className="mt-2 text-xs text-slate-400">{item.time}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
