import { Linkedin } from "lucide-react";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  let count = 0;
  const buttons = Array.from(document.querySelectorAll('button'))
    .filter(b => b.textContent.includes('Following') || 
                 b.textContent.includes('Siguiendo'));
  if (!buttons.length) {
    alert('No se encontraron botones. Ve a linkedin.com/mynetwork/following/');
    return;
  }
  for (const btn of buttons) {
    btn.click();
    await sleep(300);
    const confirm = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent.includes('Unfollow') || 
                 b.textContent.includes('Dejar de seguir'));
    if (confirm) { confirm.click(); count++; }
    await sleep(2500);
    console.log('[CleanWeb] Unfollowed: ' + count);
  }
  alert('✓ ' + count + ' conexiones dejadas de seguir. Recarga y repite.');
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
        { label: "Dejar de seguir conexiones" }
      ]}
      warning="Solo dejarás de ver sus posts en el feed. Seguirás conectado con ellos."
      relatedTools={[
        {
          title: "Dejar de seguir en Instagram",
          href: "/instagram/dejar-de-seguir",
          description: "Deja de seguir cuentas que no te siguen en Instagram."
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
          Desplázate por la página para cargar más conexiones antes de ejecutar el script.
        </StepCard>
        <StepCard number={3}>
          Abre DevTools (<kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd>) y ve a la
          pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={4}>
          Pega el script y presiona <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>.
          El script espera 2.5 segundos entre cada acción.
        </StepCard>
        <StepCard number={5}>
          Cuando termine, recarga la página y repite hasta limpiar todo el feed.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-6 rounded-lg border border-secondary/50 bg-secondary/10 p-4 text-sm text-secondary-foreground">
        <strong>Consejos:</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside text-muted-foreground">
          <li>Delays de 2.5s por acción para evitar detección de bots.</li>
          <li>Puedes reactivar el seguimiento en cualquier momento desde el perfil.</li>
          <li>Ejecuta varias veces hasta no quedar ningún "Siguiendo".</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
