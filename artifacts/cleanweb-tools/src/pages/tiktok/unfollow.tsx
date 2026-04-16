import { SiTiktok } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function() {
  const buttons = Array.from(document.querySelectorAll('button'))
    .filter(b => {
      const text = b.textContent?.trim();
      return text === 'Following' || 
             text === 'Siguiendo' ||
             b.getAttribute('aria-label')?.includes('following');
    });

  if (!buttons.length) {
    alert('No se encontraron botones.\\nAsegúrate de estar en tiktok.com/@TU_USUARIO y haber hecho click en "Siguiendo".');
    return;
  }

  const ok = confirm('Se encontraron ' + buttons.length + ' botones "Siguiendo".\\nPresiona OK para empezar.');
  if (!ok) return;

  let count = 0;
  for (const btn of buttons) {
    btn.scrollIntoView({ behavior: 'smooth' });
    btn.click();
    count++;
    await new Promise(r => setTimeout(r, 2000));
    const confirmBtn = Array.from(document.querySelectorAll('button'))
      .find(b => b.textContent?.includes('Unfollow') || 
                 b.textContent?.includes('Dejar'));
    if (confirmBtn) confirmBtn.click();
    await new Promise(r => setTimeout(r, 1500));
    console.log('[CleanWeb] Unfollowed: ' + count);
  }
  alert('Lote completado: ' + count + ' unfollows.\\nRecarga la página y ejecuta de nuevo si quedan más.');
})();`;

export default function UnfollowTiktok() {
  return (
    <ToolPageLayout
      title="Dejar de seguir todos en TikTok"
      platform="TikTok"
      platformIcon={<SiTiktok className="w-5 h-5" />}
      breadcrumbs={[
        { label: "Inicio", href: "/" },
        { label: "TikTok" },
        { label: "Dejar de seguir todos" }
      ]}
      info="TikTok detecta automatización agresiva. El script incluye delays para reducir el riesgo, pero no garantiza resultados en todos los casos."
      relatedTools={[
        { title: "TikTok — Quitar likes", href: "/tiktok/quitar-likes", description: "Elimina todos tus likes de TikTok" },
        { title: "Instagram — Dejar de seguir", href: "/instagram/dejar-de-seguir", description: "Deja de seguir no-seguidores en Instagram" }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a tu perfil de TikTok web y haz click en <strong>"Siguiendo"</strong> para ver la lista de cuentas que sigues.{" "}
          <a href="https://www.tiktok.com" target="_blank" rel="noreferrer" className="text-primary hover:underline">
            Abrir TikTok
          </a>
        </StepCard>
        <StepCard number={2}>
          Desplázate hacia abajo para cargar todas las cuentas antes de ejecutar el script.
        </StepCard>
        <StepCard number={3}>
          Abre la consola con <kbd className="px-2 py-1 bg-muted rounded text-xs">F12</kbd> → pestaña <strong>Consola</strong>.
          En Mac: <kbd className="px-2 py-1 bg-muted rounded text-xs">Cmd + Option + J</kbd>
        </StepCard>
        <StepCard number={4}>
          Copia el script, pégalo en la consola y presiona <kbd className="px-2 py-1 bg-muted rounded text-xs">Enter</kbd>.
          Recarga y repite hasta terminar.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-8 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
        <p className="text-sm text-yellow-200 font-semibold mb-2">⚠️ Importante</p>
        <ul className="text-sm text-yellow-100/80 space-y-1 list-disc list-inside">
          <li>TikTok puede bloquear tu cuenta temporalmente si detecta automatización</li>
          <li>Si ves un captcha, espera 30 minutos antes de continuar</li>
          <li>El método más confiable es manual desde la app móvil</li>
          <li>En la app: Perfil → Siguiendo → mantén presionado → Dejar de seguir</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
