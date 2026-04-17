import { useState } from "react";
import { Check, Copy, Terminal } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScriptBlockProps {
  code: string;
  className?: string;
  language?: string;
}

export function ScriptBlock({ code, className, language = "javascript" }: ScriptBlockProps) {
  const [copied, setCopied] = useState(false);

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for browsers without clipboard API
      const ta = document.createElement("textarea");
      ta.value = code;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.split("\n");

  return (
    <div className={cn("rounded-xl border border-zinc-700/60 bg-zinc-950 overflow-hidden shadow-lg", className)}>
      {/* Header bar */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-800 bg-zinc-900/80">
        <div className="flex items-center gap-2.5">
          {/* Traffic light dots */}
          <span className="w-3 h-3 rounded-full bg-zinc-600" />
          <span className="w-3 h-3 rounded-full bg-zinc-600" />
          <span className="w-3 h-3 rounded-full bg-zinc-600" />
          <div className="flex items-center gap-1.5 ml-2 text-zinc-500">
            <Terminal className="w-3.5 h-3.5" />
            <span className="text-xs font-mono">{language}</span>
          </div>
        </div>

        <button
          onClick={copyToClipboard}
          className={cn(
            "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150",
            copied
              ? "bg-primary/20 text-primary border border-primary/30"
              : "bg-zinc-800 text-zinc-300 border border-zinc-700 hover:bg-zinc-700 hover:text-white",
          )}
          aria-label={copied ? "Copiado" : "Copiar script"}
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5" />
              ¡Copiado!
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5" />
              Copiar script
            </>
          )}
        </button>
      </div>

      {/* Code body with line numbers */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm font-mono">
          <tbody>
            {lines.map((line, i) => (
              <tr
                key={i}
                className="hover:bg-zinc-800/30 transition-colors"
              >
                {/* Line number */}
                <td
                  className="select-none text-right pr-4 pl-4 py-0 text-zinc-600 text-xs w-10 align-top"
                  style={{ lineHeight: "1.6rem" }}
                  aria-hidden
                >
                  {i + 1}
                </td>
                {/* Line content */}
                <td
                  className="pr-6 py-0 text-zinc-200 whitespace-pre align-top"
                  style={{ lineHeight: "1.6rem" }}
                >
                  <ColorizedLine line={line} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ── Minimal syntax highlighter (no external deps) ──────────────────────────

const COMMENT_RE  = /(\/\/.*$|\/\*[\s\S]*?\*\/)/gm;
const STRING_RE   = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)/g;
const KEYWORD_RE  = /\b(async|await|function|const|let|var|return|if|else|for|while|true|false|null|undefined|of|in|new|typeof|break|continue|import|export|default|class|extends|this|throw|try|catch|finally)\b/g;
const NUMBER_RE   = /\b(\d+(?:\.\d+)?)\b/g;
const BUILTIN_RE  = /\b(console|document|window|fetch|Math|JSON|Promise|Array|Object|String|Number|Boolean|setTimeout|clearTimeout|setInterval|URL|Blob|alert|confirm)\b/g;

function ColorizedLine({ line }: { line: string }) {
  if (!line.trim()) return <>&nbsp;</>;

  // We do a simple sequential pass — no AST, good enough for display
  const parts: { text: string; cls: string }[] = [];
  let rest = line;

  // Helper: push a plain segment then a colored token
  function consume(match: RegExpExecArray, cls: string) {
    const before = rest.slice(0, match.index);
    if (before) parts.push({ text: before, cls: "" });
    parts.push({ text: match[0], cls });
    rest = rest.slice((match.index ?? 0) + match[0].length);
  }

  // Comments first (highest priority)
  const commentMatch = COMMENT_RE.exec(line);
  COMMENT_RE.lastIndex = 0;
  if (commentMatch && commentMatch.index !== undefined) {
    const before = line.slice(0, commentMatch.index);
    if (before) parts.push(...tokenizeSegment(before));
    parts.push({ text: commentMatch[0], cls: "text-zinc-500 italic" });
    const after = line.slice(commentMatch.index + commentMatch[0].length);
    if (after) parts.push({ text: after, cls: "" });
    return <>{parts.map((p, i) => <span key={i} className={p.cls || ""}>{p.text}</span>)}</>;
  }

  return <>{tokenizeSegment(line).map((p, i) => <span key={i} className={p.cls || ""}>{p.text}</span>)}</>;
}

function tokenizeSegment(seg: string): { text: string; cls: string }[] {
  // String literals
  const stringMatch = STRING_RE.exec(seg);
  STRING_RE.lastIndex = 0;
  if (stringMatch && stringMatch.index !== undefined) {
    const result: { text: string; cls: string }[] = [];
    const before = seg.slice(0, stringMatch.index);
    if (before) result.push(...tokenizeNonString(before));
    result.push({ text: stringMatch[0], cls: "text-emerald-400" });
    const after = seg.slice(stringMatch.index + stringMatch[0].length);
    if (after) result.push(...tokenizeSegment(after));
    return result;
  }
  return tokenizeNonString(seg);
}

function tokenizeNonString(seg: string): { text: string; cls: string }[] {
  if (!seg) return [];
  // Apply keyword, builtin, number coloring via simple replace
  const tokens: { text: string; cls: string }[] = [];

  // Split by word boundaries to classify each token
  const wordRe = /(\w+|\W+)/g;
  let m: RegExpExecArray | null;
  while ((m = wordRe.exec(seg)) !== null) {
    const t = m[0];
    if (KEYWORD_RE.test(t)) {
      tokens.push({ text: t, cls: "text-violet-400 font-medium" });
    } else if (BUILTIN_RE.test(t)) {
      tokens.push({ text: t, cls: "text-sky-400" });
    } else if (NUMBER_RE.test(t)) {
      tokens.push({ text: t, cls: "text-amber-400" });
    } else {
      tokens.push({ text: t, cls: "" });
    }
    KEYWORD_RE.lastIndex = 0;
    BUILTIN_RE.lastIndex = 0;
    NUMBER_RE.lastIndex = 0;
  }
  return tokens;
}
