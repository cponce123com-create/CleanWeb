import { SiX } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowAllTwitter() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randDelay = (min, max) => delay(min + Math.random() * (max - min));
  let unfollowed = 0;
  let emptyRounds = 0;

  // Auto-confirm any native confirm() dialogs
  window.confirm = () => true;

  async function processVisible() {
    // Target "Following" buttons in the following list
    const buttons = document.querySelectorAll('[data-testid="userActions"] button');
    let found = 0;

    for (const btn of buttons) {
      const label = btn.textContent?.trim();
      if (label !== 'Following' && label !== 'Siguiendo') continue;
      found++;
      btn.click();
      await delay(600);

      // Confirm the unfollow dialog
      const confirmBtn =
        document.querySelector('[data-testid="confirmationSheetConfirm"]') ||
        document.querySelector('[role="button"][tabindex="0"][style*="color: rgb(15"]');

      if (confirmBtn) {
        (confirmBtn as HTMLElement).click();
        unfollowed++;
        console.log(\`[CleanWeb] 👋 Unfollow #\${unfollowed}\`);
        await randDelay(1800, 3000);
      } else {
        // Dialog didn't appear — press Escape and skip
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await delay(300);
      }
    }
    return found;
  }

  console.log('[CleanWeb] 🚀 Iniciando unfollow en Twitter/X...');
  console.log('[CleanWeb] Asegúrate de estar en: x.com/TU_USUARIO/following');

  while (true) {
    const found = await processVisible();

    if (found === 0) {
      emptyRounds++;
      if (emptyRounds >= 3) {
        console.log(\`[CleanWeb] ✅ Completado. Total unfollows: \${unfollowed}\`);
        break;
      }
    } else {
      emptyRounds = 0;
    }

    // Scroll to load more accounts
    window.scrollBy(0, 900);
    await delay(2200);

    // Check for empty-state indicator
    if (document.querySelector('[data-testid="emptyState"]')) {
      console.log(\`[CleanWeb] ✅ Sin más cuentas. Total unfollows: \${unfollowed}\`);
      break;
    }
  }
})();`;

export default function UnfollowTwitter() {
  return (
    <ToolPageLayout
      title="Dejar de seguir a todos en X/Twitter"
      platform="Twitter / X"
      platformIcon={<SiX className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Twitter / X" },
        { label: "Dejar de seguir a todos" },
      ]}
      warning="El script confirma automáticamente los diálogos de unfollow. Verifica que estás en x.com/TU_USUARIO/following antes de ejecutarlo."
      relatedTools={[
        {
          title: "Borrar todos los tweets",
          href: "/twitter/borrar-tweets",
          description: "Elimina todos los tweets de tu perfil.",
        },
      ]}
    >
      <div className="mb-8">
        <StepCard number={1}>
          Ve a{" "}
          <a
            href="https://x.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            x.com/TU_USUARIO/following
          </a>{" "}
          (reemplaza TU_USUARIO con tu nombre de cuenta).
        </StepCard>
        <StepCard number={2}>
          Abre DevTools (<kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd>) y
          ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          hará scroll automático y detendrá cuando no queden más cuentas.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
