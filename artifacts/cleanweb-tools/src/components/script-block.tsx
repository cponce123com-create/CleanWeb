import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ScriptBlockProps {
  code: string;
  className?: string;
}

export function ScriptBlock({ code, className }: ScriptBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className={cn("relative group rounded-lg border border-border bg-black overflow-hidden", className)}>
      <div className="absolute right-2 top-2">
        <Button
          variant="secondary"
          size="sm"
          className="h-8 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border-zinc-700 hover:text-white"
          onClick={copyToClipboard}
        >
          {copied ? (
            <>
              <Check className="mr-2 h-4 w-4 text-green-400" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="mr-2 h-4 w-4" />
              Copiar script
            </>
          )}
        </Button>
      </div>
      <div className="p-4 overflow-x-auto text-sm font-mono text-zinc-300">
        <pre>
          <code>{code}</code>
        </pre>
      </div>
    </div>
  );
}
