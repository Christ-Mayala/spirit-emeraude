import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/core/lib/queryClient";
import { Toaster } from "@/core/ui/toaster";
import { TooltipProvider } from "@/core/ui/tooltip";
import { Layout } from "@/features/layout/Layout";
import Home from "@/features/home/Home";
import Shop from "@/features/shop/Shop";
import ProductDetail from "@/features/shop/ProductDetail";  // <-- IMPORT OBLIGATOIRE
import Formations from "@/features/formations/Formations";
import ImpactPage from "@/features/impact/Impact";
import Gallery from "@/features/gallery/Gallery";
import Contact from "@/features/contact/Contact";
import NotFound from "@/features/home/not-found";
import Login from "@/features/auth/Login";
import {
  Dashboard,
  AdminProducts,
  AdminFormations,
  AdminImpacts,
  AdminGallery,
  AdminContactMessages,
} from "@/features/admin";
import { AuthProvider } from "@/core/hooks/use-auth";
import { ScrollToTop } from "@/core/hooks/use-scroll-to-top";

function Router() {
  return (
    <Layout>
      <ScrollToTop />
      <Switch>
        <Route path="/" component={Home} />

        <Route path="/boutique" component={Shop} /> 
        <Route path="/boutique/:id">
          {(params) => <ProductDetail id={params.id} />}
        </Route>

        <Route path="/formations" component={Formations} />
        <Route path="/impact" component={ImpactPage} />
        <Route path="/galerie" component={Gallery} />
        <Route path="/contact" component={Contact} />
        <Route path="/login" component={Login} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/dashboard/products" component={AdminProducts} />
        <Route path="/dashboard/formations" component={AdminFormations} />
        <Route path="/dashboard/impacts" component={AdminImpacts} />
        <Route path="/dashboard/gallery" component={AdminGallery} />
        <Route path="/dashboard/contact-messages" component={AdminContactMessages} />

        <Route component={NotFound} />
      </Switch>
    </Layout>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AuthProvider>
          <Toaster />
          <Router />
        </AuthProvider>
      </TooltipProvider>
    </QueryClientProvider>
  );
}
