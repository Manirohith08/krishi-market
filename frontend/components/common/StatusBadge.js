const STATUS_CONFIG = {
  'Pending':          { cls: 'bg-amber-100 text-amber-800',   icon: '⏳' },
  'Confirmed':        { cls: 'bg-blue-100 text-blue-800',     icon: '✅' },
  'Packed':           { cls: 'bg-indigo-100 text-indigo-800', icon: '📦' },
  'Out for Delivery': { cls: 'bg-purple-100 text-purple-700', icon: '🚚' },
  'Delivered':        { cls: 'bg-green-100 text-green-800',   icon: '🎉' },
  'Cancelled':        { cls: 'bg-red-100 text-red-700',       icon: '❌' },
};

export default function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || { cls: 'bg-stone-100 text-stone-600', icon: '·' };
  return (
    <span className={`status-pill ${cfg.cls}`}>
      <span>{cfg.icon}</span>
      {status}
    </span>
  );
}
