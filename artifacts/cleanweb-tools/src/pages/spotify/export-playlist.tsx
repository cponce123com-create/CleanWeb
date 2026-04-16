import { useState, useEffect } from "react";
import { SiSpotify } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const SPOTIFY_API_URL = "https://api.spotify.com/v1";

interface SpotifyPlaylist {
  id: string;
  name: string;
  tracks: { href: string; total: number };
}

interface SpotifyTrack {
  track: {
    name: string;
    artists: { name: string }[];
    album: { name: string };
    duration_ms: number;
    external_urls: { spotify: string };
  };
}

export default function SpotifyExport() {
  const [clientId, setClientId] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [playlists, setPlaylists] = useState<SpotifyPlaylist[]>([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState<SpotifyPlaylist | null>(null);
  const [tracks, setTracks] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const savedToken = localStorage.getItem("spotify_access_token");
    if (savedToken) {
      setToken(savedToken);
      fetchPlaylists(savedToken);
    }
  }, []);

  const handleConnect = () => {
    if (!clientId) {
      alert("Por favor, introduce tu Client ID");
      return;
    }
    const redirectUri = window.location.origin + "/spotify/exportar-playlist";
    const scope = "playlist-read-private playlist-read-collaborative";
    const authUrl =
      "https://accounts.spotify.com/authorize?client_id=" +
      clientId +
      "&response_type=token&redirect_uri=" +
      encodeURIComponent(redirectUri) +
      "&scope=" +
      encodeURIComponent(scope);
    window.location.href = authUrl;
  };

  const fetchPlaylists = async (accessToken: string) => {
    setIsLoading(true);
    try {
      const res = await fetch(SPOTIFY_API_URL + "/me/playlists", {
        headers: { Authorization: "Bearer " + accessToken },
      });
      if (res.ok) {
        const data = await res.json();
        setPlaylists(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchTracks = async (playlistId: string) => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(SPOTIFY_API_URL + "/playlists/" + playlistId + "/tracks", {
        headers: { Authorization: "Bearer " + token },
      });
      if (res.ok) {
        const data = await res.json();
        setTracks(data.items);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const downloadCSV = () => {
    if (tracks.length === 0) return;
    const rows = tracks
      .filter((t) => t.track)
      .map((t) => {
        const title = (t.track.name || "").replace(/"/g, '""');
        const artists = t.track.artists
          .map((a) => a.name)
          .join(", ")
          .replace(/"/g, '""');
        const album = (t.track.album.name || "").replace(/"/g, '""');
        const url = t.track.external_urls.spotify;
        return '"' + title + '","' + artists + '","' + album + '",' + t.track.duration_ms + ',"' + url + '"';
      });
    const csv = ['Título,Artistas,Álbum,Duración (ms),URL', ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "playlist-" + (selectedPlaylist?.name || "spotify") + ".csv";
    a.click();
  };

  const downloadJSON = () => {
    if (tracks.length === 0) return;
    const jsonStr = JSON.stringify(
      tracks.map((t) => t.track).filter(Boolean),
      null,
      2
    );
    const blob = new Blob([jsonStr], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "playlist-" + (selectedPlaylist?.name || "spotify") + ".json";
    a.click();
  };

  return (
    <ToolPageLayout
      title="Exportar playlist a CSV/JSON"
      platform="Spotify"
      platformIcon={<SiSpotify className="w-5 h-5 text-[#1DB954]" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Spotify" },
        { label: "Exportar playlist a CSV/JSON" },
      ]}
    >
      <div className="space-y-2 mb-10">
        <StepCard number={1}>
          Crea una app gratuita en{" "}
          <a
            href="https://developer.spotify.com/dashboard"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            developer.spotify.com
          </a>{" "}
          para obtener tu Client ID.
        </StepCard>
        <StepCard number={2}>
          En los ajustes de tu app de Spotify, añade como Redirect URI exactamente la URL de esta
          página.
        </StepCard>
        <StepCard number={3}>
          Introduce tu Client ID en el campo de abajo y haz clic en "Conectar con Spotify".
        </StepCard>
        <StepCard number={4}>
          Tras autorizar, selecciona una playlist y exporta en CSV o JSON.
        </StepCard>
      </div>

      <div className="bg-card border border-border p-6 rounded-xl mb-10">
        <h3 className="text-xl font-semibold mb-4">Autenticación</h3>
        {!token ? (
          <div className="space-y-4 max-w-md">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-1">
                Spotify Client ID
              </label>
              <Input
                data-testid="input-client-id"
                value={clientId}
                onChange={(e) => setClientId(e.target.value)}
                placeholder="Ej: a1b2c3d4e5f6..."
                className="bg-background"
              />
            </div>
            <Button
              data-testid="button-connect-spotify"
              onClick={handleConnect}
              className="w-full bg-[#1DB954] hover:bg-[#1ed760] text-black font-semibold"
            >
              <SiSpotify className="mr-2 h-5 w-5" />
              Conectar con Spotify
            </Button>
          </div>
        ) : (
          <div className="text-green-400 font-medium">Conectado a Spotify</div>
        )}
      </div>

      {token && (
        <div className="bg-card border border-border p-6 rounded-xl">
          <h3 className="text-xl font-semibold mb-4">Tus Playlists</h3>

          {!selectedPlaylist ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {playlists.map((p) => (
                <div
                  key={p.id}
                  data-testid={"card-playlist-" + p.id}
                  onClick={() => {
                    setSelectedPlaylist(p);
                    fetchTracks(p.id);
                  }}
                  className="p-4 border border-border rounded-lg hover:border-primary cursor-pointer transition-colors"
                >
                  <div className="font-semibold">{p.name}</div>
                  <div className="text-sm text-muted-foreground">
                    {p.tracks.total} canciones
                  </div>
                </div>
              ))}
              {playlists.length === 0 && !isLoading && (
                <div className="text-muted-foreground">No se encontraron playlists.</div>
              )}
              {isLoading && (
                <div className="text-muted-foreground">Cargando playlists...</div>
              )}
            </div>
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
                <div>
                  <h4 className="text-lg font-semibold">{selectedPlaylist.name}</h4>
                  <div className="text-sm text-muted-foreground">
                    {tracks.length} canciones cargadas
                  </div>
                </div>
                <div className="flex gap-2 flex-wrap">
                  <Button
                    data-testid="button-back-playlists"
                    onClick={() => setSelectedPlaylist(null)}
                    variant="outline"
                  >
                    Volver
                  </Button>
                  <Button
                    data-testid="button-download-csv"
                    onClick={downloadCSV}
                    variant="secondary"
                  >
                    Descargar CSV
                  </Button>
                  <Button data-testid="button-download-json" onClick={downloadJSON}>
                    Descargar JSON
                  </Button>
                </div>
              </div>

              <div className="max-h-[400px] overflow-y-auto border border-border rounded-lg bg-background p-4">
                {tracks.map((t, i) => (
                  <div
                    key={i}
                    className="py-2 border-b border-border/50 last:border-0 flex gap-4"
                  >
                    <div className="w-8 text-muted-foreground text-sm">{i + 1}</div>
                    <div className="flex-1">
                      <div className="font-medium text-sm">
                        {t.track?.name || "Desconocido"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {t.track?.artists?.map((a) => a.name).join(", ")}
                      </div>
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="py-4 text-center text-muted-foreground">
                    Cargando canciones...
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </ToolPageLayout>
  );
}
