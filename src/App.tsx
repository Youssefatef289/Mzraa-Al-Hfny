import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { ProductsProvider } from './context/ProductsProvider';
import Storefront from './pages/Storefront';

const AdminLogin = lazy(() => import('./pages/admin/AdminLogin'));
const AdminDashboard = lazy(() => import('./pages/admin/AdminDashboard'));
const RequireAuth = lazy(() => import('./pages/admin/RequireAuth'));

function AdminFallback() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center" dir="rtl">
      <div className="text-sm font-bold text-slate-500 animate-pulse">جاري التحميل...</div>
    </div>
  );
}

export default function App() {
  return (
    <ProductsProvider>
      <Routes>
        <Route path="/" element={<Storefront />} />
        <Route
          path="/admin/login"
          element={
            <Suspense fallback={<AdminFallback />}>
              <AdminLogin />
            </Suspense>
          }
        />
        <Route
          path="/admin/dashboard"
          element={
            <Suspense fallback={<AdminFallback />}>
              <RequireAuth>
                <AdminDashboard />
              </RequireAuth>
            </Suspense>
          }
        />
        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ProductsProvider>
  );
}
