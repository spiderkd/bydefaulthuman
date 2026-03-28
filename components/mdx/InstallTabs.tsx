"use client";

import { useState } from "react";
import { Check, Copy } from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/registry/new-york/ui/tabs";

type PackageManager = "npm" | "pnpm" | "bun";

interface InstallTabsProps {
  manualPath?: string;
  peerDeps?: string[];
  slug: string;
}

const PM_PREFIXES: Record<PackageManager, string> = {
  npm: "npx shadcn add",
  pnpm: "pnpm dlx shadcn add",
  bun: "bunx --bun shadcn add",
};

function getInstallPrefix(pm: PackageManager) {
  if (pm === "npm") return "npm install";
  if (pm === "pnpm") return "pnpm add";
  return "bun add";
}

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  return (
    <button
      aria-label="Copy"
      className="absolute right-3 top-3 rounded-md p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
      onClick={() => {
        void navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }}
      type="button"
    >
      {copied ? (
        <Check className="h-3.5 w-3.5 text-green-500" />
      ) : (
        <Copy className="h-3.5 w-3.5" />
      )}
    </button>
  );
}

export function InstallTabs({
  manualPath,
  peerDeps = [],
  slug,
}: InstallTabsProps) {
  const registryUrl = `https://crumble.dev/r/${slug}.json`;

  return (
    <Tabs className="my-4 w-full" defaultValue="cli">
      <TabsList>
        <TabsTrigger value="cli">CLI</TabsTrigger>
        <TabsTrigger value="manual">Manual</TabsTrigger>
      </TabsList>

      <TabsContent value="cli">
        <Tabs className="mt-2 w-full" defaultValue="npm">
          <TabsList>
            <TabsTrigger value="npm">npm</TabsTrigger>
            <TabsTrigger value="pnpm">pnpm</TabsTrigger>
            <TabsTrigger value="bun">bun</TabsTrigger>
          </TabsList>

          {(["npm", "pnpm", "bun"] as PackageManager[]).map((pm) => {
            const installCommand = `${PM_PREFIXES[pm]} ${registryUrl}`;
            const peerCommand = `${getInstallPrefix(pm)} ${peerDeps.join(" ")}`;

            return (
              <TabsContent key={pm} value={pm}>
                <div className="relative mt-2 overflow-x-auto rounded-md bg-muted/40 p-4">
                  <CopyButton text={installCommand} />
                  <pre className="pr-8 font-mono text-sm text-foreground">
                    <code>{installCommand}</code>
                  </pre>
                </div>

                {peerDeps.length > 0 ? (
                  <>
                    <p className="mt-3 text-xs text-muted-foreground">
                      Also install peer dependencies:
                    </p>
                    <div className="relative mt-1 overflow-x-auto rounded-md bg-muted/40 p-4">
                      <CopyButton text={peerCommand} />
                      <pre className="pr-8 font-mono text-sm text-foreground">
                        <code>{peerCommand}</code>
                      </pre>
                    </div>
                  </>
                ) : null}
              </TabsContent>
            );
          })}
        </Tabs>
      </TabsContent>

      <TabsContent value="manual">
        <div className="mt-2 space-y-2 rounded-md border border-border p-4 text-sm">
          <p className="text-muted-foreground">
            Copy the source file directly into your project:
          </p>
          <ol className="list-inside list-decimal space-y-2 text-sm">
            <li>
              Download{" "}
              <a
                className="text-foreground underline hover:opacity-70"
                href={registryUrl}
                rel="noopener noreferrer"
                target="_blank"
              >
                {slug}.json
              </a>{" "}
              from the registry.
            </li>
            <li>
              Copy the{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                files[0].content
              </code>{" "}
              value into{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                {manualPath ?? `components/crumble/ui/${slug}.tsx`}
              </code>
              .
            </li>
            {peerDeps.length > 0 ? (
              <li>
                Install peer dependencies:{" "}
                {peerDeps.map((dependency, index) => (
                  <span key={dependency}>
                    <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                      {dependency}
                    </code>
                    {index < peerDeps.length - 1 ? ", " : ""}
                  </span>
                ))}
              </li>
            ) : null}
            <li>
              Ensure{" "}
              <code className="rounded bg-muted px-1 py-0.5 font-mono text-xs">
                roughjs
              </code>{" "}
              is installed. It is a shared dependency across all Crumble components.
            </li>
          </ol>
        </div>
      </TabsContent>
    </Tabs>
  );
}
