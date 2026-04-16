import { SiTiktok } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  const random = (a, b) => Math.floor(Math.random() * (b - a + 1)) + a;
  let count = 0;
  const likedVideos = document.querySelectorAll(
    'button[aria-label*="Like"], button[data-e2e*="like-icon"]'
  );
  if (!likedVideos.length) {
    alert('[CleanWeb] No se encontraron videos con like. Asegurate de estar en tu perfil -> Me gusta en TikTok web.');
    return;
  }
  for (const btn of likedVideos) {
    btn.click(); count++;
    console.log('[CleanWeb] Unlike #' + count);
    await sleep(random(1500, 3000));
  }
  alert('[CleanWeb] ' + count + ' likes eliminados. Recarga y ejecuta de nuevo.');
})();`;

export default function UnlikeTiktok() {
  return (
    <ToolPageLayout
      title="Quitar likes masivamente en TikTok"
      platform="TikTok"
      platformIcon={<SiTiktok className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "TikTok" },
        { label: "Quitar likes masivamente" }
      ]}
      info="Este proceso es lento por los límites de TikTok. Sé paciente y ejecuta el script varias veces."
      relatedTools={[
        {
          title: "Dejar de seguir en TikTok",
          href: "/tiktok/dejar-de-seguir",
          description: "Limpia la lista de personas que sigues en TikTok."
        },
        {
          title: "Quitar likes en Instagram",
          href: "/instagram/quitar-likes",
          description: "Quita likes a publicaciones antiguas en Instagram."
        }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Abre{" "}
          <a
            href="https://www.tiktok.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            tiktok.com
          </a>{" "}
          e inicia sesión. Ve a tu <strong>Perfil</strong> y haz clic en la pestaña{" "}
          <strong>Me gusta</strong>.
        </StepCard>
        <StepCard number={2}>
          Desplázate hacia abajo para cargar todos los videos con like antes de continuar.
        </StepCard>
        <StepCard number={3}>
          Abre DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la
          pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={4}>
          Pega el script y presiona <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>.
          El script espera entre 1.5 y 3 segundos entre cada acción.
        </StepCard>
        <StepCard number={5}>
          Recarga la página y repite hasta no quedar ningún like.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-6 rounded-lg border border-secondary/50 bg-secondary/10 p-4 text-sm text-secondary-foreground">
        <strong>Consejos:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
          <li>Debes estar en la sección <strong>Me gusta</strong> de tu perfil en TikTok web.</li>
          <li>TikTok carga videos con scroll infinito — carga todos antes de ejecutar.</li>
          <li>Los delays aleatorios simulan comportamiento humano para evitar bloqueos.</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
