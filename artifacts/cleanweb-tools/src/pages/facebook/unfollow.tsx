import { SiFacebook } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowAllFacebook() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let unfollowed = 0;
  
  async function processPage() {
    const unfollowBtns = document.querySelectorAll('[aria-label="Siguiendo"], [aria-label="Following"]');
    
    for (const btn of unfollowBtns) {
      btn.click();
      await delay(500);
      
      const confirm = document.querySelector('[aria-label="Dejar de seguir"], [aria-label="Unfollow"]');
      if (confirm) {
        confirm.click();
        unfollowed++;
        console.log(\`[CleanWeb] Dejado de seguir: #\${unfollowed}\`);
        await delay(2000 + Math.random() * 1000);
      }
    }
  }
  
  console.log('[CleanWeb] Iniciando en Facebook...');
  console.log('[CleanWeb] Asegúrate de estar en: facebook.com/feed/preferences');
  
  for (let i = 0; i < 20; i++) {
    await processPage();
    window.scrollBy(0, 600);
    await delay(1500);
  }
  
  console.log(\`[CleanWeb] Completado. Total: \${unfollowed}\`);
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
        { label: "Dejar de seguir amigos y páginas" }
      ]}
      warning="Actúa en facebook.com/feed/preferences"
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a <a href="https://facebook.com/feed/preferences" target="_blank" rel="noreferrer" className="text-primary hover:underline">facebook.com/feed/preferences</a>
        </StepCard>
        <StepCard number={2}>
          Abre DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Ejecuta el script.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
