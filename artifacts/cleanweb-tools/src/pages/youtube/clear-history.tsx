import { SiYoutube } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function clearYouTubeHistory() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  
  // Buscar y hacer clic en "Eliminar actividad por"
  const buttons = document.querySelectorAll('button, [role="button"]');
  let deleteBtn = null;
  for (const btn of buttons) {
    if (btn.textContent?.includes('Eliminar actividad') || btn.textContent?.includes('Delete activity')) {
      deleteBtn = btn;
      break;
    }
  }
  
  if (!deleteBtn) {
    console.log('[CleanWeb] Ve a: myactivity.google.com y busca la sección de YouTube');
    return;
  }
  
  deleteBtn.click();
  await delay(1000);
  
  // Seleccionar "Desde siempre"
  const allTimeOption = document.querySelector('[data-value="all_time"]') ||
    Array.from(document.querySelectorAll('li')).find(el => el.textContent?.includes('Desde siempre') || el.textContent?.includes('All time'));
  
  if (allTimeOption) { allTimeOption.click(); await delay(500); }
  
  const confirmBtn = document.querySelector('button[type="submit"]');
  if (confirmBtn) { confirmBtn.click(); }
  
  console.log('[CleanWeb] Historial eliminado.');
})();`;

export default function ClearHistory() {
  return (
    <ToolPageLayout
      title="Borrar historial YouTube"
      platform="YouTube"
      platformIcon={<SiYoutube className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "YouTube" },
        { label: "Borrar historial" }
      ]}
      warning="Esto eliminará tu historial de reproducción de forma permanente."
      relatedTools={[
        { title: "Exportar playlist YouTube", href: "/youtube/exportar-playlist", description: "Exporta cualquier playlist a CSV." }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a <a href="https://myactivity.google.com/activitycontrols/youtube" target="_blank" rel="noreferrer" className="text-primary hover:underline">myactivity.google.com/activitycontrols/youtube</a>
        </StepCard>
        <StepCard number={2}>
          Abre las DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona Enter.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
