import Topbar from '@ui/topbar';

export default function Lease() {
  return (<>
    <Topbar title="My lease" crumbs="Tenant portal"/>
    <div className="app-content">
      <div className="empty-hint">Details for "lease" go here.</div>
    </div>
  </>);
}
