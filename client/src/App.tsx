import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/language-provider";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import Home from "@/pages/home";
import Categories from "@/pages/categories";
import Products from "@/pages/products";
import Contact from "@/pages/contact";
import Catalog from "@/pages/catalog";
import CategoryDetail from "@/pages/category-detail";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import CartPage from "@/pages/CartPage";
import CheckoutPage from "@/pages/CheckoutPage";
import RegisterPage from "@/pages/RegisterPage";
import LoginPage from "@/pages/LoginPage";
import ProfilePage from "@/pages/ProfilePage";
import ProtectedRoute from "@/components/ProtectedRoute";
import AdminRoute from "@/components/AdminRoute";
import OrderSuccessPage from "@/pages/OrderSuccessPage";
import AdminDashboardPage from "@/pages/admin/AdminDashboardPage";
import AdminProductsPage from "@/pages/admin/AdminProductsPage";
import AdminOrdersPage from "@/pages/admin/AdminOrdersPage";
import AdminBlogPage from "@/pages/admin/AdminBlogPage";
import AdminCategoriesPage from "@/pages/admin/AdminCategoriesPage";
import BlogPage from "@/pages/BlogPage";
import BlogPostPage from "@/pages/BlogPostPage";
import SearchPage from "@/pages/SearchPage";
import NotFound from "@/pages/not-found";
import { AIChatWidget } from "@/components/AIChatWidget";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/categories" component={Categories} />
      <Route path="/products" component={Products} />
      <Route path="/catalog" component={Catalog} />
      <Route path="/category/:slug">
        {(params) => <CategoryDetail params={params} />}
      </Route>
      <Route path="/products/:slug">
        {(params) => <ProductDetailsPage />}
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
      <Route path="/order-success" component={OrderSuccessPage} />
      <Route path="/contact" component={Contact} />
      <Route path="/blog" component={BlogPage} />
      <Route path="/blog/:slug" component={BlogPostPage} />
      <Route path="/search" component={SearchPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AuthProvider>
          <CartProvider>
            <TooltipProvider>
              <Toaster />
              <Router />
              <AIChatWidget />
            </TooltipProvider>
          </CartProvider>
        </AuthProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
