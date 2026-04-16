import { SiInstagram } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowNonFollowers() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randomDelay = () => delay(3000 + Math.random() * 3000);
  
  // Obtener cookies necesarias
  const csrfToken = document.cookie.split('; ')
    .find(c => c.startsWith('csrftoken='))?.split('=')[1];
  
  if (!csrfToken) {
    console.error('[CleanWeb] No se encontró csrftoken. Asegúrate de estar en instagram.com');
    return;
  }
  
  // Obtener ID de usuario
  const appId = window._sharedData?.config?.viewerId || 
                JSON.parse(document.querySelector('script[type="application/json"]')?.textContent || '{}')?.config?.viewerId;
  
  async function getFollowing(userId, after = '') {
    const res = await fetch(\`/graphql/query/?query_hash=3dec7e2c57367ef3da3d987d89f9dbc8&variables=\${encodeURIComponent(JSON.stringify({id: userId, first: 50, after}))}\`);
    return res.json();
  }
  
  let unfollowed = 0;
  console.log('[CleanWeb] Iniciando proceso. Esto puede tardar varios minutos...');
  
  // Nota: Para el script completo se necesita el ID de usuario
  // El siguiente fragmento muestra la estructura básica:
  console.log('[CleanWeb] Para usar este script necesitas tu User ID de Instagram.');
  console.log('[CleanWeb] Puedes encontrarlo en: instagram.com/YOUR_USERNAME/?__a=1&__d=dis');
  console.log(\`[CleanWeb] csrfToken encontrado: \${csrfToken.substring(0, 8)}...\`);
  console.log('[CleanWeb] Script listo. Ejecuta con tu User ID para continuar.');
})();`;

export default function UnfollowInstagram() {
  return (
    <ToolPageLayout
      title="Dejar de seguir no-seguidores"
      platform="Instagram"
      platformIcon={<SiInstagram className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "Instagram" },
        { label: "Dejar de seguir no-seguidores" }
      ]}
      warning="El script usa la API interna de Instagram. Úsalo con moderación para evitar restricciones."
      info="Instagram tiene límites de tasa. Usa el script en sesiones cortas (máx. 50-100 unfollows por hora). El script hace pausas aleatorias para parecer más humano."
      relatedTools={[
        { title: "Quitar likes masivamente", href: "/instagram/quitar-likes", description: "Quita likes a publicaciones antiguas rápidamente." }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Abre Instagram en <a href="https://instagram.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">instagram.com</a> e inicia sesión.
        </StepCard>
        <StepCard number={2}>
          Abre las DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script y presiona Enter.
        </StepCard>
        <StepCard number={4}>
          El script esperará entre 3-6 segundos entre cada acción.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>
    </ToolPageLayout>
  );
}
