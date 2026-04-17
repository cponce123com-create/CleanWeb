import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Info, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ToolPageLayoutProps {
  title: string;
  platform: string;
  platformIcon?: React.ReactNode;
  breadcrumbs: BreadcrumbItem[];
  warning?: string;
  info?: string;
  children: React.ReactNode;
  relatedTools?: { title: string; href: string; description: string }[];
}

export function ToolPageLayout({
  title,
  platform,
  platformIcon,
  breadcrumbs,
  warning,
  info,
  children,
  relatedTools,
}: ToolPageLayoutProps) {
  return (
    <div className="min-h-screen bg-background text-foreground pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 pt-8">

        {/* ── Breadcrumb navigation ── */}
        <nav
          aria-label="Migas de pan"
          className="flex items-center gap-1 text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-1"
        >
          {breadcrumbs.map((item, i) => (
            <div key={i} className="flex items-center gap-1">
              {i > 0 && <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/50 flex-shrink-0" />}
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground font-medium truncate max-w-[200px]">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* ── Page header ── */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="p-1.5 rounded-md bg-card border border-border text-muted-foreground">
              {platformIcon}
            </div>
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">
              {platform}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground leading-tight">
            {title}
          </h1>
        </div>

        {/* ── Alerts ── */}
        {(warning || info) && (
          <div className="space-y-3 mb-10">
            {warning && (
              <div className="rounded-xl border border-destructive/40 bg-destructive/8 p-4 flex gap-3">
                <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                <p className="text-sm text-destructive-foreground leading-relaxed">{warning}</p>
              </div>
            )}
            {info && (
              <div className="rounded-xl border border-secondary/40 bg-secondary/8 p-4 flex gap-3">
                <Info className="h-5 w-5 text-secondary shrink-0 mt-0.5" />
                <p className="text-sm text-secondary-foreground leading-relaxed">{info}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Main content slot ── */}
        <div className="mb-16">{children}</div>

        {/* ── Related tools ── */}
        {relatedTools && relatedTools.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-lg font-semibold mb-5 text-muted-foreground uppercase tracking-wider text-sm">
              Herramientas relacionadas
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {relatedTools.map((tool, i) => (
                <Link key={i} href={tool.href} className="block group outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl">
                  <div className="p-4 rounded-xl bg-card border border-border hover:border-primary hover:-translate-y-0.5 transition-all duration-200 h-full flex items-start justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">
                        {tool.title}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">{tool.description}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-0.5 transition-all flex-shrink-0 mt-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* ── Back to home ── */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors group"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            Volver a todas las herramientas
          </Link>
        </div>

      </div>
    </div>
  );
}

// ── StepCard ──────────────────────────────────────────────────────────────

export function StepCard({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl bg-card border border-border mb-3 group hover:border-border/80 transition-colors">
      <div className="flex-shrink-0 w-7 h-7 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-sm border border-primary/20">
        {number}
      </div>
      <div className="pt-0.5 text-foreground leading-relaxed text-sm">{children}</div>
    </div>
  );
}
