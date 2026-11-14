export default function SensorMetricCard({
  title,
  value,
  unit,
  status = 'normal', // 'normal' | 'warning' | 'critical'
  icon: Icon,
  subtitle,
  trend,
}) {
  const statusStyles = {
    normal: {
      border: 'hover:border-cyan/40',
      badge: 'bg-status-success/10 text-status-success border-status-success/20',
      badgeDot: 'bg-status-success',
      badgeText: 'Optimal',
      iconContainer: 'bg-cyan/10 text-cyan border-cyan/20',
    },
    warning: {
      border: 'hover:border-status-warning/50 border-status-warning/30',
      badge: 'bg-status-warning/10 text-status-warning border-status-warning/20',
      badgeDot: 'bg-status-warning',
      badgeText: 'Warning',
      iconContainer: 'bg-status-warning/10 text-status-warning border-status-warning/25',
    },
    critical: {
      border: 'border-status-danger/40 hover:border-status-danger shadow-danger-glow',
      badge: 'bg-status-danger/15 text-status-danger border-status-danger/30',
      badgeDot: 'bg-status-danger animate-pulse',
      badgeText: 'Critical',
      iconContainer: 'bg-status-danger/15 text-status-danger border-status-danger/30',
    },
  }[status] || {
    border: 'hover:border-cyan/40',
    badge: 'bg-white/5 text-titanium-400 border-white/10',
    badgeDot: 'bg-titanium-400',
    badgeText: 'Active',
    iconContainer: 'bg-white/5 text-cyan border-white/10',
  };

  return (
    <div className={`helmet-card relative p-5 transition-all duration-200 ${statusStyles.border}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          {Icon && (
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border ${statusStyles.iconContainer}`}>
              <Icon className="h-5 w-5" />
            </div>
          )}
          <div>
            <span className="text-xs font-medium text-titanium-400 block tracking-wide">
              {title}
            </span>
            <div className="flex items-baseline gap-1.5 mt-0.5">
              <span className="sensor-val text-2xl font-bold tracking-tight text-white">
                {value}
              </span>
              {unit && (
                <span className="font-mono text-[11px] text-titanium-400 font-medium">
                  {unit}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Status Pill */}
        <div className={`flex items-center gap-1.5 px-2 py-0.5 rounded-full border text-[11px] font-medium ${statusStyles.badge}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${statusStyles.badgeDot}`} />
          <span>{statusStyles.badgeText}</span>
        </div>
      </div>

      {(subtitle || trend) && (
        <div className="mt-3.5 pt-3 border-t border-canvas-border flex items-center justify-between text-xs text-titanium-400">
          <span className="truncate">{subtitle}</span>
          {trend && (
            <span
              className={`font-mono text-[11px] font-semibold ${
                status === 'critical'
                  ? 'text-status-danger'
                  : status === 'warning'
                  ? 'text-status-warning'
                  : 'text-cyan'
              }`}
            >
              {trend}
            </span>
          )}
        </div>
      )}
    </div>
  );
}
