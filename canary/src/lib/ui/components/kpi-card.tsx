import { ArrowUp, ArrowDown } from 'lucide-react';
import Sparkline from './sparkline';

interface KpiCardProps {
  label: string;
  value: string | number;
  delta?: string;
  up?: boolean;
  spark?: number[];
}

export default function KpiCard({ label, value, delta, up, spark }: KpiCardProps) {
  return (
    <div className="kpi-card">
      <div className="label">{label}</div>
      <div className="value">{value}</div>
      {delta && (
        <div className={`delta ${up ? 'up' : 'down'}`}>
          {up ? <ArrowUp size={11} /> : <ArrowDown size={11} />} {delta}
        </div>
      )}
      {spark && (
        <div className="spark">
          <Sparkline data={spark} color={up ? '#1f9d55' : '#d14343'} fill />
        </div>
      )}
    </div>
  );
}
