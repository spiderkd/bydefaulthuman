# Full useRough Migration Plan — All 26 Components

## Legend
- **SVGs** = number of SVG elements drawn per component
- **Hook calls** = number of `useRough(...)` instances needed
- **Reseed** = component has hover/event reseed (`randomSeed()`)
- **Special** = any non-standard consideration

---

## Migration tiers


### Tier 1 — Complex (multi-SVG, chart loops, sub-components, or special drawing)
`accordion`, `notebook`, `sticky-note`, `timeline`, `bar-chart`, `line-chart`, `pie-chart`, `sparkline`, `scribble`

### Partial (already started — hook imported but raw rough still present)
`select`, `rough-highlight`

### Skip (all code commented out — migrate after uncomment)
`callout-arrow`, `drawer`

---

## Universal import swap (applies to every component)

```diff
-import rough from "roughjs";
+import { useRough } from "@/hooks/use-rough";
 import {
-  CrumbleContext,       // remove — hook reads this internally
-  getRoughOptions,      // remove — hook calls this internally
   resolveRoughVars,     // keep — used for CSS vars on wrapper div
-  stableSeed,           // keep only if you pass per-draw seed overrides
   randomSeed,           // keep only if component has reseed-on-hover
+  stableSeed,           // keep only if you pass per-draw seed overrides
   type CrumbleColorProps,
   type CrumbleTheme,
 } from "@/lib/rough";
```

Hook instantiation replaces 3 manual lines:

```diff
-  const svgRef = useRef<SVGSVGElement>(null);              // remove
-  const { theme: contextTheme } = useContext(CrumbleContext); // remove
-  const theme = themeProp ?? contextTheme;                 // remove
+  const { drawLine, drawRect, drawCircle, drawPath,
+          svgRef, theme, animateOnHover } = useRough({
+    variant: "border",          // or "interactive", "fill", "chart"
+    stableId: someId,           // replaces stableSeed(someId) in draw()
+    theme: themeProp,
+  });
```

Per-draw reseed pattern:

```diff
-  const seed = reseed ? randomSeed() : stableSeed(id);
-  rc.rectangle(..., getRoughOptions(theme, "border", { seed, ... }));
+  const extraSeed = reseed ? { seed: randomSeed() } : {};
+  const el = drawRect(..., { ...extraSeed, ... });
```

---

## Tier 1 — Simple

### 1. `separator.tsx`
- SVGs: 1 (full-width line, 2 segments when labelled)
- Hook calls: 1

```diff
+const { drawLine, svgRef, theme } = useRough({
+  variant: "border",
+  stableId: sepId,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   const svg = svgRef.current;
   if (!container || !svg) return;
   svg.replaceChildren();
   // ... setAttribute width/height/viewBox ...
-  const rc = rough.svg(svg);
-  const opts = getRoughOptions(theme, "border", {
-    seed: stableSeed(sepId),
-    stroke: "var(--cr-stroke-muted)",
-  });
   if (isH && label) {
-    svg.appendChild(rc.line(2, 10, mid - labelW / 2 - gap, 10, opts));
-    svg.appendChild(rc.line(mid + labelW / 2 + gap, 10, w - 2, 10, opts));
+    const l1 = drawLine(2, 10, mid - labelW / 2 - gap, 10, { stroke: "var(--cr-stroke-muted)" });
+    const l2 = drawLine(mid + labelW / 2 + gap, 10, w - 2, 10, { stroke: "var(--cr-stroke-muted)" });
+    if (l1) svg.appendChild(l1);
+    if (l2) svg.appendChild(l2);
   } else if (isH) {
-    svg.appendChild(rc.line(2, 10, w - 2, 10, opts));
+    const l = drawLine(2, 10, w - 2, 10, { stroke: "var(--cr-stroke-muted)" });
+    if (l) svg.appendChild(l);
   } else {
-    svg.appendChild(rc.line(10, 2, 10, h - 2, opts));
+    const l = drawLine(10, 2, 10, h - 2, { stroke: "var(--cr-stroke-muted)" });
+    if (l) svg.appendChild(l);
   }
-}, [label, orientation, sepId, theme]);
+}, [drawLine, label, orientation, svgRef]);
```

---

### 2. `tooltip.tsx`
- SVGs: 1 (rect + arrow path)
- Hook calls: 1
- Note: uses `drawPath` for the arrow triangle

```diff
+const { drawRect, drawPath, svgRef, theme } = useRough({
+  variant: "border",
+  stableId: tooltipId,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  const opts = getRoughOptions(theme, "border", { fill: "var(--popover)", fillStyle: "solid", seed: stableSeed(tooltipId), stroke: "var(--cr-stroke)" });
-  svg.appendChild(rc.rectangle(bx + 1, by + 1, w - 2, h - 2, opts));
+  const box = drawRect(bx + 1, by + 1, w - 2, h - 2, {
+    fill: "var(--popover)", fillStyle: "solid", stroke: "var(--cr-stroke)"
+  });
+  if (box) svg.appendChild(box);

   // arrowPath string built same as before...
-  svg.appendChild(rc.path(arrowPath, arrowOpts));
+  const arrow = drawPath(arrowPath, {
+    roughness: 0.8, stroke: "var(--cr-stroke)", fill: "var(--popover)", fillStyle: "solid"
+  });
+  if (arrow) svg.appendChild(arrow);
-}, [side, theme, tooltipId]);
+}, [drawRect, drawPath, side, svgRef]);
```

---

### 3. `avatar.tsx` (AvatarCircle)
- SVGs: 1 (circle, fixed size)
- Hook calls: 1, reseed on hover

```diff
+const { drawCircle, svgRef, animateOnHover: ctxAnimateOnHover } = useRough({
+  variant: "border",
+  stableId: stableId,
+  theme: themeProp,
+});

 const draw = useCallback((reseed = false) => {
   const svg = svgRef.current;
   if (!svg) return;
   svg.replaceChildren();
   // ... setAttribute ...
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.circle(size / 2, size / 2, size - 3, getRoughOptions(theme, "border", {
-    fill: "none",
-    seed: reseed ? randomSeed() : stableSeed(stableId),
-    stroke: "var(--cr-stroke)",
-  })));
+  const extraSeed = reseed ? { seed: randomSeed() } : {};
+  const el = drawCircle(size / 2, size / 2, size - 3, { fill: "none", stroke: "var(--cr-stroke)", ...extraSeed });
+  if (el) svg.appendChild(el);
 }, [drawCircle, reseed, size, svgRef]);
```

---

### 4. `badge.tsx`
- SVGs: 1 (dynamic-size rect)
- Hook calls: 1, reseed on hover

```diff
+const { drawRect, svgRef, animateOnHover } = useRough({
+  variant: "border",
+  stableId: stableId,
+  theme: themeProp,
+});

 const draw = useCallback((reseed = false) => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.rectangle(1, 1, w - 2, h - 2, getRoughOptions(theme, "border", {
-    fill: "none",
-    seed: reseed ? randomSeed() : stableSeed(stableId),
-    stroke: variantStroke[variant],
-  })));
+  const extraSeed = reseed ? { seed: randomSeed() } : {};
+  const el = drawRect(1, 1, w - 2, h - 2, { fill: "none", stroke: variantStroke[variant], ...extraSeed });
+  if (el) svg.appendChild(el);
 }, [drawRect, stableId, svgRef, variant]);
```

---

### 5. `table.tsx` (TableRow)
- SVGs: 1 (single line separator per row)
- Hook calls: 1 inside `TableRow`

```diff
// Inside TableRow:
+const { drawLine, svgRef } = useRough({
+  variant: "border",
+  stableId: `table-row-${index}`,
+  theme,   // from TableContext
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.line(0, 3, w, 3, getRoughOptions(theme, "border", {
-    seed: stableSeed(`table-row-${index}`),
-    stroke: "var(--cr-stroke-muted)",
-    strokeWidth: theme === "crayon" ? 1.5 : 0.8,
-  })));
+  const el = drawLine(0, 3, w, 3, {
+    stroke: "var(--cr-stroke-muted)",
+    strokeWidth: theme === "crayon" ? 1.5 : 0.8,
+  });
+  if (el) svg.appendChild(el);
 }, [drawLine, index, svgRef]);
```

---

### 6. `otp-input.tsx` (OtpCell)
- SVGs: 1 (rect, fixed 44×44 size)
- Hook calls: 1 inside `OtpCell`
- Note: variant switches between "border" and "interactive" based on `focused`

Since the variant changes at runtime, pass `"interactive"` as default and override when not focused:

```diff
+const { drawRect, svgRef } = useRough({
+  variant: focused ? "interactive" : "border",
+  stableId: cellId,
+  theme,
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.rectangle(1, 1, SIZE - 2, SIZE - 2, getRoughOptions(theme, focused ? "interactive" : "border", {
-    fill: "none", seed: stableSeed(cellId), stroke,
-  })));
+  const el = drawRect(1, 1, SIZE - 2, SIZE - 2, { fill: "none", stroke });
+  if (el) svg.appendChild(el);
 }, [drawRect, disabled, focused, hasValue, svgRef]);
```

> `useRough` is re-instantiated when `focused` changes because `variant` is in the hook args — this is fine since React will call the hook with the new value on each render.

---

### 7. `file-upload.tsx`
- SVGs: 1 (dashed rect border)
- Hook calls: 1
- Note: passes `strokeLineDash` which is a raw roughjs option — just forward it as extra opts

```diff
+const { drawRect, svgRef, theme } = useRough({
+  variant: "border",
+  stableId: uploadId,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
   const roughness = dragging ? 2.5 : theme === "crayon" ? 2 : 1;
   const strokeColor = dragging ? "var(--cr-stroke)" : "var(--cr-stroke-muted)";
-  svg.appendChild(rc.rectangle(2, 2, w - 4, h - 4, {
-    ...getRoughOptions(theme, "border", { fill: "none", seed: stableSeed(uploadId), stroke: strokeColor }),
-    roughness,
-    strokeLineDash: [8, 6],
-  }));
+  const el = drawRect(2, 2, w - 4, h - 4, {
+    fill: "none",
+    stroke: strokeColor,
+    roughness,
+    strokeLineDash: [8, 6],
+  });
+  if (el) svg.appendChild(el);
 }, [disabled, dragging, drawRect, svgRef, theme]);
```

---

## Tier 2 — Medium

### 8. `checkbox.tsx` *(already in previous plan)*
See previous migration plan document.

---

### 9. `radio.tsx` *(already in previous plan)*
See previous migration plan document.

---

### 10. `toggle.tsx` *(already in previous plan)*
See previous migration plan document.

---

### 11. `slider.tsx` *(already in previous plan)*
See previous migration plan document.

---

### 12. `tabs.tsx` (TabsTrigger)
- SVGs: 1 per trigger (underline line, only when active)
- Hook calls: 1 inside `TabsTrigger`, reseed on hover when active

```diff
+const { drawLine, svgRef, animateOnHover } = useRough({
+  variant: "border",
+  stableId: `tab-trigger-${value}`,
+  theme,   // from TabsContext
+});

 const draw = useCallback((reseed = false) => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
   if (active) {
-    svg.appendChild(rc.line(2, h - 1, w - 2, h - 1, getRoughOptions(theme, "border", {
-      seed: reseed ? randomSeed() : stableSeed(`tab-trigger-${value}`),
-      stroke: "currentColor",
-      strokeWidth: theme === "crayon" ? 3 : theme === "ink" ? 2 : 1.5,
-    })));
+    const extraSeed = reseed ? { seed: randomSeed() } : {};
+    const el = drawLine(2, h - 1, w - 2, h - 1, {
+      stroke: "currentColor",
+      strokeWidth: theme === "crayon" ? 3 : theme === "ink" ? 2 : 1.5,
+      ...extraSeed,
+    });
+    if (el) svg.appendChild(el);
   }
 }, [active, drawLine, svgRef, theme, value]);
```

---

### 13. `dialog.tsx` (DialogContent)
- SVGs: 1 (rect border, uses `randomSeed()` every open — intentional fresh wobble)
- Hook calls: 1
- Note: deliberately uses `randomSeed()` (not stableId) for fresh border each open

Since there's no `stableId` here and every draw intentionally uses a fresh seed:

```diff
+const { drawRect, svgRef } = useRough({
+  variant: "border",
+  theme,   // from DialogContext
+  // no stableId — every draw call will use randomSeed() as override
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.rectangle(1, 1, w - 2, h - 2, getRoughOptions(theme, "border", {
-    fill: "none",
-    seed: randomSeed(),
-    stroke: "var(--cr-stroke)",
-    strokeWidth: theme === "crayon" ? 2.5 : theme === "ink" ? 1.5 : 1,
-  })));
+  const el = drawRect(1, 1, w - 2, h - 2, {
+    fill: "none",
+    seed: randomSeed(),  // always fresh — keeps the extra randomSeed import
+    stroke: "var(--cr-stroke)",
+    strokeWidth: theme === "crayon" ? 2.5 : theme === "ink" ? 1.5 : 1,
+  });
+  if (el) svg.appendChild(el);
 }, [drawRect, svgRef, theme]);
```

---

### 14. `progress.tsx`
- SVGs: 1 (2 shapes: track rect + fill rect)
- Hook calls: 1
- Note: two different seeds → pass as overrides; two different variants ("border" for track, "fill" for bar)

Since the two shapes use different variants, use `"fill"` as the hook variant (the fill bar) and pass `"border"` options inline for the track:

```diff
+const { drawRect, svgRef, theme } = useRough({
+  variant: "fill",
+  stableId: progressId,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
   // Track
-  svg.appendChild(rc.rectangle(1, 1, w - 2, TRACK_H - 2, getRoughOptions(theme, "border", {
-    fill: "none", seed: stableSeed(`${progressId}-track`), stroke: "var(--cr-stroke-muted)",
-  })));
+  const track = drawRect(1, 1, w - 2, TRACK_H - 2, {
+    seed: stableSeed(`${progressId}-track`),   // override seed for track shape
+    fill: "none",
+    stroke: "var(--cr-stroke-muted)",
+    // pass roughness/strokeWidth from "border" preset manually if needed
+  });
+  if (track) svg.appendChild(track);
   // Fill bar
   if (pct > 0) {
-    svg.appendChild(rc.rectangle(2, 2, fillW, TRACK_H - 4, getRoughOptions(theme, "fill", {
-      fill: "currentColor", fillStyle: theme === "ink" ? "solid" : "hachure",
-      seed: stableSeed(`${progressId}-fill`), stroke: "none",
-    })));
+    const bar = drawRect(2, 2, fillW, TRACK_H - 4, {
+      // no seed override — stableId drives `${progressId}` seed for fill bar
+      fill: "currentColor",
+      fillStyle: theme === "ink" ? "solid" : "hachure",
+      stroke: "none",
+    });
+    if (bar) svg.appendChild(bar);
   }
 }, [drawRect, pct, progressId, svgRef]);
```

> **Alternatively** use two `useRough` calls (one per variant) and a shared `svgRef` — cleaner if the per-shape option differences feel awkward.

---

### 15. `stat-card.tsx`
- SVGs: 2 (`svgRef` = card border; `trendSvgRef` = 2-line trend arrow)
- Hook calls: 2

```diff
+const { drawRect, svgRef, animateOnHover } = useRough({
+  variant: "border",
+  stableId: cardId,
+  theme: themeProp,
+});
+const { drawLine: drawTrendLine } = useRough({
+  variant: "border",
+  stableId: `${cardId}-trend`,
+  svgRef: trendSvgRef,
+  theme: themeProp,
+});

 // draw() — card border
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.rectangle(1, 1, w - 2, h - 2, getRoughOptions(theme, "border", {
-    fill: "none", seed: reseed ? randomSeed() : stableSeed(cardId), stroke: "var(--cr-stroke-muted)",
-  })));
+  const extraSeed = reseed ? { seed: randomSeed() } : {};
+  const el = drawRect(1, 1, w - 2, h - 2, { fill: "none", stroke: "var(--cr-stroke-muted)", ...extraSeed });
+  if (el) svg.appendChild(el);

 // drawTrend()
-  const rc2 = rough.svg(svg2);
   if (trend === "up") {
-    svg2.appendChild(rc2.line(3, 12, 8, 4,  opts));
-    svg2.appendChild(rc2.line(8, 4,  13, 12, { ...opts, seed: stableSeed(`${cardId}-trend-r`) }));
+    const l1 = drawTrendLine(3, 12, 8, 4, { stroke: color, strokeWidth: theme === "crayon" ? 2 : 1.3 });
+    const l2 = drawTrendLine(8, 4, 13, 12, { seed: stableSeed(`${cardId}-trend-r`), stroke: color, strokeWidth: theme === "crayon" ? 2 : 1.3 });
+    if (l1) trendSvgRef.current?.appendChild(l1);
+    if (l2) trendSvgRef.current?.appendChild(l2);
   } else { /* same pattern for "down" */ }
```

---

### 16. `color-picker.tsx` (Swatch)
- SVGs: 1 per swatch (circle, only drawn when selected or hovered)
- Hook calls: 1 inside `Swatch`
- Note: variant switches between "interactive" (selected) and "border" (hover)

```diff
+const { drawCircle, svgRef } = useRough({
+  variant: isSelected ? "interactive" : "border",
+  stableId: swatchId,
+  theme,
+});

 const draw = useCallback((hover = false) => {
   const svg = svgRef.current;
   if (!svg) return;
   svg.replaceChildren();
   // ... setAttribute ...
   if (!isSelected && !hover) return;
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.circle(SIZE / 2, SIZE / 2, SIZE - 3, getRoughOptions(theme, isSelected ? "interactive" : "border", {
-    fill: "none", seed: stableSeed(swatchId),
-    stroke: color === "#ffffff" ? "#d1d5db" : color,
-    strokeWidth: isSelected ? 2 : 1,
-  })));
+  const el = drawCircle(SIZE / 2, SIZE / 2, SIZE - 3, {
+    fill: "none",
+    stroke: color === "#ffffff" ? "#d1d5db" : color,
+    strokeWidth: isSelected ? 2 : 1,
+  });
+  if (el) svg.appendChild(el);
 }, [color, drawCircle, isSelected, svgRef]);
```

`ColorPicker`'s hex input box (`drawInput`) uses a second `useRough` call:

```diff
+const { drawRect: drawInputRect, svgRef: inputSvgRef } = useRough({
+  variant: "border",
+  stableId: `${pickerId}-input`,
+  theme: themeProp,
+});

 const drawInput = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  svg.appendChild(rc.rectangle(1, 1, w - 2, H - 2, getRoughOptions(theme, "border", {
-    fill: "none", seed: stableSeed(`${pickerId}-input`), stroke: "var(--cr-stroke-muted)",
-  })));
+  const el = drawInputRect(1, 1, w - 2, H - 2, { fill: "none", stroke: "var(--cr-stroke-muted)" });
+  if (el) svg.appendChild(el);
 }, [drawInputRect, pickerId, inputSvgRef]);
```

---

### 17. `number-input.tsx` (StepButton)
- SVGs: 1 per button (3 lines for border edges + symbol lines)
- Hook calls: 1 inside `StepButton`
- Note: draws individual edge lines, not a rectangle

```diff
+const { drawLine, svgRef } = useRough({
+  variant: "interactive",
+  stableId: btnId,
+  theme,
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  const opts = getRoughOptions(theme, "interactive", { fill: "none", seed: stableSeed(btnId), stroke: ... });
   if (side === "left") {
-    svg.appendChild(rc.line(1, 1, 1, HEIGHT - 1, opts));
-    svg.appendChild(rc.line(1, 1, BTN_W, 1, opts));
-    svg.appendChild(rc.line(1, HEIGHT - 1, BTN_W, HEIGHT - 1, opts));
+    const l1 = drawLine(1, 1, 1, HEIGHT - 1, { fill: "none", stroke });
+    const l2 = drawLine(1, 1, BTN_W, 1, { fill: "none", stroke });
+    const l3 = drawLine(1, HEIGHT - 1, BTN_W, HEIGHT - 1, { fill: "none", stroke });
+    [l1, l2, l3].forEach(l => l && svg.appendChild(l));
   } else { /* same for right */ }
   // symbol lines
-  svg.appendChild(rc.line(cx - 5, cy, cx + 5, cy, symOpts));
-  if (label === "+") svg.appendChild(rc.line(cx, cy - 5, cx, cy + 5, symOpts));
+  const h = drawLine(cx - 5, cy, cx + 5, cy, { strokeWidth: ... });
+  if (h) svg.appendChild(h);
+  if (label === "+") {
+    const v = drawLine(cx, cy - 5, cx, cy + 5, { strokeWidth: ... });
+    if (v) svg.appendChild(v);
+  }
 }, [btnId, disabled, drawLine, label, side, svgRef, theme]);
```

`NumberInput`'s main input border (`drawBorder`) uses a separate `useRough`:

```diff
+const { drawLine: drawBorderLine, svgRef } = useRough({
+  variant: "border",
+  stableId: inputId,
+  theme: themeProp,
+});
```

---

### 18. `rating.tsx` (Star)
- SVGs: 1 per star (path shape)
- Hook calls: 1 inside `Star`, reseed on hover

```diff
+const { drawPath, svgRef } = useRough({
+  variant: "interactive",
+  stableId: `${ratingId}-star-${index}`,
+  theme,
+});

 const draw = useCallback((reseed = false) => {
   const svg = svgRef.current;
   if (!svg) return;
   svg.replaceChildren();
   // ... setAttribute ...
-  const rc = rough.svg(svg);
   const filled = active || hovered;
-  svg.appendChild(rc.path(path, getRoughOptions(theme, "interactive", {
-    fill: filled ? "currentColor" : "none",
-    fillStyle: theme === "ink" ? "solid" : "hachure",
-    seed: reseed ? randomSeed() : stableSeed(`${ratingId}-star-${index}`),
-    stroke: filled ? "currentColor" : "var(--cr-stroke-muted)",
-  })));
+  const extraSeed = reseed ? { seed: randomSeed() } : {};
+  const el = drawPath(path, {
+    fill: filled ? "currentColor" : "none",
+    fillStyle: theme === "ink" ? "solid" : "hachure",
+    stroke: filled ? "currentColor" : "var(--cr-stroke-muted)",
+    ...extraSeed,
+  });
+  if (el) svg.appendChild(el);
 }, [active, drawPath, hovered, path, svgRef]);
```

---

### 19. `combobox.tsx`
- SVGs: 3 types — trigger rect, dropdown rect, option highlight rects (dynamic)
- Hook calls: 3

```diff
// Trigger border
+const { drawRect: drawTriggerRect, svgRef, theme } = useRough({
+  variant: "border",
+  stableId: comboId,
+  theme: themeProp,
+});

// Dropdown border (separate SVG rendered conditionally)
+const dropdownRef = useRef<SVGSVGElement>(null);
+const { drawRect: drawDropdownRect } = useRough({
+  variant: "border",
+  stableId: `${comboId}-dropdown`,
+  svgRef: dropdownSvgRef,
+  theme: themeProp,
+});

// Option highlight (same SVG ref per option, reused)
// Options are dynamic — keep using the manual rc approach here OR
// create a helper that calls getRoughOptions directly (acceptable exception
// since useRough can't be called in a loop)
```

> **Note on option highlights:** Since `drawOption` is called with a dynamically-passed `svg` element (not a fixed ref), it can't be driven by `useRough` directly. The cleanest approach is to keep a small local helper using `getRoughOptions` for just the option highlights, or extract `RoughOptionHighlight` as its own sub-component with its own hook call. The trigger and dropdown borders migrate normally.

---

## Tier 3 — Complex

### 20. `accordion.tsx` *(already in previous plan)*
See previous migration plan document.

---

### 21. `notebook.tsx`
- SVGs: 2 (`borderSvgRef` = outer rect; `linesCanvasRef` = many ruled lines + margin line)
- Hook calls: 2

```diff
+const { drawRect: drawBorder, svgRef: borderSvgRef } = useRough({
+  variant: "border",
+  stableId: notebookId,
+  svgRef: borderSvgRef,     // pass external ref
+  theme: themeProp,
+});
+const { drawLine: drawRuledLine } = useRough({
+  variant: "border",
+  svgRef: linesCanvasRef,
+  theme: themeProp,
+  // no stableId — each line passes its own seed as override
+});

 const draw = useCallback(() => {
   // Border
-  const rcBorder = rough.svg(borderSvg);
-  borderSvg.appendChild(rcBorder.rectangle(1, 1, w - 2, h - 2, getRoughOptions(theme, "border", { ... })));
+  const bel = drawBorder(1, 1, w - 2, h - 2, { fill: "none", stroke: "var(--cr-stroke-muted)", strokeWidth: theme === "crayon" ? 2 : 1 });
+  if (bel) borderSvg.appendChild(bel);

   // Ruled lines
-  const rcLines = rough.svg(linesSvg);
   for (let y = startY; y < h - 8; y += lineSpacing) {
-    linesSvg.appendChild(rcLines.line(8, y, w - 8, y, { ...lineOpts, seed: stableSeed(`${notebookId}-line-${Math.round(y)}`) }));
+    const l = drawRuledLine(8, y, w - 8, y, {
+      seed: stableSeed(`${notebookId}-line-${Math.round(y)}`),
+      roughness: theme === "pencil" ? 0.3 : theme === "ink" ? 0.1 : 0.5,
+      stroke: lc,
+      strokeWidth: 0.6,
+    });
+    if (l) linesSvg.appendChild(l);
   }
   // Margin line same pattern
 }, [drawBorder, drawRuledLine, ...]);
```

---

### 22. `sticky-note.tsx`
- SVGs: 2 (`svgRef` = main rect border; `foldSvgRef` = polygon + line fold)
- Hook calls: 2
- Note: uses `rc.polygon()` for fold — `useRough` doesn't expose `drawPolygon`. Use `getOptions()` + manual `rc.polygon()` call, or add `drawPolygon` to the hook.

```diff
+const { drawRect, svgRef, getOptions, rc } = useRough({
+  variant: "border",
+  stableId: noteId,
+  svgRef: svgRef,
+  theme: themeProp,
+});
+const { drawLine: drawFoldLine, getOptions: getFoldOptions, rc: foldRc } = useRough({
+  variant: "fill",
+  stableId: `${noteId}-fold`,
+  svgRef: foldSvgRef,
+  theme: themeProp,
+});

 const draw = useCallback((reseed = false) => {
   // Main border
   const extraSeed = reseed ? { seed: randomSeed() } : {};
-  svg.appendChild(rc.rectangle(1, 1, w - 2, h - 2, getRoughOptions(theme, "border", { fill: bg, fillStyle: "solid", ... })));
+  const el = drawRect(1, 1, w - 2, h - 2, { fill: bg, fillStyle: "solid", stroke: borderColor, ...extraSeed });
+  if (el) svg.appendChild(el);

   // Fold polygon — use rc ref directly since drawPolygon isn't on the hook
+  const rcInst = rc.current;
+  if (rcInst) {
+    foldSvg.appendChild(rcInst.polygon([[2, foldSize], [foldSize, 2], [foldSize, foldSize]], getFoldOptions({ fill: "oklch(0.88 0.08 90 / 60%)", fillStyle: "solid", stroke: borderColor })));
+  }
   // Fold line
-  foldSvg.appendChild(foldRc.line(2, foldSize, foldSize, 2, getRoughOptions(theme, "border", { seed: stableSeed(`${noteId}-fold-line`), ... })));
+  const fl = drawFoldLine(2, foldSize, foldSize, 2, { seed: stableSeed(`${noteId}-fold-line`), stroke: borderColor });
+  if (fl) foldSvg.appendChild(fl);
 }, [drawRect, drawFoldLine, getFoldOptions, rc, svgRef, foldSvgRef, ...]);
```

> `rc` (the raw renderer ref) is returned from `useRough` for exactly this case — shapes like `polygon` that aren't wrapped yet. Use `rc.current?.polygon(...)` with `getOptions(extra)` for these.

---

### 23. `timeline.tsx` (TimelineItem)
- SVGs: 2 per item (`nodeSvgRef` = circle(s); `lineSvgRef` = connector line)
- Hook calls: 2

```diff
+const { drawCircle: drawNodeCircle, drawLine: drawNodeLine, svgRef: nodeSvgRef } = useRough({
+  variant: "interactive",
+  stableId: itemId,
+  theme,
+});
+const { drawLine: drawConnectorLine, svgRef: lineSvgRef } = useRough({
+  variant: "border",
+  stableId: `${itemId}-line`,
+  svgRef: lineSvgRef,
+  theme,
+});

 const drawNode = useCallback(() => {
   // ... svg setup ...
   const stroke = status === "pending" ? "var(--cr-stroke-muted)" : "var(--cr-stroke)";
   if (status === "complete") {
-    svg.appendChild(rc.circle(cx, cy, NODE_SIZE - 4, { ...baseOpts, fill: "currentColor", fillStyle: ..., fillWeight: 0.8 }));
-    svg.appendChild(rc.line(5, cy + 1, cx - 1, NODE_SIZE - 4, tickOpts));
-    svg.appendChild(rc.line(cx - 1, NODE_SIZE - 4, NODE_SIZE - 4, 4, { ...tickOpts, seed: stableSeed(`${itemId}-tick`) }));
+    const circle = drawNodeCircle(cx, cy, NODE_SIZE - 4, { fill: "currentColor", fillStyle: theme === "ink" ? "solid" : "hachure", fillWeight: 0.8, stroke });
+    const t1 = drawNodeLine(5, cy + 1, cx - 1, NODE_SIZE - 4, { stroke: "hsl(var(--background))", strokeWidth: 1.5 });
+    const t2 = drawNodeLine(cx - 1, NODE_SIZE - 4, NODE_SIZE - 4, 4, { seed: stableSeed(`${itemId}-tick`), stroke: "hsl(var(--background))", strokeWidth: 1.5 });
+    [circle, t1, t2].forEach(el => el && svg.appendChild(el));
   } else if (status === "active") { /* drawNodeCircle twice */ }
   else { /* drawNodeCircle once, fill: none */ }
 }, [drawNodeCircle, drawNodeLine, itemId, nodeSvgRef, status, theme]);

 const drawLine = useCallback(() => {
   // ... svg setup ...
-  svg.appendChild(rc.line(LINE_X, 0, LINE_X, h, getRoughOptions(theme, "border", { seed: stableSeed(`${itemId}-line`), stroke: ..., strokeWidth: 1 })));
+  const el = drawConnectorLine(LINE_X, 0, LINE_X, h, { stroke: "var(--cr-stroke-muted)", strokeWidth: 1 });
+  if (el) svg.appendChild(el);
 }, [drawConnectorLine, isLast, itemId, lineSvgRef, status, theme]);
```

---

### 24. `bar-chart.tsx`
- SVGs: 1 (full canvas — many shapes drawn in loops)
- Hook calls: 1
- Note: chart loops use per-bar seeds passed as overrides; `drawRect` used for bars and grid lines use `drawLine`

```diff
+const { drawLine, drawRect, svgRef, theme } = useRough({
+  variant: "chart",
+  stableId: chartId,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   // ... svg setup ...
-  const rc = rough.svg(svg);
-  const baseOpts = getRoughOptions(theme, "chart", {});
-  const borderOpts = getRoughOptions(theme, "border", { stroke: "var(--cr-stroke-muted)", strokeWidth: ... });

   // Grid lines
   for (let i = 0; i <= GRID_LINES; i++) {
-    svg.appendChild(rc.line(PAD.left, y, PAD.left + plotW, y, { ...borderOpts, seed: stableSeed(`${chartId}-grid-${i}`) }));
+    const gl = drawLine(PAD.left, y, PAD.left + plotW, y, {
+      seed: stableSeed(`${chartId}-grid-${i}`),
+      stroke: "var(--cr-stroke-muted)",
+      strokeWidth: theme === "crayon" ? 1.5 : 0.8,
+    });
+    if (gl) svg.appendChild(gl);
   }
   // Axes — same pattern
   // Bars
   data.forEach((d, i) => {
-    const barNode = rc.rectangle(x, y, barW, barH, { ...baseOpts, fill: d.color ?? "currentColor", fillStyle: ..., seed: stableSeed(`${chartId}-bar-${i}`), ... });
+    const barNode = drawRect(x, y, barW, barH, {
+      seed: stableSeed(`${chartId}-bar-${i}`),
+      fill: d.color ?? "currentColor",
+      fillStyle: theme === "ink" ? "solid" : "hachure",
+      fillWeight: theme === "pencil" ? 0.8 : 1.2,
+      hachureGap: theme === "crayon" ? 4 : 6,
+      stroke: d.color ?? "currentColor",
+      strokeWidth: theme === "crayon" ? 2 : theme === "ink" ? 1.5 : 1,
+    });
     // ... clipPath animation unchanged ...
+    if (barNode) svg.appendChild(barNode);
   });
 }, [drawLine, drawRect, animateOnMount, axisLabel, chartId, data, formatValue, height, showGrid, showValues, svgRef]);
```

---

### 25. `line-chart.tsx`
- SVGs: 1 (grid lines, axes, path lines, dots)
- Hook calls: 1
- Note: `drawPath` used for series lines; `drawCircle` for dots; seed overrides per loop iteration

```diff
+const { drawLine, drawPath, drawCircle, svgRef, theme } = useRough({
+  variant: "chart",
+  stableId: chartId,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   // Grid, axes — replace rc.line calls with drawLine + seed overrides
   // Series lines
   series.forEach((s, si) => {
-    const lineNode = rc.path(pathD, getRoughOptions(theme, "chart", { fill: "none", seed: stableSeed(`${chartId}-line-${si}`), stroke: color, strokeWidth: ... }));
+    const lineNode = drawPath(pathD, {
+      seed: stableSeed(`${chartId}-line-${si}`),
+      fill: "none",
+      stroke: color,
+      strokeWidth: theme === "crayon" ? 2.5 : theme === "ink" ? 2 : 1.5,
+    });
     // animation unchanged
+    if (lineNode) svg.appendChild(lineNode);
     // Dots
     if (showDots) {
       pts.forEach((pt, i) => {
-        svg.appendChild(rc.circle(pt[0], pt[1], 7, getRoughOptions(theme, "interactive", { fill: color, fillStyle: "solid", seed: stableSeed(`${chartId}-dot-${si}-${i}`), stroke: color, ... })));
+        const dot = drawCircle(pt[0], pt[1], 7, {
+          seed: stableSeed(`${chartId}-dot-${si}-${i}`),
+          fill: color, fillStyle: "solid", stroke: color, strokeWidth: 0.5
+        });
+        if (dot) svg.appendChild(dot);
       });
     }
   });
 }, [drawLine, drawPath, drawCircle, ...]);
```

---

### 26. `pie-chart.tsx`
- SVGs: 1 (d3-computed arc paths drawn with `rc.path`)
- Hook calls: 1
- Note: uses `drawPath` for each pie slice; d3 computes the path string

```diff
+const { drawPath, svgRef, theme } = useRough({
+  variant: "fill",
+  stableId: chartId,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   // ...
-  const rc = rough.svg(svg);
   arcs.forEach((arcDatum, i) => {
     const pathD = arcGen(arcDatum);
     if (!pathD) return;
-    const sliceNode = rc.path(pathD, getRoughOptions(theme, "fill", {
-      fill: color, fillStyle: ..., fillWeight: ..., hachureAngle: -41 + i * 15, hachureGap: ...,
-      seed: stableSeed(`${chartId}-slice-${i}`), stroke: color, strokeWidth: ...,
-    }));
+    const sliceNode = drawPath(pathD, {
+      seed: stableSeed(`${chartId}-slice-${i}`),
+      fill: color,
+      fillStyle: theme === "ink" ? "solid" : "hachure",
+      fillWeight: theme === "pencil" ? 0.9 : 1.2,
+      hachureAngle: -41 + i * 15,
+      hachureGap: theme === "crayon" ? 4 : 6,
+      stroke: color,
+      strokeWidth: theme === "crayon" ? 2 : theme === "ink" ? 1.5 : 1,
+    });
     // animation, hitPath unchanged
+    if (sliceNode) group.appendChild(sliceNode);
   });
 }, [drawPath, animateOnMount, chartId, data, donut, formatValue, height, hoveredIndex, showLabels, showLegend, svgRef, total]);
```

---

### 27. `sparkline.tsx`
- SVGs: 1 (path for line/area, rects for bars, circle for end dot)
- Hook calls: 1

```diff
+const { drawPath, drawRect, drawCircle, svgRef, theme } = useRough({
+  variant: "chart",
+  stableId: sparkId,
+  theme: themeProp,
+});

 // Bar type: replace rc.rectangle with drawRect + seed override per bar
 // Line/area: replace rc.path with drawPath
 // End dot: replace rc.circle with drawCircle
```

---

### 28. `scribble.tsx`
- SVGs: 1 (uses `rc.polygon`, `rc.line`, `rc.ellipse` — types not all on hook)
- Hook calls: 1
- Note: uses `rc.polygon` and `rc.ellipse` which aren't wrapped in the hook. Use `rc.current` + `getOptions()`.

```diff
+const { svgRef, getOptions, rc, theme } = useRough({
+  variant: "border",
+  stableId: `scribble-${type}`,
+  theme: themeProp,
+});

 const draw = useCallback(() => {
   // ...
-  const rc = rough.svg(svg);
-  const baseOpts = getRoughOptions(theme, "border", { seed, stroke: color, strokeWidth: strokeW });
+  const rcInst = rc.current;
+  if (!rcInst) return;
   switch (type) {
     case "redact": {
-      const node1 = rc.polygon(pts1, { ...baseOpts, fill: color, fillStyle: "solid", ... });
+      const node1 = rcInst.polygon(pts1, getOptions({ fill: color, fillStyle: "solid", roughness: 2, stroke: color, strokeWidth: strokeW * 0.5 }));
       // ... same for node2, scrawl lines, ellipse, blob polygon
     }
   }
 }, [getOptions, rc, color, jitter, opacity, padding, seed, strokeW, svgRef, theme, type]);
```

---

## Partial migrations (complete these)

### `select.tsx`
Already imports `useRough` and uses it for the trigger and chevron. Two raw `rough.svg()` calls remain — the dropdown border and the option hover highlight.

```
Lines 142–150: drawDropdown — replace with useRough call on dropdownSvgRef
Lines 166–175: drawOption   — same issue as combobox; dynamic svg arg.
                               Either extract OptionHighlight sub-component or keep manual rc for options.
```

### `rough-highlight.tsx`
Already imports `useRough` for theme/animateOnMount. One raw `rough.svg()` call remains at line 93.

```
Line 93: const rc = rough.svg(svg);
→ Add svgRef + drawPath to the existing useRough call, remove manual rough.svg
```

---

## registry.json — all changes needed

After completing all migrations, add `"http://localhost:3000/r/use-rough.json"` to `registryDependencies` for:

| Component | Current state |
|---|---|
| `checkbox` | missing (bug, already fixed) |
| `radio` | missing |
| `toggle` | missing |
| `slider` | missing |
| `accordion` | missing |
| `separator` | missing |
| `tooltip` | missing |
| `avatar` | missing |
| `badge` | missing |
| `table` | missing |
| `otp-input` | missing |
| `file-upload` | missing |
| `tabs` | missing (bug, already fixed) |
| `dialog` | missing |
| `progress` | missing |
| `stat-card` | missing |
| `color-picker` | missing |
| `number-input` | missing |
| `rating` | missing |
| `combobox` | missing |
| `notebook` | missing |
| `sticky-note` | missing |
| `timeline` | missing |
| `bar-chart` | missing |
| `line-chart` | missing |
| `pie-chart` | missing |
| `sparkline` | missing |
| `scribble` | missing |

---

## Recommended migration order

**Week 1 — Tier 1 (quick wins, validate the pattern)**
`separator` → `tooltip` → `avatar` → `badge` → `table` → `otp-input` → `file-upload`

**Week 2 — Tier 2 (interactive components)**
`checkbox` → `radio` → `toggle` → `slider` → `tabs` → `dialog` → `progress` → `stat-card`

**Week 2 cont — Tier 2 with sub-components**
`color-picker` → `number-input` → `rating` → `combobox`

**Week 3 — Partial fixes**
`select` (finish) → `rough-highlight` (finish)

**Week 3 cont — Tier 3 (complex)**
`accordion` → `notebook` → `sticky-note` → `timeline`

**Week 4 — Charts (all use same drawPath/drawLine/drawRect/drawCircle pattern)**
`bar-chart` → `line-chart` → `pie-chart` → `sparkline` → `scribble`

**After code complete**
Bulk-update `registry.json` for all 28 affected entries.
