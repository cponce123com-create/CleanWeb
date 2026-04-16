import { SiTiktok } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowAllTikTok() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let unfollowed = 0;
  
  async function processVisible() {
    const followBtns = document.querySelectorAll('[data-e2e="follow-button"]');
    
    for (const btn of followBtns) {
      if (btn.textContent?.trim() === 'Following' || btn.textContent?.trim() === 'Siguiendo') {
        btn.click();
        unfollowed++;
        console.log(\`[CleanWeb] Dejado de seguir: #\${unfollowed}\`);
        await delay(3000 + Math.random() * 2000);
      }
    }
  }
  
  console.log('[CleanWeb] Iniciando proceso en TikTok...');
  console.log('[CleanWeb] El script usa pausas largas para evitar restricciones.');
  
  while (true) {
    await processVisible();
    window.scrollBy(0, 600);
    await delay(2000);
    
    const noMore = document.body.scrollHeight <= window.innerHeight + window.scrollY + 100;
    if (noMore) {
      console.log(\`[CleanWeb] Completado. Total: \${unfollowed}\`);
      break;
    }
  }
})();`;

export default function UnfollowTiktok() {
  return (
    <ToolPageLayout
      title="Dejar de seguir todos"
      platform="TikTok"
      platformIcon={<SiTiktok className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "TikTok" },
        { label: "Dejar de seguir todos" }
      ]}
      warning="TikTok puede limitar las acciones rápidas. El script usa pausas de 3-5 segundos."
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a <a href="https://tiktok.com/following" target="_blank" rel="noreferrer" className="text-primary hover:underline">tiktok.com/following</a> en tu navegador.
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
