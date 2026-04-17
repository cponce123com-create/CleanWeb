import { SiInstagram } from "react-icons/si";
import { ToolPageLayout, StepCard } from "@/components/tool-page-layout";
import { ScriptBlock } from "@/components/script-block";

const SCRIPT_CODE = `(async function unfollowNonFollowers() {
  const delay = ms => new Promise(r => setTimeout(r, ms));
  const randDelay = (min, max) => delay(min + Math.random() * (max - min));

  // ── 1. Obtener CSRF token ────────────────────────────────────────────────
  const csrfToken = document.cookie
    .split('; ')
    .find(c => c.startsWith('csrftoken='))
    ?.split('=')[1];

  if (!csrfToken) {
    console.error('[CleanWeb] ❌ No se encontró csrftoken. Asegúrate de estar en instagram.com con sesión iniciada.');
    return;
  }

  // ── 2. Obtener el User ID del usuario actual ─────────────────────────────
  async function getMyUserId() {
    try {
      const r = await fetch('/api/v1/accounts/current_user/?edit=true', {
        headers: { 'X-CSRFToken': csrfToken, 'X-Requested-With': 'XMLHttpRequest' }
      });
      const d = await r.json();
      return d?.user?.pk || d?.user?.id || null;
    } catch { return null; }
  }

  // ── 3. Obtener lista paginada de "following" ─────────────────────────────
  async function getFollowingPage(userId, maxId = '') {
    const params = new URLSearchParams({ count: '50', max_id: maxId });
    const r = await fetch(\`/api/v1/friendships/\${userId}/following/?\${params}\`, {
      headers: { 'X-CSRFToken': csrfToken, 'X-Requested-With': 'XMLHttpRequest' }
    });
    return r.ok ? r.json() : null;
  }

  // ── 4. Obtener lista paginada de "followers" ─────────────────────────────
  async function getFollowersPage(userId, maxId = '') {
    const params = new URLSearchParams({ count: '50', max_id: maxId });
    const r = await fetch(\`/api/v1/friendships/\${userId}/followers/?\${params}\`, {
      headers: { 'X-CSRFToken': csrfToken, 'X-Requested-With': 'XMLHttpRequest' }
    });
    return r.ok ? r.json() : null;
  }

  // ── 5. Dejar de seguir a un usuario ─────────────────────────────────────
  async function unfollowUser(userId) {
    const r = await fetch(\`/api/v1/friendships/destroy/\${userId}/\`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': csrfToken,
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': 'application/x-www-form-urlencoded',
      }
    });
    return r.ok;
  }

  // ── Ejecución principal ──────────────────────────────────────────────────
  console.log('[CleanWeb] 🚀 Iniciando... obteniendo tu User ID');
  const myId = await getMyUserId();
  if (!myId) {
    console.error('[CleanWeb] ❌ No se pudo obtener el User ID. Recarga instagram.com e inténtalo de nuevo.');
    return;
  }
  console.log(\`[CleanWeb] ✅ User ID: \${myId}\`);

  // Cargar todos los followers en un Set para búsqueda O(1)
  console.log('[CleanWeb] 📥 Cargando tus seguidores...');
  const followerIds = new Set();
  let followersMaxId = '';
  do {
    const page = await getFollowersPage(myId, followersMaxId);
    if (!page) break;
    page.users?.forEach(u => followerIds.add(String(u.pk || u.id)));
    followersMaxId = page.next_max_id || '';
    await randDelay(800, 1500);
  } while (followersMaxId);
  console.log(\`[CleanWeb] 📊 Seguidores cargados: \${followerIds.size}\`);

  // Recorrer "following" y unfollow los que no devuelven el follow
  console.log('[CleanWeb] 🔍 Buscando cuentas que no te siguen de vuelta...');
  let followingMaxId = '';
  let unfollowed = 0;
  let skipped = 0;

  do {
    const page = await getFollowingPage(myId, followingMaxId);
    if (!page) break;

    for (const user of (page.users || [])) {
      const uid = String(user.pk || user.id);
      if (!followerIds.has(uid)) {
        const ok = await unfollowUser(uid);
        if (ok) {
          unfollowed++;
          console.log(\`[CleanWeb] 👋 Unfollow #\${unfollowed}: @\${user.username}\`);
          // Pausa anti-ban: 4-8 s entre unfollows
          await randDelay(4000, 8000);
        }
      } else {
        skipped++;
      }
    }

    followingMaxId = page.next_max_id || '';
    if (followingMaxId) await randDelay(2000, 3500);
  } while (followingMaxId);

  console.log(\`[CleanWeb] 🎉 Proceso completado.\`);
  console.log(\`[CleanWeb] ↳ Unfollows: \${unfollowed} | Mantuviste: \${skipped}\`);
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
        { label: "Dejar de seguir no-seguidores" },
      ]}
      warning="Usa el script con moderación. Instagram puede restringir tu cuenta si detecta actividad automática excesiva. El script ya incluye pausas anti-ban."
      info="El script usa la API interna de Instagram — no requiere ninguna app de terceros. Todos los datos quedan en tu navegador."
      relatedTools={[
        {
          title: "Quitar likes masivamente",
          href: "/instagram/quitar-likes",
          description: "Quita likes a publicaciones antiguas rápidamente.",
        },
      ]}
    >
      <div className="mb-8">
        <StepCard number={1}>
          Abre{" "}
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noreferrer"
            className="text-primary hover:underline"
          >
            instagram.com
          </a>{" "}
          e inicia sesión con tu cuenta.
        </StepCard>
        <StepCard number={2}>
          Abre las DevTools con{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">F12</kbd> (Windows/Linux)
          o{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Cmd + Option + I</kbd>{" "}
          (Mac) y ve a la pestaña <strong>Consola</strong>.
        </StepCard>
        <StepCard number={3}>
          Pega el script completo y presiona{" "}
          <kbd className="px-2 py-0.5 bg-muted rounded text-xs font-mono">Enter</kbd>. El script
          cargará tus seguidores automáticamente.
        </StepCard>
        <StepCard number={4}>
          Sigue el progreso en la consola. El script hace pausas de 4-8 segundos entre cada
          unfollow para evitar bloqueos. No cierres la pestaña.
        </StepCard>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-semibold mb-4">Script de ejecución</h3>
        <ScriptBlock code={SCRIPT_CODE} />
      </div>

      <div className="mt-6 p-4 rounded-xl border border-yellow-500/30 bg-yellow-500/10">
        <p className="text-sm text-yellow-200 font-semibold mb-2">⚠️ Límites recomendados</p>
        <ul className="text-sm text-yellow-100/80 space-y-1 list-disc list-inside">
          <li>Máximo 50-100 unfollows por sesión para evitar restricciones temporales.</li>
          <li>Si ves un error de red, espera 30 minutos antes de volver a ejecutar.</li>
          <li>Las cuentas verificadas y celebridades no suelen aparecer como no-seguidores.</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
