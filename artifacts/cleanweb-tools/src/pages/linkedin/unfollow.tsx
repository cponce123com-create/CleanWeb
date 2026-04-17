import { Linkedin } from "lucide-react";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowLinkedIn() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randDelay = (min, max) => delay(min + Math.random() * (max - min));
  let unfollowed = 0;
  let emptyRounds = 0;

  async function processVisible() {
    const buttons = Array.from(document.querySelectorAll('button')).filter(b => {
      const text = b.textContent?.trim() || '';
      const aria  = b.getAttribute('aria-label') || '';
      return text === 'Following' || text === 'Siguiendo' ||
             aria.includes('Following') || aria.includes('Siguiendo');
    });

    if (buttons.length === 0) return 0;

    let count = 0;
    for (const btn of buttons) {
      btn.click();
      await delay(500);

      // Find the confirm option in the popover/modal
      const confirm = Array.from(document.querySelectorAll('button, [role="button"]'))
        .find(el => {
          const t = el.textContent?.trim() || '';
          return t === 'Unfollow' || t === 'Dejar de seguir';
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

  console.log('[CleanWeb] 🚀 Iniciando en LinkedIn...');
  console.log('[CleanWeb] Asegúrate de estar en: linkedin.com/mynetwork/following/');

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

    window.scrollBy(0, 800);
    await delay(2000);
  }
})();`;

export default function UnfollowLinkedin() {
  return (
    <ToolPageLayout
      title="Dejar de seguir conexiones en LinkedIn"
      platform="LinkedIn"
      platformIcon={<Linkedin className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "LinkedIn" },
        { label: "Dejar de seguir conexiones" },
      ]}
      warning="Solo dejarás de ver sus posts en el feed. Seguirás conectado con ellos y podrás reactivar el seguimiento en cualquier momento desde su perfil."
      relatedTools={[
        {
          title: "Dejar de seguir en Instagram",
          href: "/instagram/dejar-de-seguir",
          description: "Deja de seguir cuentas que no te siguen en Instagram.",
        },
        {
          title: "Dejar de seguir en Twitter/X",
          href: "/twitter/dejar-de-seguir",
          description: "Vuelve a cero tus seguidos en X/Twitter.",
        },
      ]}
    >
      <div className="mb-8">
        <StepCard number={1}>
          Ve a{" "}
          <a
            href="https://www.linkedin.com/mynetwork/following/"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            linkedin.com/mynetwork/following/
          </a>{" "}
          para ver todos los perfiles que sigues.
        </StepCard>
        <StepCard number={2}>
          Abre DevTools (<kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd>)
          y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          hará scroll automático y procesará todos los botones visibles.
        </StepCard>
        <StepCard number={4}>
          Cuando termine, recarga y repite hasta que no queden botones "Siguiendo".
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-6 rounded-lg border border-secondary/40 bg-secondary/8 p-4 text-sm text-secondary-foreground">
        <strong>Consejos:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
          <li>El script espera 2.5-4 s por acción para evitar detección de bots.</li>
          <li>Puedes reactivar el seguimiento desde el perfil de cada conexión.</li>
          <li>Ejecuta varias veces hasta que no quede ningún "Siguiendo".</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
