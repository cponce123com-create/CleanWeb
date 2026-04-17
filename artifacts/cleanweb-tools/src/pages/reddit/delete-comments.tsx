import { SiReddit } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function deleteRedditComments() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randDelay = (min, max) => delay(min + Math.random() * (max - min));
  let deleted = 0;
  let emptyRounds = 0;

  async function deleteVisible() {
    // New Reddit UI — "more options" button on each comment
    const menus = document.querySelectorAll(
      'button[aria-label*="more options"], button[aria-label*="más opciones"], ' +
      'button[aria-label*="More Options"], button[data-testid*="more-comments"]'
    );

    if (menus.length === 0) return 0;

    let count = 0;
    for (const menu of menus) {
      (menu as HTMLElement).click();
      await delay(500);

      const deleteBtn = Array.from(document.querySelectorAll('[role="menuitem"]')).find(el => {
        const t = el.textContent?.toLowerCase().trim() || '';
        return t === 'delete' || t === 'eliminar';
      });

      if (!deleteBtn) {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        await delay(300);
        continue;
      }

      (deleteBtn as HTMLElement).click();
      await delay(500);

      // Confirm modal
      const confirm =
        document.querySelector('[data-testid="confirm-button"]') ||
        Array.from(document.querySelectorAll('button')).find(b => {
          const t = b.textContent?.toLowerCase().trim() || '';
          return t === 'yes' || t === 'sí' || t === 'si' || t === 'delete' || t === 'eliminar';
        });

      if (confirm) {
        (confirm as HTMLElement).click();
        deleted++;
        count++;
        console.log(\`[CleanWeb] 🗑️ Comentario #\${deleted} eliminado\`);
        await randDelay(1000, 1800);
      } else {
        document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
      }
      await delay(400);
    }
    return count;
  }

  console.log('[CleanWeb] 🚀 Iniciando borrado de comentarios en Reddit...');
  console.log('[CleanWeb] Asegúrate de estar en: reddit.com/user/TU_USUARIO/comments');

  while (true) {
    const removed = await deleteVisible();

    if (removed === 0) {
      emptyRounds++;
      if (emptyRounds >= 4) {
        console.log(\`[CleanWeb] ✅ Completado. Total eliminados: \${deleted} comentarios.\`);
        break;
      }
    } else {
      emptyRounds = 0;
    }

    // Scroll to load more comments
    window.scrollTo(0, document.body.scrollHeight);
    await delay(2000);
  }
})();`;

export default function DeleteRedditComments() {
  return (
    <ToolPageLayout
      title="Borrar todos los comentarios de Reddit"
      platform="Reddit"
      platformIcon={<SiReddit className="w-5 h-5 text-[#FF4500]" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Reddit" },
        { label: "Borrar comentarios" },
      ]}
      warning="Los comentarios eliminados no se pueden recuperar. Reddit puede mostrar '[deleted]' en lugar del comentario durante unas horas antes de que desaparezca completamente."
      relatedTools={[
        {
          title: "Borrar tweets",
          href: "/twitter/borrar-tweets",
          description: "Elimina todos los tweets de tu perfil de Twitter/X.",
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
            href="https://www.reddit.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            reddit.com
          </a>{" "}
          e inicia sesión. Luego navega a{" "}
          <strong>reddit.com/user/TU_USUARIO/comments</strong> (reemplaza TU_USUARIO).
        </StepCard>
        <StepCard number={2}>
          Desplázate hacia abajo para cargar todos los comentarios visibles antes de ejecutar.
        </StepCard>
        <StepCard number={3}>
          Abre DevTools (<kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd>)
          y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={4}>
          Pega el script y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          procesará y hará scroll automáticamente.
        </StepCard>
        <StepCard number={5}>
          Cuando termine, recarga la página y repite el proceso hasta que no queden comentarios.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-6 rounded-lg border border-secondary/40 bg-secondary/8 p-4 text-sm text-secondary-foreground">
        <strong>Consejos:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
          <li>Carga todos los comentarios haciendo scroll antes de ejecutar.</li>
          <li>Reddit puede tardar en actualizar la interfaz — recarga después de cada ejecución.</li>
          <li>Ejecuta varias veces hasta que no queden comentarios visibles.</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
