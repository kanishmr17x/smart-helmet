export default function SensorMetricCard({
  title,
  value,
  unit,
  status = 'normal', // 'normal' | 'warning' | 'critical'
  icon: Icon,
  subtitle,
  trend,
}) {
  const statusColors = {
    normal: {
      border: 'border-canvas-border hover:border-cyan/50',
      badge: 'bg-status-success/15 text-status-success border-status-success/30',
      badgeText: 'OPTIMAL',
      iconBg: 'bg-cyan/10 text-cyan border-cyan/30',
    },
    warning: {
      border: 'border-status-warning/40 hover:border-status-warning',
      badge: 'bg-status-warning/15 text-status-warning border-status-warning/30',
      badgeText: 'ATTENTION',
      iconBg: 'bg-status-warning/10 text-status-warning border-status-warning/30',
    },
    critical: {
      border: 'border-status-danger/60 hover:border-status-danger shadow-danger-glow',
      badge: 'bg-status-danger/20 text-status-danger border-status-danger',
      badgeText: 'ALERT',
      iconBg: 'bg-status-danger/20 text-status-danger border-status-danger/40',
    },
  }[status] || {
    border: 'border-canvas-border',
    badge: 'bg-canvas-elevated text-titanium-300',
    badgeText: 'STATUS',
    iconBg: 'bg-canvas-card text-cyan',
  };

  return (
    <div className={`helmet-card relative p-5 transition-all ${statusColors.border}`}>
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border ${statusColors.iconBg}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-titanium-400">
              {title}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="sensor-val text-2xl font-black text-titanium-100">
                {value}
              </span>
              {unit && (
                <span className="font-mono text-xs text-titanium-400 font-medium">
                  {unit}
                </span>
              )}
            </div>
          </div>
        </div>

        <span className={`rounded-full px-2 py-0.5 text-[10px] font-mono font-bold border ${statusColors.badge}`}>
          {statusColors.badgeText}
        </span>
      </div>

      {subtitle && (
        <div className="mt-3 flex items-center justify-between border-t border-canvas-border/60 pt-2.5 text-[11px] text-titanium-400 font-mono">
          <span>{subtitle}</span>
          {trend && <span className="text-cyan font-bold">{trend}</span>}
        </div>
      )}
    </div>
  );
}
