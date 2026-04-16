import { useState } from "react";
import { Link } from "wouter";
import { Search, Sparkles, Linkedin, Mail } from "lucide-react";
import { 
  SiInstagram, 
  SiX, 
  SiFacebook, 
  SiTiktok, 
  SiSpotify, 
  SiYoutube, 
  SiGooglephotos,
  SiReddit
} from "react-icons/si";
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
  SiLinkedin: Linkedin,
  SiReddit
};

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTools = toolsData.filter(tool => 
    tool.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    tool.platform.toLowerCase().includes(searchQuery.toLowerCase()) ||
    tool.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const groupedTools = filteredTools.reduce((acc, tool) => {
    if (!acc[tool.platform]) {
      acc[tool.platform] = [];
    }
    acc[tool.platform].push(tool);
    return acc;
  }, {} as Record<string, typeof toolsData>);

  const platforms = Object.keys(groupedTools);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-primary/30">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12 sm:py-20">
        
        {/* Header Section */}
        <header className="text-center mb-16 space-y-6">
          <div className="inline-flex items-center justify-center gap-3">
            <Sparkles className="w-10 h-10 text-primary" />
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-foreground">
              CleanWeb<span className="text-primary">.tools</span>
            </h1>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
            Herramientas gratuitas para limpiar y gestionar tu vida digital.
          </p>
          
          <div className="max-w-xl mx-auto pt-6 relative">
            <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
              <Input
                data-testid="input-search"
                type="text" 
                placeholder="Buscar por herramienta o plataforma..." 
                className="w-full h-14 pl-12 pr-4 bg-card border-border rounded-xl text-lg focus-visible:ring-primary/50 transition-all shadow-sm"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>
        </header>

        {/* Tools Grid */}
        <div className="space-y-16">
          {platforms.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              No se encontraron herramientas que coincidan con tu búsqueda.
            </div>
          ) : (
            platforms.map(platform => (
              <section key={platform}>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-3 border-b border-border pb-4">
                  {platform}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {groupedTools[platform].map((tool) => {
                    const Icon = iconMap[tool.icon];
                    const CardContent = (
                      <div className={cn(
                        "p-6 rounded-xl border h-full transition-all duration-200 flex flex-col",
                        tool.disabled 
                          ? "bg-card/50 border-border/50 opacity-60 cursor-not-allowed" 
                          : "bg-card border-border hover:border-primary hover:-translate-y-1 hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] cursor-pointer group"
                      )}>
                        <div className="flex justify-between items-start mb-4">
                          <div className={cn("p-2.5 rounded-lg", tool.disabled ? "bg-muted" : "bg-primary/10 text-primary")}>
                            {Icon && <Icon className="w-6 h-6" />}
                          </div>
                          <span className={cn(
                            "text-xs px-2.5 py-1 rounded-full font-medium border",
                            tool.badgeColor === "green" && "bg-primary/10 text-primary border-primary/20",
                            tool.badgeColor === "blue" && "bg-secondary/10 text-secondary border-secondary/20",
                            tool.badgeColor === "gray" && "bg-muted text-muted-foreground border-border"
                          )}>
                            {tool.badge}
                          </span>
                        </div>
                        <h3 className={cn("text-lg font-bold mb-2", !tool.disabled && "group-hover:text-primary transition-colors")}>
                          {tool.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-auto">
                          {tool.description}
                        </p>
                      </div>
                    );

                    return tool.disabled ? (
                      <div key={tool.id}>{CardContent}</div>
                    ) : (
                      <Link key={tool.id} href={tool.href} className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                        {CardContent}
                      </Link>
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </div>

        {/* Suggest a tool */}
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

        {/* Footer */}
        <footer className="mt-16 pt-8 border-t border-border text-center pb-8 space-y-2">
          <p className="text-muted-foreground">
            Todas las herramientas funcionan en tu navegador. Ningún dato es enviado a ningún servidor.
          </p>
          <p className="text-primary font-medium text-sm">
            Nuevas herramientas cada semana.
          </p>
        </footer>
        
      </div>
    </div>
  );
}
