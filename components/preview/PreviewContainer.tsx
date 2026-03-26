"use client";

import { useState, type ReactNode } from "react";
import { CrumbleProvider } from "@/lib/crumble-context";
import type { CrumbleTheme } from "@/lib/rough";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/registry/new-york/ui/tabs";
import { RoughLine } from "@/components/primitives/rough-line";
import { RefreshCw, Copy, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface PreviewContainerProps {
  children: ReactNode;
  code?: string;
  componentName?: string;
  defaultTheme?: CrumbleTheme;
}

const THEMES: CrumbleTheme[] = ["pencil", "ink", "crayon"];

export function PreviewContainer({
  children,
  code,
  componentName,
  defaultTheme = "pencil",
}: PreviewContainerProps) {
  const [theme, setTheme] = useState<CrumbleTheme>(defaultTheme);
  const [copied, setCopied] = useState(false);
  const [previewKey, setPreviewKey] = useState(0);
  const [rotation, setRotation] = useState(0);

  const installCmd = componentName
    ? `npx shadcn add https://crumble.dev/r/${componentName}.json`
    : null;

  const handleRefresh = () => {
    setPreviewKey((k) => k + 1);
    setRotation((r) => r + 360);
  };

  const handleThemeChange = (t: CrumbleTheme) => {
    setTheme(t);
    setPreviewKey((k) => k + 1);
    setRotation((r) => r + 360);
  };

  const handleCopy = () => {
    if (!code) return;
    void navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="my-6 flex flex-col">
      <Tabs theme={theme} defaultValue="preview" className="w-full">
        <div className="flex items-center justify-between border-b border-border pb-0">
          <TabsList>
            <TabsTrigger value="preview">Preview</TabsTrigger>
            {code ? <TabsTrigger value="code">Code</TabsTrigger> : null}
          </TabsList>

          <div className="flex items-center gap-1 pb-1">
            {THEMES.map((t) => (
              <button
                key={t}
                onClick={() => handleThemeChange(t)}
                className={cn(
                  "rounded-full border px-2 py-0.5 text-[11px] font-medium transition-colors",
                  theme === t
                    ? "border-foreground/40 text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}

            <button
              onClick={handleRefresh}
              className="ml-1 rounded-full p-1 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Refresh preview"
            >
              <RefreshCw
                className="w-3 h-3 transition-transform duration-300"
                style={{ transform: `rotate(${rotation}deg)` }}
              />
            </button>
          </div>
        </div>

        <TabsContent value="preview">
          <CrumbleProvider key={previewKey} theme={theme}>
            <div className="flex min-h-36 items-center justify-center bg-background p-8">
              {children}
            </div>
          </CrumbleProvider>
        </TabsContent>

        {code ? (
          <TabsContent value="code">
            <div className="relative overflow-x-auto bg-muted/40 p-4">
              <button
                onClick={handleCopy}
                className="absolute top-3 right-3 rounded-md p-1.5 text-muted-foreground hover:text-foreground hover:bg-muted transition-colors"
                aria-label="Copy code"
              >
                {copied ? (
                  <Check className="w-3.5 h-3.5 text-green-500" />
                ) : (
                  <Copy className="w-3.5 h-3.5" />
                )}
              </button>
              <pre className="font-mono text-sm leading-relaxed text-foreground pr-8">
                <code>{code}</code>
              </pre>
            </div>
          </TabsContent>
        ) : null}
      </Tabs>

      {installCmd ? (
        <div className="mt-2">
          <RoughLine orientation="horizontal" className="mb-3" />
          <div className="flex items-center px-1">
            <code className="font-mono text-xs text-muted-foreground">
              {installCmd}
            </code>
          </div>
        </div>
      ) : null}
    </div>
  );
}
