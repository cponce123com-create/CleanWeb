import { SiYoutube } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(function exportYouTubePlaylist() {
  const videos = [];
  const items = document.querySelectorAll('ytd-playlist-video-renderer');
  
  items.forEach((item, i) => {
    const title = item.querySelector('#video-title')?.textContent?.trim() || 'Sin título';
    const channel = item.querySelector('.ytd-channel-name a')?.textContent?.trim() || 'Desconocido';
    const url = 'https://youtube.com' + (item.querySelector('#video-title')?.href?.split('youtube.com')[1] || '');
    const duration = item.querySelector('ytd-thumbnail-overlay-time-status-renderer')?.textContent?.trim() || '';
    videos.push({ index: i+1, title, channel, url, duration });
  });
  
  if (videos.length === 0) {
    alert('No se encontraron videos. Asegúrate de estar en una página de playlist de YouTube.');
    return;
  }
  
  const csv = ['Index,Título,Canal,URL,Duración',
    ...videos.map(v => \`\${v.index},"\${v.title}","\${v.channel}","\${v.url}","\${v.duration}"\`)
  ].join('\\n');
  
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'playlist-youtube.csv';
  a.click();
  
  console.log(\`[CleanWeb] Exportados \${videos.length} videos a CSV.\`);
})();`;

export default function ExportPlaylist() {
  return (
    <ToolPageLayout
      title="Exportar playlist YouTube"
      platform="YouTube"
      platformIcon={<SiYoutube className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "YouTube" },
        { label: "Exportar playlist" }
      ]}
      info="Solo captura los videos visibles en pantalla. Desplázate por toda la playlist antes de ejecutar el script para mejores resultados."
      relatedTools={[
        { title: "Borrar historial YouTube", href: "/youtube/borrar-historial", description: "Elimina tu historial de reproducción de forma permanente." },
        { title: "Eliminar Google Fotos", href: "/google-fotos", description: "Elimina fotos automáticamente de tu cuenta de Google Photos." }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Abre YouTube y ve a tu playlist en <a href="https://youtube.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">youtube.com</a>
        </StepCard>
        <StepCard number={2}>
          Abre las DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el siguiente script y presiona Enter.
        </StepCard>
        <StepCard number={4}>
          El script extraerá todos los videos visibles y descargará un archivo CSV automáticamente.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
