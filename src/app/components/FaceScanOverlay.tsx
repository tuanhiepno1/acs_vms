import { cn } from '../lib/utils';

interface FaceScanOverlayProps {
  photoUrl: string;
  name: string;
  status: 'granted' | 'denied';
  confidence?: number;
  timestamp?: string;
  deviceName?: string;
  className?: string;
  compact?: boolean;
}

export function FaceScanOverlay({
  photoUrl,
  name,
  status,
  confidence,
  timestamp,
  deviceName,
  className,
  compact = false,
}: FaceScanOverlayProps) {
  const accentColor = status === 'granted' ? '#22c55e' : '#ef4444';

  return (
    <div className={cn('relative overflow-hidden bg-slate-950 select-none', className)}>
      {/* Photo */}
      <img
        src={photoUrl}
        alt={`Face capture of ${name}`}
        className="w-full h-full object-cover"
        loading="lazy"
        draggable={false}
      />

      {/* Dark vignette - increased opacity for better text contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/50" />

      {/* Scan line animation */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute left-0 right-0 h-[2px] animate-scan"
          style={{ background: `linear-gradient(90deg, transparent, ${accentColor}80, transparent)` }}
        />
      </div>

      {/* Face bounding box */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className={cn(
            'relative border-2 rounded-sm',
            compact ? 'w-[55%] h-[65%]' : 'w-[48%] h-[58%]',
          )}
          style={{ borderColor: `${accentColor}90` }}
        >
          {/* Corner brackets */}
          <div className="absolute -top-[1px] -left-[1px] w-4 h-4 border-t-2 border-l-2 rounded-tl-sm" style={{ borderColor: accentColor }} />
          <div className="absolute -top-[1px] -right-[1px] w-4 h-4 border-t-2 border-r-2 rounded-tr-sm" style={{ borderColor: accentColor }} />
          <div className="absolute -bottom-[1px] -left-[1px] w-4 h-4 border-b-2 border-l-2 rounded-bl-sm" style={{ borderColor: accentColor }} />
          <div className="absolute -bottom-[1px] -right-[1px] w-4 h-4 border-b-2 border-r-2 rounded-br-sm" style={{ borderColor: accentColor }} />
        </div>
      </div>

      {/* Top left: REC indicator + device */}
      {!compact && (
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <div className="size-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-red-400 text-xs font-mono font-bold tracking-wider drop-shadow-md">REC</span>
          </div>
          {deviceName && (
            <span className="text-white text-xs font-mono drop-shadow-md">{deviceName}</span>
          )}
        </div>
      )}

      {/* Top right: confidence */}
      {confidence != null && (
        <div className="absolute top-3 right-3">
          <div
            className={cn(
              'px-2 py-1 rounded text-xs font-mono font-bold drop-shadow-md',
              compact ? 'text-[10px]' : '',
            )}
            style={{
              backgroundColor: `${accentColor}30`,
              color: accentColor,
              border: `1px solid ${accentColor}60`,
            }}
          >
            {(confidence * 100).toFixed(0)}%
          </div>
        </div>
      )}

      {/* Bottom: name + status + timestamp */}
      <div className={cn('absolute bottom-0 left-0 right-0 p-3', compact ? 'p-2' : 'p-3')}>
        <div className="flex items-end justify-between gap-2">
          <div className="min-w-0">
            <p className={cn('text-white font-bold truncate drop-shadow-md', compact ? 'text-sm' : 'text-base')}>{name}</p>
            {timestamp && !compact && (
              <p className="text-slate-200 text-xs font-mono drop-shadow-md">{timestamp}</p>
            )}
          </div>
          <div
            className={cn(
              'shrink-0 px-2 py-1 rounded text-xs font-bold uppercase tracking-wider drop-shadow-md',
              compact ? 'text-[10px]' : '',
            )}
            style={{
              backgroundColor: `${accentColor}40`,
              color: accentColor,
              border: `1px solid ${accentColor}70`,
            }}
          >
            {status === 'granted' ? 'PASS' : 'DENY'}
          </div>
        </div>
      </div>

      {/* Subtle noise overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'n\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'256\' height=\'256\' filter=\'url(%23n)\' opacity=\'1\'/%3E%3C/svg%3E")' }} />
    </div>
  );
}
