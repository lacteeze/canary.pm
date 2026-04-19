import Topbar from '@ui/topbar';

export default function Messages() {
  return (<>
    <Topbar title="Messages" crumbs="Tenant portal"/>
    <div className="app-content">
      <div className="empty-hint">Details for "messages" go here.</div>
    </div>
  </>);
}
