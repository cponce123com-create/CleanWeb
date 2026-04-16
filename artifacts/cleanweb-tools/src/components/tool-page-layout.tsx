import { Link } from "wouter";
import { ArrowLeft, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";
import { SiGooglephotos, SiYoutube, SiInstagram, SiX, SiFacebook, SiTiktok, SiSpotify } from "react-icons/si";

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
        {/* Navigation */}
        <nav className="flex items-center text-sm text-muted-foreground mb-8 overflow-x-auto whitespace-nowrap pb-2">
          {breadcrumbs.map((item, i) => (
            <div key={i} className="flex items-center">
              {i > 0 && <span className="mx-2">/</span>}
              {item.href ? (
                <Link href={item.href} className="hover:text-foreground transition-colors">
                  {item.label}
                </Link>
              ) : (
                <span className="text-foreground">{item.label}</span>
              )}
            </div>
          ))}
        </nav>

        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 rounded-md bg-card border border-border text-muted-foreground">
              {platformIcon}
            </div>
            <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{platform}</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-foreground">{title}</h1>
        </div>

        {/* Alerts */}
        <div className="space-y-4 mb-10">
          {warning && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 flex gap-3 text-destructive-foreground">
              <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
              <p className="text-sm">{warning}</p>
            </div>
          )}
          
          {info && (
            <div className="rounded-lg border border-secondary/50 bg-secondary/10 p-4 flex gap-3 text-secondary-foreground">
              <Info className="h-5 w-5 text-secondary shrink-0" />
              <p className="text-sm">{info}</p>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="mb-16">
          {children}
        </div>

        {/* Related Tools */}
        {relatedTools && relatedTools.length > 0 && (
          <div className="mt-16 pt-8 border-t border-border">
            <h2 className="text-xl font-semibold mb-6">Herramientas relacionadas</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {relatedTools.map((tool, i) => (
                <Link key={i} href={tool.href} className="block group">
                  <div className="p-5 rounded-xl bg-card border border-border hover:border-primary hover:-translate-y-1 transition-all duration-200 h-full">
                    <h3 className="font-semibold text-lg mb-2 group-hover:text-primary transition-colors">{tool.title}</h3>
                    <p className="text-sm text-muted-foreground">{tool.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Back button */}
        <div className="mt-12 pt-8 border-t border-border">
          <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a todas las herramientas
          </Link>
        </div>
      </div>
    </div>
  );
}

export function StepCard({ number, children }: { number: number; children: React.ReactNode }) {
  return (
    <div className="flex gap-4 p-5 rounded-xl bg-card border border-border relative mb-4">
      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold border border-primary/20">
        {number}
      </div>
      <div className="pt-1 text-foreground leading-relaxed">
        {children}
      </div>
    </div>
  );
}
