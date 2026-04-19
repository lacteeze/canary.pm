import { Route, Switch, Redirect } from 'wouter';
import AppLayout from '@ui/app-layout';
import AuthGuard from '@ui/auth-guard';

// Public pages
import Landing from '@pages/landing';
import Rentals from '@pages/rentals';
import Owners from '@pages/owners';
import Pricing from '@pages/pricing';
import Login from '@pages/login';

// Manager pages
import ManagerDashboard from '@pages/manager/dashboard';
import ManagerInbox from '@pages/manager/inbox';
import ManagerPeople from '@pages/manager/people';
import ManagerProperties from '@pages/manager/properties';
import ManagerProperty from '@pages/manager/property';
import ManagerPortfolios from '@pages/manager/portfolios';
import ManagerLeases from '@pages/manager/leases';
import ManagerProjects from '@pages/manager/projects';
import ManagerPayments from '@pages/manager/payments';
import ManagerListings from '@pages/manager/listings';
import ManagerReports from '@pages/manager/reports';

// Owner pages
import OwnerDashboard from '@pages/owner/dashboard';
import OwnerPortfolios from '@pages/owner/portfolios';
import OwnerProperties from '@pages/owner/properties';
import OwnerStatements from '@pages/owner/statements';
import OwnerProjects from '@pages/owner/projects';
import OwnerDocuments from '@pages/owner/documents';

// Tenant pages
import TenantDashboard from '@pages/tenant/dashboard';
import TenantPay from '@pages/tenant/pay';
import TenantRequests from '@pages/tenant/requests';
import TenantLease from '@pages/tenant/lease';
import TenantMessages from '@pages/tenant/messages';

// Vendor pages
import VendorDashboard from '@pages/vendor/dashboard';
import VendorSchedule from '@pages/vendor/schedule';
import VendorInvoices from '@pages/vendor/invoices';
import VendorRatings from '@pages/vendor/ratings';

export default function App() {
  return (
    <Switch>
      {/* Public routes */}
      <Route path="/" component={Landing} />
      <Route path="/rentals" component={Rentals} />
      <Route path="/owners" component={Owners} />
      <Route path="/pricing" component={Pricing} />
      <Route path="/login" component={Login} />

      {/* Manager routes */}
      <Route path="/manager" nest>
        <AuthGuard>
          <AppLayout role="manager">
            <Switch>
              <Route path="/dashboard" component={ManagerDashboard} />
              <Route path="/inbox" component={ManagerInbox} />
              <Route path="/people" component={ManagerPeople} />
              <Route path="/properties" component={ManagerProperties} />
              <Route path="/properties/:id" component={ManagerProperty} />
              <Route path="/portfolios" component={ManagerPortfolios} />
              <Route path="/leases" component={ManagerLeases} />
              <Route path="/projects" component={ManagerProjects} />
              <Route path="/payments" component={ManagerPayments} />
              <Route path="/listings" component={ManagerListings} />
              <Route path="/reports" component={ManagerReports} />
              <Route><Redirect to="/dashboard" /></Route>
            </Switch>
          </AppLayout>
        </AuthGuard>
      </Route>

      {/* Owner routes */}
      <Route path="/owner" nest>
        <AuthGuard>
          <AppLayout role="owner">
            <Switch>
              <Route path="/dashboard" component={OwnerDashboard} />
              <Route path="/portfolios" component={OwnerPortfolios} />
              <Route path="/properties" component={OwnerProperties} />
              <Route path="/statements" component={OwnerStatements} />
              <Route path="/projects" component={OwnerProjects} />
              <Route path="/documents" component={OwnerDocuments} />
              <Route><Redirect to="/dashboard" /></Route>
            </Switch>
          </AppLayout>
        </AuthGuard>
      </Route>

      {/* Tenant routes */}
      <Route path="/tenant" nest>
        <AuthGuard>
          <AppLayout role="tenant">
            <Switch>
              <Route path="/dashboard" component={TenantDashboard} />
              <Route path="/pay" component={TenantPay} />
              <Route path="/requests" component={TenantRequests} />
              <Route path="/lease" component={TenantLease} />
              <Route path="/messages" component={TenantMessages} />
              <Route><Redirect to="/dashboard" /></Route>
            </Switch>
          </AppLayout>
        </AuthGuard>
      </Route>

      {/* Vendor routes */}
      <Route path="/vendor" nest>
        <AuthGuard>
          <AppLayout role="vendor">
            <Switch>
              <Route path="/dashboard" component={VendorDashboard} />
              <Route path="/schedule" component={VendorSchedule} />
              <Route path="/invoices" component={VendorInvoices} />
              <Route path="/ratings" component={VendorRatings} />
              <Route><Redirect to="/dashboard" /></Route>
            </Switch>
          </AppLayout>
        </AuthGuard>
      </Route>

      {/* Fallback */}
      <Route><Redirect to="/" /></Route>
    </Switch>
  );
}
