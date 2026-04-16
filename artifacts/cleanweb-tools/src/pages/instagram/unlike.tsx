import { SiInstagram } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unlikeAllInstagram() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  let unliked = 0;
  
  const csrfToken = document.cookie.split('; ')
    .find(c => c.startsWith('csrftoken='))?.split('=')[1];
  
  if (!csrfToken) {
    console.error('[CleanWeb] Inicia sesión en instagram.com primero');
    return;
  }
  
  async function unlikePost(mediaId) {
    const res = await fetch(\`/api/v1/web/likes/\${mediaId}/unlike/\`, {
      method: 'POST',
      headers: { 'X-CSRFToken': csrfToken, 'X-Requested-With': 'XMLHttpRequest' }
    });
    return res.ok;
  }
  
  console.log('[CleanWeb] Script de quitar likes iniciado.');
  console.log('[CleanWeb] Navega a tus posts con like para que el script los detecte.');
  
  // Detectar posts visibles con like
  const likedPosts = document.querySelectorAll('[aria-label="Unlike"]');
  
  for (const post of likedPosts) {
    post.click();
    unliked++;
    console.log(\`[CleanWeb] Quitado like #\${unliked}\`);
    await delay(2000 + Math.random() * 2000);
  }
  
  console.log(\`[CleanWeb] Proceso completado. Likes quitados: \${unliked}\`);
})();`;

export default function UnlikeInstagram() {
  return (
    <ToolPageLayout
      title="Quitar likes masivamente"
      platform="Instagram"
      platformIcon={<SiInstagram className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Instagram" },
        { label: "Quitar likes masivamente" }
      ]}
      warning="Este proceso puede tomar mucho tiempo dependiendo de cuántos likes tengas."
      relatedTools={[
        { title: "Dejar de seguir no-seguidores", href: "/instagram/dejar-de-seguir", description: "Deja de seguir automáticamente a cuentas que no te siguen." }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a instagram.com/YOUR_USERNAME/liked/ o la sección "Posts que te gustaron" en configuración.
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
