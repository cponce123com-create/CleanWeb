import { SiGooglephotos } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function deleteAllGooglePhotos() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let deleted = 0;
  
  while (true) {
    const checkboxes = document.querySelectorAll('[data-id] input[type="checkbox"]');
    if (checkboxes.length === 0) {
      console.log('[CleanWeb] Buscando fotos...');
      document.querySelector('[data-id]')?.click();
      await delay(1000);
      continue;
    }
    
    checkboxes[0].closest('[data-id]').dispatchEvent(new MouseEvent('mouseover', {bubbles: true}));
    await delay(300);
    
    for (const cb of checkboxes) {
      cb.click();
      await delay(100);
    }
    
    const deleteBtn = document.querySelector('[aria-label*="Delete"]') || 
                      document.querySelector('[aria-label*="Eliminar"]');
    if (deleteBtn) {
      deleteBtn.click();
      await delay(500);
      const confirm = document.querySelector('[data-mdc-dialog-action="ok"]') ||
                      document.querySelector('button[class*="confirm"]');
      if (confirm) { confirm.click(); deleted += checkboxes.length; }
    }
    
    console.log(\`[CleanWeb] Eliminadas: \${deleted} fotos\`);
    await delay(2000);
    window.scrollBy(0, 500);
    await delay(1000);
  }
})();`;

export default function DeletePhotos() {
  return (
    <ToolPageLayout
      title="Eliminar Google Fotos"
      platform="Google"
      platformIcon={<SiGooglephotos className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Google" },
        { label: "Eliminar Google Fotos" }
      ]}
      warning="Esta acción es irreversible. Asegúrate de tener una copia de seguridad."
      info="Este script se ejecuta directamente en tu navegador. Google puede pedir confirmación adicional. Si el script se detiene, vuelve a ejecutarlo."
      relatedTools={[
        { title: "Exportar playlist YouTube", href: "/youtube/exportar-playlist", description: "Exporta tus listas de reproducción." },
        { title: "Borrar historial YouTube", href: "/youtube/borrar-historial", description: "Limpia tu rastro de visualización." }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Abre Google Fotos en tu navegador: <a href="https://photos.google.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">photos.google.com</a>
        </StepCard>
        <StepCard number={2}>
          Inicia sesión con tu cuenta de Google.
        </StepCard>
        <StepCard number={3}>
          Abre las DevTools pulsando <kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd> o <kbd className="px-2 py-1 bg-muted rounded text-xs">Ctrl+Shift+I</kbd> y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={4}>
          Pega el siguiente script y presiona Enter.
        </StepCard>
        <StepCard number={5}>
          El script seleccionará y eliminará las fotos automáticamente con pausas para evitar bloqueos.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
