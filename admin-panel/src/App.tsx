import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { lazy, Suspense } from 'react';

import { Layout } from '@/components/layout/Layout';
import Login from '@/pages/Login';
import Dashboard from '@/pages/Dashboard';
import { Skeleton } from '@/components/ui/skeleton';

const SermonsPage = lazy(() => import('@/pages/sermons/SermonsPage'));
const BooksPage = lazy(() => import('@/pages/books/BooksPage'));
const EventsPage = lazy(() => import('@/pages/events/EventsPage'));
const SeriesPage = lazy(() => import('@/pages/series/SeriesPage'));
const CategoriesPage = lazy(() => import('@/pages/categories/CategoriesPage'));
const HeroSlidersPage = lazy(() => import('@/pages/hero-sliders/HeroSlidersPage'));
const UsersPage = lazy(() => import('@/pages/users/UsersPage'));
const DonationsPage = lazy(() => import('@/pages/donations/DonationsPage'));
const PartnershipsPage = lazy(() => import('@/pages/partnerships/PartnershipsPage'));
const ChurchCentresPage = lazy(() => import('@/pages/church-centres/ChurchCentresPage'));
const BankAccountsPage = lazy(() => import('@/pages/bank-accounts/BankAccountsPage'));
const DonationTypesPage = lazy(() => import('@/pages/donation-types/DonationTypesPage'));
const PartnershipTypesPage = lazy(() => import('@/pages/partnership-types/PartnershipTypesPage'));
const NotificationsPage = lazy(() => import('@/pages/notifications/NotificationsPage'));
const SettingsPage = lazy(() => import('@/pages/settings/SettingsPage'));
const SupportTicketsPage = lazy(() => import('@/pages/support-tickets/SupportTicketsPage'));
const ServiceTimesPage = lazy(() => import('@/pages/service-times/ServiceTimesPage'));

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 30_000, retry: 1 } },
});

function PageFallback() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-64" />
      <Skeleton className="h-96 w-full" />
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  if (isLoading) return <PageFallback />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-64 w-96" />
      </div>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={isAuthenticated ? <Navigate to="/" replace /> : <Login />} />
      <Route element={<ProtectedRoute><Layout /></ProtectedRoute>}>
        <Route index element={<Dashboard />} />
        <Route path="sermons" element={<Suspense fallback={<PageFallback />}><SermonsPage /></Suspense>} />
        <Route path="books" element={<Suspense fallback={<PageFallback />}><BooksPage /></Suspense>} />
        <Route path="events" element={<Suspense fallback={<PageFallback />}><EventsPage /></Suspense>} />
        <Route path="series" element={<Suspense fallback={<PageFallback />}><SeriesPage /></Suspense>} />
        <Route path="categories" element={<Suspense fallback={<PageFallback />}><CategoriesPage /></Suspense>} />
        <Route path="hero-sliders" element={<Suspense fallback={<PageFallback />}><HeroSlidersPage /></Suspense>} />
        <Route path="users" element={<Suspense fallback={<PageFallback />}><UsersPage /></Suspense>} />
        <Route path="donations" element={<Suspense fallback={<PageFallback />}><DonationsPage /></Suspense>} />
        <Route path="partnerships" element={<Suspense fallback={<PageFallback />}><PartnershipsPage /></Suspense>} />
        <Route path="church-centres" element={<Suspense fallback={<PageFallback />}><ChurchCentresPage /></Suspense>} />
        <Route path="bank-accounts" element={<Suspense fallback={<PageFallback />}><BankAccountsPage /></Suspense>} />
        <Route path="donation-types" element={<Suspense fallback={<PageFallback />}><DonationTypesPage /></Suspense>} />
        <Route path="partnership-types" element={<Suspense fallback={<PageFallback />}><PartnershipTypesPage /></Suspense>} />
        <Route path="notifications" element={<Suspense fallback={<PageFallback />}><NotificationsPage /></Suspense>} />
        <Route path="settings" element={<Suspense fallback={<PageFallback />}><SettingsPage /></Suspense>} />
        <Route path="support-tickets" element={<Suspense fallback={<PageFallback />}><SupportTicketsPage /></Suspense>} />
        <Route path="service-times" element={<Suspense fallback={<PageFallback />}><ServiceTimesPage /></Suspense>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
