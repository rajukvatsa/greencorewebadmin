const notificationChannels = [
  {
    channel: "Email",
    recipients: "Admin, Staff, Customer",
    frequency: "Immediate",
    detail: "Critical alerts, compliance updates, and approval workflows.",
  },
  {
    channel: "SMS",
    recipients: "Staff, Vendors",
    frequency: "15 min digest",
    detail: "Route adjustments, arrival confirmations, urgent customer escalations.",
  },
  {
    channel: "In-App",
    recipients: "All roles",
    frequency: "Real-time",
    detail: "Task assignments, reminders, system messages, and activity feeds.",
  },
];

const timeline = [
  {
    title: "Vendor dispatched",
    actor: "Automations",
    time: "5 minutes ago",
    summary: "Route 22 assigned to vendor cluster West-4",
  },
  {
    title: "Schedule approved",
    actor: "Admin",
    time: "32 minutes ago",
    summary: "Customer accepted revised availability window",
  },
  {
    title: "New customer ticket",
    actor: "Customer",
    time: "1 hour ago",
    summary: "High priority request logged for installation support",
  },
];

export default function NotificationsPage() {
  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Notifications Center</h1>
          <p className="text-sm text-slate-500">
            Tune alerts to keep Admin, Staff, Vendors, and Customers aligned.
          </p>
        </div>
        <button className="rounded-full bg-slate-900 px-4 py-2 text-xs font-medium text-white transition hover:bg-slate-700">
          Configure Channels
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Channels</h2>
          <div className="mt-4 space-y-4">
            {notificationChannels.map((item) => (
              <div
                key={item.channel}
                className="rounded-xl border border-slate-100 bg-slate-50 px-5 py-4"
              >
                <div className="flex items-center justify-between text-sm font-medium text-slate-700">
                  <span>{item.channel}</span>
                  <span className="text-xs text-slate-500">{item.frequency}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">Recipients: {item.recipients}</div>
                <p className="mt-3 text-sm text-slate-600">{item.detail}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">Recent Activity</h2>
          <div className="mt-4 space-y-4">
            {timeline.map((item) => (
              <div key={item.title} className="flex items-start gap-4">
                <div className="mt-1 h-2 w-2 rounded-full bg-emerald-500" />
                <div>
                  <div className="text-sm font-semibold text-slate-900">{item.title}</div>
                  <div className="text-xs text-slate-500">{item.actor} • {item.time}</div>
                  <p className="mt-2 text-sm text-slate-600">{item.summary}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
