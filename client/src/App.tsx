import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/components/language-provider";
import Home from "@/pages/home";
import Categories from "@/pages/categories";
import Products from "@/pages/products";
import Contact from "@/pages/contact";
import Catalog from "@/pages/catalog";
import CategoryDetail from "@/pages/category-detail";
import ProductDetailsPage from "@/pages/ProductDetailsPage";
import NotFound from "@/pages/not-found";

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
      <Route path="/contact" component={Contact} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
