import { SiFacebook } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowAllFacebook() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randDelay = (min, max) => delay(min + Math.random() * (max - min));
  let unfollowed = 0;
  let emptyRounds = 0;

  async function processVisible() {
    // Target "Siguiendo"/"Following" buttons in the feed preferences page
    const buttons = Array.from(document.querySelectorAll('div[role="button"]')).filter(el => {
      const label = el.getAttribute('aria-label') || el.textContent?.trim() || '';
      return label === 'Siguiendo' || label === 'Following';
    });

    if (buttons.length === 0) return 0;

    let count = 0;
    for (const btn of buttons) {
      (btn as HTMLElement).click();
      await delay(700);

      // Wait for dropdown / confirmation
      const confirm = Array.from(document.querySelectorAll('[role="menuitem"], [role="button"]'))
        .find(el => {
          const t = el.textContent?.trim() || '';
          return t === 'Dejar de seguir' || t === 'Unfollow';
        });

      if (confirm) {
        (confirm as HTMLElement).click();
        unfollowed++;
        count++;
        console.log(\`[CleanWeb] 👋 Unfollow #\${unfollowed}\`);
        await randDelay(2500, 4000);
      } else {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await delay(400);
      }
    }
    return count;
  }

  console.log('[CleanWeb] 🚀 Iniciando en Facebook...');
  console.log('[CleanWeb] Asegúrate de estar en: facebook.com/feed/preferences');

  while (true) {
    const removed = await processVisible();

    if (removed === 0) {
      emptyRounds++;
      if (emptyRounds >= 4) {
        console.log(\`[CleanWeb] ✅ Completado. Total: \${unfollowed} unfollows.\`);
        break;
      }
    } else {
      emptyRounds = 0;
    }

    window.scrollBy(0, 700);
    await delay(1800);
  }
})();`;

export default function UnfollowFacebook() {
  return (
    <ToolPageLayout
      title="Dejar de seguir amigos y páginas"
      platform="Facebook"
      platformIcon={<SiFacebook className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Facebook" },
        { label: "Dejar de seguir amigos y páginas" },
      ]}
      warning="El script actúa en la página de preferencias del feed. No elimina amigos ni páginas — solo deja de ver su contenido en el timeline."
      info="Facebook carga el contenido de forma paginada. Si quedan contactos tras la primera ejecución, recarga y vuelve a ejecutar."
    >
      <div className="mb-8">
        <StepCard number={1}>
          Ve a{" "}
          <a
            href="https://facebook.com/feed/preferences"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            facebook.com/feed/preferences
          </a>{" "}
          y asegúrate de estar en la sección <strong>"Personas"</strong> o{" "}
          <strong>"Páginas"</strong>.
        </StepCard>
        <StepCard number={2}>
          Abre DevTools (<kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd>)
          y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          hará scroll automático y procesará cada botón visible.
        </StepCard>
        <StepCard number={4}>
          Si quieres limpiar <strong>páginas</strong> también, navega a la pestaña "Páginas" en la
          misma URL y ejecuta el script de nuevo.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
