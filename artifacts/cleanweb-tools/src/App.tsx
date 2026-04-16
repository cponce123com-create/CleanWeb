import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";

// Pages
import Home from "@/pages/home";
import DeletePhotos from "@/pages/google/delete-photos";
import ExportPlaylist from "@/pages/youtube/export-playlist";
import ClearHistory from "@/pages/youtube/clear-history";
import UnfollowInstagram from "@/pages/instagram/unfollow";
import UnlikeInstagram from "@/pages/instagram/unlike";
import UnfollowTwitter from "@/pages/twitter/unfollow";
import DeleteTweets from "@/pages/twitter/delete-tweets";
import UnfollowFacebook from "@/pages/facebook/unfollow";
import UnfollowTiktok from "@/pages/tiktok/unfollow";
import UnlikeTiktok from "@/pages/tiktok/unlike";
import SpotifyExport from "@/pages/spotify/export-playlist";
import UnfollowLinkedin from "@/pages/linkedin/unfollow";
import DeleteRedditComments from "@/pages/reddit/delete-comments";

const queryClient = new QueryClient();

function Router() {
  return (
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
