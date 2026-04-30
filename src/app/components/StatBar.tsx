import { cn } from '../lib/utils';

export interface StatItem {
  label: string;
  value: string | number;
  color?: 'default' | 'green' | 'red' | 'yellow' | 'blue' | 'purple' | 'gray' | 'orange';
}

const dotColor: Record<string, string> = {
  default: 'bg-slate-400',
  green: 'bg-green-500',
  red: 'bg-red-500',
  yellow: 'bg-yellow-500',
  blue: 'bg-blue-500',
  purple: 'bg-purple-500',
  gray: 'bg-gray-500',
  orange: 'bg-orange-500',
};

const valueColor: Record<string, string> = {
  default: 'text-white',
  green: 'text-green-400',
  red: 'text-red-400',
  yellow: 'text-yellow-400',
  blue: 'text-blue-400',
  purple: 'text-purple-400',
  gray: 'text-gray-400',
  orange: 'text-orange-400',
};

export function StatBar({ items }: { items: StatItem[] }) {
  return (
    <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-lg bg-slate-900/60 border border-slate-800 px-4 py-2">
      {items.map((item, i) => (
        <div key={i} className="flex items-center gap-2 text-sm">
          <div className={cn('size-1.5 rounded-full', dotColor[item.color ?? 'default'])} />
          <span className="text-slate-400">{item.label}</span>
          <span className={cn('font-semibold tabular-nums', valueColor[item.color ?? 'default'])}>{item.value}</span>
        </div>
      ))}
    </div>
  );
}
