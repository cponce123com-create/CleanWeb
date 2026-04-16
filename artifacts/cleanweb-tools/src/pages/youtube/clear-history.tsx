import { SiYoutube } from 'react-icons/si';
import { ToolPageLayout, StepCard } from '@/components/tool-page-layout';

export default function ClearHistory() {
  return (
    <ToolPageLayout
      title="Borrar historial de YouTube"
      platform="YouTube"
      platformIcon={<SiYoutube className="w-5 h-5" />}
      breadcrumbs={[
        { label: 'Inicio', href: '/' },
        { label: 'YouTube' },
        { label: 'Borrar historial' }
      ]}
      info="Google tiene un botón nativo para borrar todo el historial. No necesitas ningún script."
      relatedTools={[
        { title: 'YouTube — Exportar playlist', href: '/youtube/exportar-playlist', description: 'Exporta tu playlist a CSV' },
        { title: 'Google Fotos — Eliminar', href: '/google-fotos', description: 'Elimina fotos masivamente' }
      ]}
    >
      <div className="space-y-2 mb-8">
        <StepCard number={1}>
          Ve a tu historial de YouTube.{' '}
          <a href="https://myactivity.google.com/product/youtube" target="_blank" rel="noreferrer" className="text-primary hover:underline">Abrir historial</a>
        </StepCard>
        <StepCard number={2}>
          Espera que cargue la página con tu actividad reciente.
        </StepCard>
        <StepCard number={3}>
          Haz click en el botón <strong>BORRAR</strong> en la parte superior derecha.
        </StepCard>
        <StepCard number={4}>
          Selecciona <strong>Borrar toda la actividad</strong> y confirma.
        </StepCard>
      </div>
      <div className="mt-8 p-4 rounded-xl border border-blue-500/30 bg-blue-500/10">
        <p className="text-sm text-blue-300 font-semibold mb-2">Consejos</p>
        <ul className="text-sm text-blue-100/80 space-y-1 list-disc list-inside">
          <li>Puedes activar la eliminacion automatica cada 3 o 18 meses</li>
          <li>Ve a Controles para pausar el historial</li>
          <li>Esto tambien borra el historial de busqueda en YouTube</li>
        </ul>
      </div>
    </ToolPageLayout>
  );
}
