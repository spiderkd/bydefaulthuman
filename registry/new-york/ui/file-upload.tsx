"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { useRough } from "@/hooks/use-rough";
import { cn } from "@/lib/utils";
import {
  resolveRoughVars,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";

export interface FileUploadProps extends CrumbleColorProps {
  accept?: string;
  className?: string;
  disabled?: boolean;
  id?: string;
  label?: string;
  multiple?: boolean;
  onChange?: (files: FileList) => void;
  theme?: CrumbleTheme;
}

export function FileUpload({
  accept,
  className,
  disabled = false,
  fill,
  id,
  label,
  multiple = false,
  onChange,
  stroke,
  strokeMuted,
  theme: themeProp,
}: FileUploadProps) {
  const [dragging, setDragging] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const externalSvgRef = useRef<SVGSVGElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const uploadId = id ?? "file-upload";
  const roughStyle = resolveRoughVars({ stroke, strokeMuted, fill });
  const { drawRect, svgRef, theme } = useRough({
    stableId: uploadId,
    svgRef: externalSvgRef,
    theme: themeProp,
    variant: "border",
  });

  const draw = useCallback(() => {
    const svg = svgRef.current;
    const container = containerRef.current;
    if (!svg || !container) return;

    svg.replaceChildren();
    const w = container.offsetWidth;
    const h = container.offsetHeight;
    svg.setAttribute("width", String(w));
    svg.setAttribute("height", String(h));
    svg.setAttribute("viewBox", `0 0 ${w} ${h}`);

    const roughness = dragging ? 2.5 : theme === "crayon" ? 2 : 1;
    const currentStroke = dragging
      ? "var(--cr-stroke)"
      : "var(--cr-stroke-muted)";

    const rect = drawRect(2, 2, w - 4, h - 4, {
      fill: "none",
      roughness,
      stroke: currentStroke,
      strokeLineDash: [8, 6],
    });
    if (rect) svg.appendChild(rect);
  }, [disabled, dragging, drawRect, svgRef, theme]);

  useEffect(() => {
    const id = requestAnimationFrame(() => draw());
    return () => cancelAnimationFrame(id);
  }, [draw]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const ro = new ResizeObserver(() => draw());
    ro.observe(container);
    return () => ro.disconnect();
  }, [draw]);

  const handleFiles = (fileList: FileList) => {
    const arr = Array.from(fileList);
    setFiles(multiple ? arr : arr.slice(0, 1));
    onChange?.(fileList);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled || !e.dataTransfer.files.length) return;
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.length) handleFiles(e.target.files);
  };

  return (
    <div className={cn("flex flex-col gap-1.5", className)} style={roughStyle}>
      {label ? (
        <span className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
      ) : null}
      <div
        ref={containerRef}
        className={cn(
          "relative flex min-h-32 cursor-pointer flex-col items-center justify-center gap-2 rounded-sm p-6",
          disabled && "cursor-not-allowed opacity-40",
          dragging && "bg-muted/30",
        )}
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
      >
        <svg
          ref={externalSvgRef}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-visible"
        />

        <svg
          aria-hidden="true"
          width="32"
          height="32"
          viewBox="0 0 32 32"
          className="text-muted-foreground"
        >
          <line
            x1="16"
            y1="22"
            x2="16"
            y2="8"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <polyline
            points="10,14 16,8 22,14"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <line
            x1="6"
            y1="26"
            x2="26"
            y2="26"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
        </svg>

        <div className="relative text-center">
          {files.length > 0 ? (
            <div className="flex flex-col gap-0.5">
              {files.map((f, i) => (
                <span key={i} className="text-sm font-medium text-foreground">
                  {f.name}
                </span>
              ))}
            </div>
          ) : (
            <>
              <p className="text-sm text-foreground">
                {dragging ? "Drop to upload" : "Click or drag files here"}
              </p>
              {accept ? (
                <p className="mt-0.5 text-xs text-muted-foreground">{accept}</p>
              ) : null}
            </>
          )}
        </div>

        <input
          ref={inputRef}
          id={uploadId}
          type="file"
          accept={accept}
          multiple={multiple}
          disabled={disabled}
          onChange={handleChange}
          className="sr-only"
        />
      </div>
    </div>
  );
}
