import { SiYoutube } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function exportYouTubePlaylist() {
  const delay = ms => new Promise(r => setTimeout(r, ms));

  // ── Auto-scroll para cargar todos los videos ─────────────────────────────
  console.log('[CleanWeb] 🔄 Cargando todos los videos con scroll automático...');

  let lastCount = 0;
  let sameCountRounds = 0;

  while (sameCountRounds < 4) {
    window.scrollTo(0, document.body.scrollHeight);
    await delay(1500);
    const current = document.querySelectorAll('ytd-playlist-video-renderer').length;
    if (current === lastCount) {
      sameCountRounds++;
    } else {
      sameCountRounds = 0;
      lastCount = current;
    }
    console.log(\`[CleanWeb] Videos cargados: \${current}\`);
  }

  // ── Extraer datos de cada video ──────────────────────────────────────────
  const items = document.querySelectorAll('ytd-playlist-video-renderer');
  if (items.length === 0) {
    alert('[CleanWeb] ❌ No se encontraron videos.\\nAsegúrate de estar en una página de playlist de YouTube.');
    return;
  }

  const videos = Array.from(items).map((item, i) => {
    const titleEl  = item.querySelector('#video-title');
    const title    = titleEl?.textContent?.trim() || 'Sin título';
    const href     = titleEl?.getAttribute('href') || '';
    const url      = href ? 'https://youtube.com' + href.split('&')[0] : '';
    const channel  = item.querySelector('ytd-channel-name a, #channel-name a')?.textContent?.trim() || 'Desconocido';
    const duration = item.querySelector('ytd-thumbnail-overlay-time-status-renderer span')?.textContent?.trim() || '';
    const videoId  = new URLSearchParams(href.split('?')[1] || '').get('v') || '';
    return { index: i + 1, title, channel, url, duration, videoId };
  });

  // ── Generar y descargar CSV ──────────────────────────────────────────────
  const escape = s => '"' + String(s).replace(/"/g, '""') + '"';
  const csv = [
    'Index,Título,Canal,URL,Duración,VideoID',
    ...videos.map(v =>
      [v.index, escape(v.title), escape(v.channel), escape(v.url), escape(v.duration), escape(v.videoId)].join(',')
    )
  ].join('\\n');

  const blob = new Blob(['\\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);

  // Use the playlist title as filename if available
  const playlistTitle = document.querySelector('h1.ytd-playlist-header-renderer, yt-formatted-string.title')
    ?.textContent?.trim()?.replace(/[^a-zA-Z0-9_\\- ]/g, '') || 'playlist-youtube';
  a.download = playlistTitle + '.csv';
  a.click();

  console.log(\`[CleanWeb] ✅ Exportados \${videos.length} videos → \${a.download}\`);
})();`;

export default function ExportPlaylist() {
  return (
    <ToolPageLayout
      title="Exportar playlist de YouTube a CSV"
      platform="YouTube"
      platformIcon={<SiYoutube className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "YouTube" },
        { label: "Exportar playlist" },
      ]}
      info="El script hace scroll automático para cargar todos los videos antes de exportar. No necesitas desplazarte manualmente."
      relatedTools={[
        {
          title: "Borrar historial YouTube",
          href: "/youtube/borrar-historial",
          description: "Elimina tu historial de reproducción de forma permanente.",
        },
        {
          title: "Eliminar Google Fotos",
          href: "/google-fotos",
          description: "Elimina fotos automáticamente de tu cuenta de Google Photos.",
        },
      ]}
    >
      <div className="mb-8">
        <StepCard number={1}>
          Abre YouTube y navega a la playlist que quieres exportar en{" "}
          <a
            href="https://youtube.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            youtube.com
          </a>
          .
        </StepCard>
        <StepCard number={2}>
          Abre las DevTools con{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd> y ve a la
          pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          hará scroll automático para cargar todos los videos y luego descargará el CSV.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-6 rounded-lg border border-secondary/40 bg-secondary/8 p-4 text-sm text-secondary-foreground">
        <strong>El CSV incluye:</strong>{" "}
        <span className="text-muted-foreground">
          índice, título, canal, URL directa, duración y Video ID.
          Compatible con Excel, Google Sheets y cualquier editor de texto.
        </span>
      </div>
    </ToolPageLayout>
  );
}
