import { SiX } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function deleteAllTweets() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randDelay = (min, max) => delay(min + Math.random() * (max - min));
  let deleted = 0;
  let emptyRounds = 0;

  async function deleteVisible() {
    const carets = document.querySelectorAll('[data-testid="caret"]');
    if (carets.length === 0) return 0;

    let count = 0;
    for (const caret of carets) {
      (caret as HTMLElement).click();
      await delay(500);

      // Find "Delete" option in the dropdown
      const items = document.querySelectorAll('[role="menuitem"]');
      let deleteItem = null;
      for (const item of items) {
        const text = item.textContent?.toLowerCase() || '';
        if (text.includes('delete') || text.includes('eliminar')) {
          deleteItem = item;
          break;
        }
      }

      if (!deleteItem) {
        // Close menu and move on
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await delay(300);
        continue;
      }

      (deleteItem as HTMLElement).click();
      await delay(500);

      // Confirm deletion
      const confirm =
        document.querySelector('[data-testid="confirmationSheetConfirm"]') as HTMLElement | null;
      if (confirm) {
        confirm.click();
        deleted++;
        count++;
        console.log(\`[CleanWeb] 🗑️ Tweet #\${deleted} eliminado\`);
        await randDelay(1200, 2000);
      }
    }
    return count;
  }

  console.log('[CleanWeb] 🚀 Iniciando borrado de tweets...');
  console.log('[CleanWeb] Asegúrate de estar en: x.com/TU_USUARIO');

  while (true) {
    const removed = await deleteVisible();

    if (removed === 0) {
      emptyRounds++;
      if (emptyRounds >= 4) {
        console.log(\`[CleanWeb] ✅ Completado. Total eliminados: \${deleted} tweets.\`);
        break;
      }
    } else {
      emptyRounds = 0;
    }

    window.scrollBy(0, 600);
    await delay(2000);
  }
})();`;

export default function DeleteTweets() {
  return (
    <ToolPageLayout
      title="Borrar todos los tweets"
      platform="Twitter / X"
      platformIcon={<SiX className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Twitter / X" },
        { label: "Borrar todos los tweets" },
      ]}
      warning="Los tweets eliminados no se pueden recuperar. Considera exportar tu archivo de datos desde la configuración de X antes de proceder."
      relatedTools={[
        {
          title: "Dejar de seguir a todos",
          href: "/twitter/dejar-de-seguir",
          description: "Vuelve a cero tus seguidos en X/Twitter.",
        },
      ]}
    >
      <div className="mb-8">
        <StepCard number={1}>
          Ve a tu perfil en{" "}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            x.com/TU_USUARIO
          </a>{" "}
          (reemplaza TU_USUARIO con tu nombre de cuenta).
        </StepCard>
        <StepCard number={2}>
          Abre DevTools (<kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd>)
          y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          eliminará los tweets visibles y hará scroll automático para continuar.
        </StepCard>
        <StepCard number={4}>
          Cuando termine, recarga la página y ejecuta de nuevo si aún quedan tweets (X carga en
          lotes).
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
