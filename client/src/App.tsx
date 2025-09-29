import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "./components/ui/toaster";
import { TooltipProvider } from "./components/ui/tooltip";
import { LanguageProvider } from "./components/language-provider";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";
import { ThemeProvider } from "./components/theme-provider";
import { HelmetProvider } from 'react-helmet-async';
import ProtectedRoute from "./components/ProtectedRoute";
import AdminRoute from "./components/AdminRoute";
import { MobileBottomNav } from "./components/MobileBottomNav";
import { PageLoader } from "./components/PageLoader";
import { ErrorBoundary } from "./components/ErrorBoundary";

// Eager load - Critical pages
import Home from "./pages/home";
import NotFound from "./pages/not-found";

// Lazy load - User pages
const AllCategoriesPage = lazy(() => import("./pages/AllCategoriesPage"));
const Products = lazy(() => import("./pages/products"));
const Contact = lazy(() => import("./pages/contact"));
const Catalog = lazy(() => import("./pages/catalog"));
const CategoryDetail = lazy(() => import("./pages/category-detail"));
const ProductDetailsPage = lazy(() => import("./pages/ProductDetailsPage"));
const CartPage = lazy(() => import("./pages/CartPage"));
const CheckoutPage = lazy(() => import("./pages/CheckoutPage"));
const RegisterPage = lazy(() => import("./pages/RegisterPage"));
const LoginPage = lazy(() => import("./pages/LoginPage"));
const ProfilePage = lazy(() => import("./pages/ProfilePage"));
const OrderSuccessPage = lazy(() => import("./pages/OrderSuccessPage"));
const BlogPage = lazy(() => import("./pages/BlogPage"));
const BlogPostPage = lazy(() => import("./pages/BlogPostPage"));
const SearchPage = lazy(() => import("./pages/SearchPage"));
const FavoritesPage = lazy(() => import("./pages/FavoritesPage"));

// Lazy load - Admin pages (heavy bundle)
const AdminDashboardPage = lazy(() => import("./pages/admin/AdminDashboardPage"));
const AdminProductsPage = lazy(() => import("./pages/admin/AdminProductsPage"));
const AdminOrdersPage = lazy(() => import("./pages/admin/AdminOrdersPage"));
const AdminBlogPage = lazy(() => import("./pages/admin/AdminBlogPage"));
const AdminCategoriesPage = lazy(() => import("./pages/admin/AdminCategoriesPage"));
const AdminSEOPage = lazy(() => import("./pages/admin/AdminSEOPage"));
const AdminDiscountsPage = lazy(() => import("./pages/admin/AdminDiscountsPage"));
const AdminPushNotificationsPage = lazy(() => import("./pages/admin/AdminPushNotificationsPage"));
const AdminAnalyticsPage = lazy(() => import("./pages/admin/AdminAnalyticsPage"));
const AdminMarketingPage = lazy(() => import("./pages/admin/AdminMarketingPage"));
const AdminMarketingConfigPage = lazy(() => import("./pages/admin/AdminMarketingConfigPage"));
const ReportsPage = lazy(() => import("./pages/admin/ReportsPage"));

// Lazy load - Widgets (optional)
const AIChatWidget = lazy(() => import("./components/AIChatWidget").then(m => ({ default: m.AIChatWidget })));
const AppDownloadPrompt = lazy(() => import("./components/AppDownloadPrompt").then(m => ({ default: m.AppDownloadPrompt })));
const AppInstallPrompt = lazy(() => import("./components/AppInstallPrompt").then(m => ({ default: m.AppInstallPrompt })));

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/categories" component={AllCategoriesPage} />
        <Route path="/products" component={Products} />
        <Route path="/catalog" component={Catalog} />
        <Route path="/category/:slug">
          {(params) => <CategoryDetail params={params} />}
        </Route>
        <Route path="/products/:slug">
          {() => <ProductDetailsPage />}
        </Route>
        <Route path="/cart" component={CartPage} />
        <Route path="/checkout" component={CheckoutPage} />
        <Route path="/register" component={RegisterPage} />
        <Route path="/login" component={LoginPage} />
        <Route path="/profile">
          {() => (
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          )}
        </Route>
        <Route path="/favorites" component={FavoritesPage} />
        <Route path="/admin">
          {() => (
            <AdminRoute>
              <AdminDashboardPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/products">
          {() => (
            <AdminRoute>
              <AdminProductsPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/orders">
          {() => (
            <AdminRoute>
              <AdminOrdersPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/blog">
          {() => (
            <AdminRoute>
              <AdminBlogPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/categories">
          {() => (
            <AdminRoute>
              <AdminCategoriesPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/seo">
          {() => (
            <AdminRoute>
              <AdminSEOPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/reports">
          {() => (
            <AdminRoute>
              <ReportsPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/discounts">
          {() => (
            <AdminRoute>
              <AdminDiscountsPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/push-notifications">
          {() => (
            <AdminRoute>
              <AdminPushNotificationsPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/analytics">
          {() => (
            <AdminRoute>
              <AdminAnalyticsPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/marketing">
          {() => (
            <AdminRoute>
              <AdminMarketingPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/admin/marketing/config">
          {() => (
            <AdminRoute>
              <AdminMarketingConfigPage />
            </AdminRoute>
          )}
        </Route>
        <Route path="/order-success" component={OrderSuccessPage} />
        <Route path="/contact" component={Contact} />
        <Route path="/blog" component={BlogPage} />
        <Route path="/blog/:slug" component={BlogPostPage} />
        <Route path="/search" component={SearchPage} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <HelmetProvider>
        <QueryClientProvider client={queryClient}>
          <ThemeProvider>
            <LanguageProvider>
              <AuthProvider>
                <CartProvider>
                  <TooltipProvider>
                    <Toaster />
                    <main className="pb-20 md:pb-0">
                      <Router />
                    </main>
                    <MobileBottomNav />
                    <Suspense fallback={null}>
                      <AIChatWidget />
                      <AppDownloadPrompt />
                      <AppInstallPrompt />
                    </Suspense>
                  </TooltipProvider>
                </CartProvider>
              </AuthProvider>
            </LanguageProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </HelmetProvider>
    </ErrorBoundary>
  );
}

export default App;
