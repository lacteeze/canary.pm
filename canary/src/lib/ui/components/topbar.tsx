import { Search, Bell } from 'lucide-react';

interface TopbarProps {
  title: string;
  crumbs?: string;
  actions?: React.ReactNode;
}

export default function Topbar({ title, crumbs, actions }: TopbarProps) {
  return (
    <div className="app-topbar">
      <div>
        {crumbs && <div className="crumbs">{crumbs}</div>}
        <h1>{title}</h1>
      </div>
      <div style={{ flex: 1 }} />
      <div className="search-input">
        <Search size={13} />
        <input placeholder="Search anything..." />
        <span className="kbd">⌘K</span>
      </div>
      <button className="btn btn-ghost btn-sm"><Bell size={14} /></button>
      {actions}
    </div>
  );
}
