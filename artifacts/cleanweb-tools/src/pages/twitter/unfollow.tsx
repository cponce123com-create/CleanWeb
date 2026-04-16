import { SiX } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowAllTwitter() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let unfollowed = 0;
  
  // Manejar diálogos de confirmación automáticamente
  window.confirm = () => true;
  
  async function processVisible() {
    const unfollowBtns = document.querySelectorAll('[data-testid="userActions"] button');
    
    for (const btn of unfollowBtns) {
      if (btn.textContent?.trim() === 'Following' || btn.textContent?.trim() === 'Siguiendo') {
        btn.click();
        await delay(500);
        
        // Confirmar en el dialog
        const confirmBtn = document.querySelector('[data-testid="confirmationSheetConfirm"]');
        if (confirmBtn) {
          confirmBtn.click();
          unfollowed++;
          console.log(\`[CleanWeb] Dejado de seguir: #\${unfollowed}\`);
          await delay(1500 + Math.random() * 1000);
        }
      }
    }
  }
  
  console.log('[CleanWeb] Iniciando proceso de unfollow en Twitter/X...');
  
  while (true) {
    await processVisible();
    window.scrollBy(0, 800);
    await delay(2000);
    
    const noMore = document.querySelector('[data-testid="emptyState"]');
    if (noMore) {
      console.log(\`[CleanWeb] Completado. Total: \${unfollowed} usuarios.\`);
      break;
    }
  }
})();`;

export default function UnfollowTwitter() {
  return (
    <ToolPageLayout
      title="Dejar de seguir a todos"
      platform="Twitter / X"
      platformIcon={<SiX className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Twitter / X" },
        { label: "Dejar de seguir a todos" }
      ]}
      warning="Este script detendrá automáticamente los diálogos de confirmación. Verifica antes de ejecutar."
      relatedTools={[
        { title: "Borrar todos los tweets", href: "/twitter/borrar-tweets", description: "Elimina todos los tweets de tu perfil." }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a <a href="https://twitter.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">twitter.com/YOUR_USERNAME/following</a>
        </StepCard>
        <StepCard number={2}>
          Abre DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y ejecuta.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
