import { useState, useMemo } from "react";
import { Link } from "wouter";
import { Search, Sparkles, Mail, ChevronRight, Zap, Shield, Globe } from "lucide-react";
import {
  SiInstagram,
  SiX,
  SiFacebook,
  SiTiktok,
  SiSpotify,
  SiYoutube,
  SiGooglephotos,
  SiReddit,
} from "react-icons/si";
import { FaLinkedin } from "react-icons/fa";
import { Input } from "@/components/ui/input";
import { toolsData } from "@/data/tools";
import { cn } from "@/lib/utils";

const iconMap: Record<string, React.ElementType> = {
  SiGooglephotos,
  SiYoutube,
  SiInstagram,
  SiX,
  SiFacebook,
  SiTiktok,
  SiSpotify,
  SiLinkedin: FaLinkedin,
  SiReddit,
};

const platformColorMap: Record<string, string> = {
  Google:       "text-[#EA4335]",
  YouTube:      "text-[#FF0000]",
  Instagram:    "text-[#E1306C]",
  "Twitter / X":"text-[#ffffff]",
  Facebook:     "text-[#1877F2]",
  TikTok:       "text-[#69C9D0]",
  Spotify:      "text-[#1DB954]",
  LinkedIn:     "text-[#0A66C2]",
  Reddit:       "text-[#FF4500]",
};

const platformBgMap: Record<string, string> = {
  Google:       "bg-[#EA4335]/10 border-[#EA4335]/20",
  YouTube:      "bg-[#FF0000]/10 border-[#FF0000]/20",
  Instagram:    "bg-[#E1306C]/10 border-[#E1306C]/20",
  "Twitter / X":"bg-white/5 border-white/10",
  Facebook:     "bg-[#1877F2]/10 border-[#1877F2]/20",
  TikTok:       "bg-[#69C9D0]/10 border-[#69C9D0]/20",
  Spotify:      "bg-[#1DB954]/10 border-[#1DB954]/20",
  LinkedIn:     "bg-[#0A66C2]/10 border-[#0A66C2]/20",
  Reddit:       "bg-[#FF4500]/10 border-[#FF4500]/20",
};

const PLATFORM_ORDER = [
  "Google", "YouTube", "Instagram", "Twitter / X",
  "Facebook", "TikTok", "Spotify", "LinkedIn", "Reddit",
];

const totalTools    = toolsData.length;
const availableTools = toolsData.filter((t) => !t.disabled).length;
const totalPlatforms = [...new Set(toolsData.map((t) => t.platform))].length;

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = useMemo(
    () =>
      toolsData.filter(
        (tool) =>
          tool.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
          tool.description.toLowerCase().includes(searchQuery.toLowerCase()),
      ),
    [searchQuery],
  );

  const groupedTools = useMemo(
    () =>
      filteredTools.reduce(
        (acc, tool) => {
          if (!acc[tool.platform]) acc[tool.platform] = [];
          acc[tool.platform].push(tool);
          return acc;
        },
        {} as Record<string, typeof toolsData>,
      ),
    [filteredTools],
  );

  // Respect platform display order
  const platforms = PLATFORM_ORDER.filter((p) => groupedTools[p]);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">

        {/* ── Hero ── */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              CleanWeb<span className="text-primary">.tools</span>
            </h1>
          </div>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Herramientas gratuitas para limpiar y gestionar tu vida digital.
            Sin instalar nada. Sin enviar datos.
          </p>

          {/* Stats strip */}
          <div className="inline-flex items-center gap-6 sm:gap-10 px-6 py-3 rounded-full border border-border bg-card/60 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Zap className="w-4 h-4 text-primary" />
              <span><strong className="text-foreground">{availableTools}</strong> herramientas activas</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4 text-secondary" />
              <span><strong className="text-foreground">{totalPlatforms}</strong> plataformas</span>
            </div>
            <div className="w-px h-4 bg-border" />
            <div className="flex items-center gap-2 text-muted-foreground">
              <Shield className="w-4 h-4 text-primary" />
              <span>100% privado</span>
            </div>
          </div>

          {/* Search */}
          <div className="max-w-xl mx-auto pt-4 relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                data-testid="input-search"
                type="search"
                placeholder="Buscar por herramienta o plataforma…"
                className="w-full h-14 pl-12 pr-4 bg-card border-border rounded-xl text-lg focus-visible:ring-primary/50 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            {searchQuery && (
              <p className="mt-2 text-sm text-muted-foreground text-left px-1">
                {filteredTools.length === 0
                  ? "Sin resultados"
                  : `${filteredTools.length} herramienta${filteredTools.length !== 1 ? "s" : ""} encontrada${filteredTools.length !== 1 ? "s" : ""}`}
              </p>
            )}
          </div>
        </header>

        {/* ── Tools Grid ── */}
        <div className="space-y-14">
          {platforms.length === 0 ? (
            <div className="text-center py-20 space-y-3">
              <p className="text-2xl">🔍</p>
              <p className="text-muted-foreground text-lg">
                No se encontraron herramientas para <strong>"{searchQuery}"</strong>.
              </p>
              <button
                onClick={() => setSearchQuery("")}
                className="text-sm text-primary hover:underline"
              >
                Limpiar búsqueda
              </button>
            </div>
          ) : (
            platforms.map((platform) => {
              const platformIcon = iconMap[groupedTools[platform][0]?.icon];
              const PlatformIcon = platformIcon;
              const colorClass = platformColorMap[platform] ?? "text-muted-foreground";
              const bgClass    = platformBgMap[platform]   ?? "bg-card border-border";

              return (
                <section key={platform}>
                  {/* Section header */}
                  <div className="flex items-center gap-3 mb-6 border-b border-border pb-4">
                    <div className={cn("p-1.5 rounded-lg border", bgClass)}>
                      {PlatformIcon && <PlatformIcon className={cn("w-5 h-5", colorClass)} />}
                    </div>
                    <h2 className="text-2xl font-bold">{platform}</h2>
                    <span className="ml-auto text-xs text-muted-foreground tabular-nums">
                      {groupedTools[platform].filter((t) => !t.disabled).length}/
                      {groupedTools[platform].length} disponibles
                    </span>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {groupedTools[platform].map((tool) => {
                      const Icon = iconMap[tool.icon];

                      const CardInner = (
                        <div
                          className={cn(
                            "p-6 rounded-xl border h-full transition-all duration-200 flex flex-col gap-3",
                            tool.disabled
                              ? "bg-card/40 border-border/40 opacity-55 cursor-not-allowed"
                              : "bg-card border-border hover:border-primary hover:-translate-y-1 hover:shadow-[0_8px_30px_rgba(0,0,0,0.25)] cursor-pointer group",
                          )}
                        >
                          {/* Top row: icon + badge */}
                          <div className="flex justify-between items-start">
                            <div
                              className={cn(
                                "p-2.5 rounded-lg border",
                                tool.disabled ? "bg-muted border-border/50" : bgClass,
                              )}
                            >
                              {Icon && (
                                <Icon
                                  className={cn(
                                    "w-5 h-5",
                                    tool.disabled ? "text-muted-foreground" : colorClass,
                                  )}
                                />
                              )}
                            </div>
                            <span
                              className={cn(
                                "text-xs px-2.5 py-1 rounded-full font-medium border",
                                tool.badgeColor === "green" &&
                                  "bg-primary/10 text-primary border-primary/20",
                                tool.badgeColor === "blue" &&
                                  "bg-secondary/10 text-secondary border-secondary/20",
                                tool.badgeColor === "gray" &&
                                  "bg-muted text-muted-foreground border-border",
                              )}
                            >
                              {tool.badge}
                            </span>
                          </div>

                          {/* Title */}
                          <h3
                            className={cn(
                              "text-base font-bold leading-snug",
                              !tool.disabled && "group-hover:text-primary transition-colors",
                            )}
                          >
                            {tool.title}
                          </h3>

                          {/* Description + arrow */}
                          <div className="flex items-end justify-between gap-2 mt-auto">
                            <p className="text-sm text-muted-foreground leading-relaxed">
                              {tool.description}
                            </p>
                            {!tool.disabled && (
                              <ChevronRight className="w-4 h-4 text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-1 transition-all flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      );

                      return tool.disabled ? (
                        <div key={tool.id} title="Próximamente">{CardInner}</div>
                      ) : (
                        <Link
                          key={tool.id}
                          href={tool.href}
                          className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl"
                        >
                          {CardInner}
                        </Link>
                      );
                    })}
                  </div>
                </section>
              );
            })
          )}
        </div>

        {/* ── Suggest a tool ── */}
        <section className="mt-24">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold mb-2">¿Necesitas otra herramienta?</h2>
            <p className="text-muted-foreground">
              Dinos qué plataforma o acción te gustaría automatizar y la añadiremos.
            </p>
          </div>
          <div className="max-w-sm mx-auto">
            <a
              data-testid="link-suggest-tool"
              href="mailto:tools@cleanweb.tools?subject=Sugerencia%20de%20herramienta"
              className="flex items-center justify-center gap-3 p-6 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 hover:-translate-y-1 transition-all duration-200 group"
            >
              <Mail className="w-5 h-5 text-primary" />
              <span className="font-semibold text-primary group-hover:underline">
                Enviar sugerencia
              </span>
            </a>
          </div>
        </section>

        {/* ── Footer ── */}
        <footer className="mt-16 pt-8 border-t border-border text-center pb-8 space-y-2">
          <p className="text-muted-foreground text-sm">
            Todas las herramientas funcionan en tu navegador. Ningún dato es enviado a ningún servidor.
          </p>
          <p className="text-primary font-medium text-sm">
            Nuevas herramientas cada semana · {totalTools} herramientas en total
          </p>
        </footer>

      </div>
    </div>
  );
}
