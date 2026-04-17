import { lazy, Suspense } from "react";
import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";

// Eager-load the home page (above the fold, critical path)
import Home from "@/pages/home";

// Lazy-load all tool pages — only downloaded when the user navigates to them
const DeletePhotos         = lazy(() => import("@/pages/google/delete-photos"));
const ExportPlaylist       = lazy(() => import("@/pages/youtube/export-playlist"));
const ClearHistory         = lazy(() => import("@/pages/youtube/clear-history"));
const UnfollowInstagram    = lazy(() => import("@/pages/instagram/unfollow"));
const UnlikeInstagram      = lazy(() => import("@/pages/instagram/unlike"));
const UnfollowTwitter      = lazy(() => import("@/pages/twitter/unfollow"));
const DeleteTweets         = lazy(() => import("@/pages/twitter/delete-tweets"));
const UnfollowFacebook     = lazy(() => import("@/pages/facebook/unfollow"));
const UnfollowTiktok       = lazy(() => import("@/pages/tiktok/unfollow"));
const UnlikeTiktok         = lazy(() => import("@/pages/tiktok/unlike"));
const SpotifyExport        = lazy(() => import("@/pages/spotify/export-playlist"));
const UnfollowLinkedin     = lazy(() => import("@/pages/linkedin/unfollow"));
const DeleteRedditComments = lazy(() => import("@/pages/reddit/delete-comments"));
const NotFound             = lazy(() => import("@/pages/not-found"));

// Minimal skeleton shown while a lazy page is loading
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="flex flex-col items-center gap-4 text-muted-foreground">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        <span className="text-sm">Cargando herramienta…</span>
      </div>
    </div>
  );
}

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 min
      retry: 1,
    },
  },
});

function Router() {
  return (
    <Suspense fallback={<PageSkeleton />}>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/google-fotos" component={DeletePhotos} />
        <Route path="/youtube/exportar-playlist" component={ExportPlaylist} />
        <Route path="/youtube/borrar-historial" component={ClearHistory} />
        <Route path="/instagram/dejar-de-seguir" component={UnfollowInstagram} />
        <Route path="/instagram/quitar-likes" component={UnlikeInstagram} />
        <Route path="/twitter/dejar-de-seguir" component={UnfollowTwitter} />
        <Route path="/twitter/borrar-tweets" component={DeleteTweets} />
        <Route path="/facebook/dejar-de-seguir" component={UnfollowFacebook} />
        <Route path="/tiktok/dejar-de-seguir" component={UnfollowTiktok} />
        <Route path="/tiktok/quitar-likes" component={UnlikeTiktok} />
        <Route path="/spotify/exportar-playlist" component={SpotifyExport} />
        <Route path="/linkedin/dejar-de-seguir" component={UnfollowLinkedin} />
        <Route path="/reddit/borrar-comentarios" component={DeleteRedditComments} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
