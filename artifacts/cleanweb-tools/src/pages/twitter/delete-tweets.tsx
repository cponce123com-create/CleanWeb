import { SiX } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function deleteAllTweets() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let deleted = 0;
  
  async function deleteVisible() {
    const moreMenuBtns = document.querySelectorAll('[data-testid="caret"]');
    
    for (const btn of moreMenuBtns) {
      btn.click();
      await delay(400);
      
      const deleteOption = document.querySelector('[data-testid="Eliminar"] span, [role="menuitem"]');
      const items = document.querySelectorAll('[role="menuitem"]');
      let deleteItem = null;
      
      for (const item of items) {
        if (item.textContent?.includes('Delete') || item.textContent?.includes('Eliminar')) {
          deleteItem = item;
          break;
        }
      }
      
      if (deleteItem) {
        deleteItem.click();
        await delay(400);
        const confirm = document.querySelector('[data-testid="confirmationSheetConfirm"]');
        if (confirm) { confirm.click(); deleted++; }
        await delay(1000 + Math.random() * 500);
      }
    }
  }
  
  console.log('[CleanWeb] Eliminando tweets...');
  
  while (true) {
    await deleteVisible();
    window.scrollBy(0, 500);
    await delay(2000);
    
    const tweets = document.querySelectorAll('[data-testid="caret"]');
    if (tweets.length === 0) {
      console.log(\`[CleanWeb] Completado. Eliminados: \${deleted} tweets.\`);
      break;
    }
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
        { label: "Borrar todos los tweets" }
      ]}
      warning="Los tweets eliminados no se pueden recuperar."
      relatedTools={[
        { title: "Dejar de seguir a todos", href: "/twitter/dejar-de-seguir", description: "Vuelve a cero tus seguidos en X/Twitter." }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a twitter.com/YOUR_USERNAME (tu perfil).
        </StepCard>
        <StepCard number={2}>
          Abre DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Ejecuta el script (elimina tweets de página en página).
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
