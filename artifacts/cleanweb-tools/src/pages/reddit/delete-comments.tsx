import { SiReddit } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let deleted = 0;
  async function deleteVisible() {
    const menus = document.querySelectorAll(
      'button[aria-label*="more options"], button[aria-label*="más opciones"]'
    );
    for (const menu of menus) {
      menu.click();
      await sleep(400);
      const deleteBtn = Array.from(document.querySelectorAll('[role="menuitem"]'))
        .find(el => el.textContent.toLowerCase().includes('delete') || 
                    el.textContent.toLowerCase().includes('eliminar'));
      if (deleteBtn) {
        deleteBtn.click();
        await sleep(300);
        const confirm = document.querySelector('button[data-testid="confirm-button"]') ||
          Array.from(document.querySelectorAll('button'))
            .find(b => b.textContent.includes('Yes') || b.textContent.includes('Si'));
        if (confirm) { confirm.click(); deleted++; }
        await sleep(800);
      }
    }
  }
  await deleteVisible();
  window.scrollTo(0, document.body.scrollHeight);
  await sleep(2000);
  await deleteVisible();
  alert('[CleanWeb] ' + deleted + ' comentarios eliminados. Recarga y repite.');
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
        { label: "Borrar comentarios" }
      ]}
      warning="Los comentarios eliminados no se pueden recuperar."
      relatedTools={[
        {
          title: "Borrar tweets",
          href: "/twitter/borrar-tweets",
          description: "Elimina todos los tweets de tu perfil de Twitter/X."
        },
        {
          title: "Dejar de seguir en Twitter/X",
          href: "/twitter/dejar-de-seguir",
          description: "Vuelve a cero tus seguidos en X/Twitter."
        }
      ]}
    >
      <div className="space-y-2 mb-8">
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
          e inicia sesión. Luego visita{" "}
          <strong>reddit.com/user/TU_USUARIO/comments</strong>.
        </StepCard>
        <StepCard number={2}>
          Desplázate hacia abajo para cargar todos los comentarios visibles antes de ejecutar el
          script.
        </StepCard>
        <StepCard number={3}>
          Abre DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la
          pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={4}>
          Pega el script y presiona <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>.
        </StepCard>
        <StepCard number={5}>
          Cuando aparezca el aviso, recarga la página y repite el proceso.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-6 rounded-lg border border-secondary/50 bg-secondary/10 p-4 text-sm text-secondary-foreground">
        <strong>Consejos:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
          <li>Carga todos los comentarios haciendo scroll antes de ejecutar.</li>
          <li>Reddit puede tardar en actualizar la interfaz — recarga tras cada ejecución.</li>
          <li>Ejecuta varias veces hasta que no queden comentarios.</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
