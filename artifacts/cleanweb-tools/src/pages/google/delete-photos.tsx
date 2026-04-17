import { SiGooglephotos } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function deleteAllGooglePhotos() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randDelay = (min, max) => delay(min + Math.random() * (max - min));
  let deleted = 0;
  let emptyRounds = 0;

  async function selectAndDelete() {
    // Hover sobre el primer elemento para revelar el checkbox
    const firstItem = document.querySelector('[data-id]');
    if (!firstItem) return 0;

    firstItem.dispatchEvent(new MouseEvent('mouseover', { bubbles: true }));
    await delay(400);

    const checkboxes = document.querySelectorAll('[data-id] input[type="checkbox"]:not(:checked)');
    if (checkboxes.length === 0) return 0;

    // Seleccionar todas las fotos visibles
    for (const cb of checkboxes) {
      (cb as HTMLInputElement).click();
      await delay(60);
    }
    await delay(500);

    // Buscar botón de eliminar en la toolbar
    const deleteBtn =
      document.querySelector('[aria-label*="Delete"]') ||
      document.querySelector('[aria-label*="Eliminar"]') ||
      document.querySelector('[data-tooltip-id*="delete"]');

    if (!deleteBtn) {
      // Deseleccionar y salir si no aparece el botón
      for (const cb of document.querySelectorAll('[data-id] input[type="checkbox"]:checked')) {
        (cb as HTMLInputElement).click();
      }
      return 0;
    }

    (deleteBtn as HTMLElement).click();
    await delay(800);

    // Confirmar el diálogo de eliminación
    const confirmBtn =
      document.querySelector('[data-mdc-dialog-action="ok"]') ||
      document.querySelector('button[class*="confirm"]') ||
      Array.from(document.querySelectorAll('button')).find(
        b => b.textContent?.includes('Move to trash') || b.textContent?.includes('Mover a la papelera')
      );

    if (confirmBtn) {
      (confirmBtn as HTMLElement).click();
      const count = checkboxes.length;
      deleted += count;
      console.log(\`[CleanWeb] 🗑️ Eliminadas \${count} fotos | Total: \${deleted}\`);
      return count;
    }

    // Si no apareció confirmación, cerrar el diálogo
    document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
    return 0;
  }

  console.log('[CleanWeb] 🚀 Iniciando eliminación de Google Fotos...');
  console.log('[CleanWeb] Asegúrate de estar en: photos.google.com');

  while (true) {
    const removed = await selectAndDelete();

    if (removed === 0) {
      emptyRounds++;
      window.scrollBy(0, 600);
      await delay(1500);
      if (emptyRounds >= 5) {
        console.log(\`[CleanWeb] ✅ Proceso completado. Total fotos eliminadas: \${deleted}\`);
        console.log('[CleanWeb] Recuerda vaciar la Papelera en Google Fotos para liberar espacio.');
        break;
      }
    } else {
      emptyRounds = 0;
      await randDelay(2000, 3500);
      window.scrollTo(0, 0); // Volver arriba para capturar fotos nuevas cargadas
      await delay(1000);
    }
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
        { label: "Eliminar Google Fotos" },
      ]}
      warning="Esta acción mueve las fotos a la Papelera — no se eliminan de forma permanente hasta que vacíes la papelera manualmente. Aun así, ten una copia de seguridad antes de proceder."
      info="El script selecciona y elimina fotos en lotes. Puede tardar varios minutos dependiendo del número de fotos."
      relatedTools={[
        {
          title: "Exportar playlist YouTube",
          href: "/youtube/exportar-playlist",
          description: "Exporta tus listas de reproducción a CSV.",
        },
        {
          title: "Borrar historial YouTube",
          href: "/youtube/borrar-historial",
          description: "Limpia tu rastro de visualización.",
        },
      ]}
    >
      <div className="mb-8">
        <StepCard number={1}>
          Abre{" "}
          <a
            href="https://photos.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            photos.google.com
          </a>{" "}
          e inicia sesión con tu cuenta de Google.
        </StepCard>
        <StepCard number={2}>
          Abre las DevTools con{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd> o{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Ctrl+Shift+I</kbd> y ve a
          la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          seleccionará y eliminará fotos automáticamente.
        </StepCard>
        <StepCard number={4}>
          Cuando termine, ve a la <strong>Papelera</strong> de Google Fotos y vacíala para liberar
          el espacio de almacenamiento definitivamente.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
