"use client";

/**
 * Annotation — Crumble wrapper around rough-notation.
 *
 * rough-notation handles the hard parts: SVG layout timing, getTotalLength(),
 * CSS keyframe injection, multiline via getClientRects(), resize observation,
 * and annotationGroup sequencing. We wrap it in React with Crumble's theme
 * system and add trigger="inView" | "hover" | "mount".
 *
 * Install dep:  npm install rough-notation
 */

import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type HTMLAttributes,
  type ReactNode,
} from "react";
import { annotate } from "rough-notation";

type RoughAnnotation = ReturnType<typeof annotate>;
import { cn } from "@/lib/utils";
import {
  CrumbleContext,
  type CrumbleColorProps,
  type CrumbleTheme,
} from "@/lib/rough";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AnnotationType =
  | "underline"
  | "box"
  | "circle"
  | "highlight"
  | "strike-through"
  | "crossed-off"
  | "bracket";

export type AnnotationSide = "top" | "bottom" | "left" | "right";
export type BracketSide = "left" | "right" | "top" | "bottom";
export type AnnotationTrigger = "mount" | "inView" | "hover";

export interface AnnotationProps
  extends HTMLAttributes<HTMLSpanElement>, CrumbleColorProps {
  animate?: boolean;
  /**
   * Delay before the draw animation starts (ms).
   * Useful for sequencing multiple annotations on a page.
   */
  animationDelay?: number;
  animationDuration?: number;
  /** Which bracket sides to draw. Only for type="bracket". Default: ["left","right"] */
  brackets?: BracketSide | BracketSide[];
  color?: string;
  /** Number of times each stroke is drawn. Default 2. Creates the double-drawn look. */
  iterations?: number;
  label?: ReactNode;
  labelSide?: AnnotationSide;
  /**
   * Annotate each text line independently (via getClientRects).
   * Essential for underline / highlight / strike-through on wrapping text.
   */
  multiline?: boolean;
  padding?: number | [number, number] | [number, number, number, number];
  /**
   * Controlled visibility. Provide this to take full control.
   * Re-animates every time show flips false → true.
   */
  show?: boolean;
  strokeWidth?: number;
  theme?: CrumbleTheme;
  /**
   * "mount"  — draw on first render (default)
   * "inView" — draw once when element enters viewport
   * "hover"  — draw on mouseenter, reset on mouseleave
   */
  trigger?: AnnotationTrigger;
  type?: AnnotationType;
}

// ─── Theme → rough-notation config ───────────────────────────────────────────

function getThemeDefaults(theme: CrumbleTheme) {
  switch (theme) {
    case "ink":
      return { strokeWidth: 1.8, animationDuration: 380, iterations: 1 };
    case "crayon":
      return { strokeWidth: 3, animationDuration: 750, iterations: 2 };
    case "pencil":
    default:
      return { strokeWidth: 1.2, animationDuration: 600, iterations: 2 };
  }
}

// ─── Component ────────────────────────────────────────────────────────────────

export function Annotation({
  animate = true,
  animationDelay = 0,
  animationDuration,
  brackets: bracketsProp,
  children,
  className,
  color = "currentColor",
  iterations: iterationsProp,
  label,
  labelSide = "top",
  multiline = false,
  padding = 5,
  show: showProp,
  strokeWidth: strokeWidthProp,
  style,
  theme: themeProp,
  trigger = "mount",
  type = "underline",
  // CrumbleColorProps — unused by rough-notation directly, accepted for API compat
  fill: _fill,
  stroke: _stroke,
  strokeMuted: _strokeMuted,
  ...props
}: AnnotationProps) {
  const spanRef = useRef<HTMLSpanElement>(null);
  const annotationRef = useRef<RoughAnnotation | null>(null);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { theme: contextTheme } = useContext(CrumbleContext);
  const theme = themeProp ?? contextTheme;
  const themeDefaults = getThemeDefaults(theme);

  const resolvedDuration = animationDuration ?? themeDefaults.animationDuration;
  const resolvedIterations = iterationsProp ?? themeDefaults.iterations;
  const resolvedStrokeWidth = strokeWidthProp ?? themeDefaults.strokeWidth;
  const resolvedBrackets = bracketsProp
    ? Array.isArray(bracketsProp)
      ? bracketsProp
      : [bracketsProp]
    : (["left", "right"] as BracketSide[]);

  // ── Controlled vs uncontrolled ──────────────────────────────────────────────
  const isControlled = showProp !== undefined;
  const [internalVisible, setInternalVisible] = useState(
    !isControlled && trigger === "mount",
  );
  const visible = isControlled ? showProp : internalVisible;

  // ── Show / hide helpers ─────────────────────────────────────────────────────
  const showAnnotation = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      annotationRef.current?.show();
      timeoutRef.current = null;
    }, animationDelay);
  }, [animationDelay]);

  const hideAnnotation = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    annotationRef.current?.hide();
  }, []);

  // ── Init rough-notation annotation ─────────────────────────────────────────
  useEffect(() => {
    const el = spanRef.current;
    if (!el) return;

    // rough-notation inserts SVG as a sibling to el, so the parent needs
    // position:relative. We set it here rather than requiring the user to.
    const parent = el.parentElement;
    if (parent) {
      const pos = window.getComputedStyle(parent).position;
      if (!pos || pos === "static") {
        parent.style.position = "relative";
      }
    }

    const ann = annotate(el, {
      type,
      animate,
      animationDuration: resolvedDuration,
      color,
      strokeWidth: resolvedStrokeWidth,
      padding,
      iterations: resolvedIterations,
      multiline,
      brackets: resolvedBrackets as any,
    });

    annotationRef.current = ann;

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      ann.remove();
      annotationRef.current = null;
    };
    // Only re-init if the type changes — type cannot be changed on a live annotation
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type]);

  // ── Live-update mutable props (no re-init needed) ──────────────────────────
  useEffect(() => {
    const ann = annotationRef.current;
    if (!ann) return;
    ann.animate = animate;
    ann.animationDuration = resolvedDuration;
    ann.color = color;
    ann.strokeWidth = resolvedStrokeWidth;
    ann.padding = padding as any;
    ann.iterations = resolvedIterations;
    // Re-show to apply new styles if currently visible
    if (ann.isShowing()) {
      ann.show();
    }
  }, [
    animate,
    resolvedDuration,
    color,
    resolvedStrokeWidth,
    padding,
    resolvedIterations,
  ]);

  // ── React to visible state ──────────────────────────────────────────────────
  useEffect(() => {
    if (visible) {
      showAnnotation();
    } else {
      hideAnnotation();
    }
  }, [visible, showAnnotation, hideAnnotation]);

  // ── Trigger: inView ─────────────────────────────────────────────────────────
  useEffect(() => {
    if (isControlled || trigger !== "inView") return;
    const el = spanRef.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInternalVisible(true);
          observer.disconnect(); // Draw once, like a real marker
        }
      },
      { threshold: 0.2 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [isControlled, trigger]);

  // ── Trigger: hover ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (isControlled || trigger !== "hover") return;
    const el = spanRef.current;
    if (!el) return;

    const onEnter = () => setInternalVisible(true);
    const onLeave = () => setInternalVisible(false);

    el.addEventListener("mouseenter", onEnter);
    el.addEventListener("mouseleave", onLeave);
    return () => {
      el.removeEventListener("mouseenter", onEnter);
      el.removeEventListener("mouseleave", onLeave);
    };
  }, [isControlled, trigger]);

  // ── Label positioning ────────────────────────────────────────────────────────
  const labelStyle: Record<AnnotationSide, CSSProperties> = {
    top: {
      bottom: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginBottom: 4,
    },
    bottom: {
      top: "100%",
      left: "50%",
      transform: "translateX(-50%)",
      marginTop: 4,
    },
    left: {
      right: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginRight: 8,
    },
    right: {
      left: "100%",
      top: "50%",
      transform: "translateY(-50%)",
      marginLeft: 8,
    },
  };

  return (
    <span
      ref={spanRef}
      className={cn("relative inline-block", className)}
      style={style}
      {...props}
    >
      {children}
      {label ? (
        <span
          className="pointer-events-none absolute whitespace-nowrap text-xs font-medium"
          style={{ ...labelStyle[labelSide], color }}
        >
          {label}
        </span>
      ) : null}
    </span>
  );
}
