"use client";

/**
 * Crumble — Notebook / Sketchpad Page Template
 * A full-page writing surface with sticky notes, annotations, rough-bordered
 * text areas, a toolbar for adding notes, and a canvas-like layout.
 *
 * Registry components: StickyNote, Card, Button, Badge, Input, Textarea,
 *                      RoughHighlight, RoughLine, RoughRect, RoughCircle,
 *                      Annotation, Select
 */

import { useState, useRef } from "react";
import { StickyNote } from "@/registry/new-york/ui/sticky-note";
import { Card } from "@/registry/new-york/ui/card";
import { Button } from "@/registry/new-york/ui/button";
import { Badge } from "@/registry/new-york/ui/badge";
import { Textarea } from "@/registry/new-york/ui/textarea";
import { RoughHighlight } from "@/components/primitives/rough-highlight";
import { RoughLine } from "@/components/primitives/rough-line";
import { RoughRect } from "@/components/primitives/rough-rect";
import { Annotation } from "@/registry/new-york/ui/annotation";
import { Underline } from "lucide-react";

type NoteColor = "yellow" | "pink" | "blue" | "green" | "orange";
type NoteRotate = number;

interface Note {
  id: string;
  color: NoteColor;
  title: string;
  body: string;
  rotate: NoteRotate;
  x: number;
  y: number;
}

interface CanvasItem {
  id: string;
  type: "note" | "text-block" | "divider";
  note?: Note;
  text?: string;
  label?: string;
}

const INITIAL_NOTES: Note[] = [
  {
    id: "n1",
    color: "yellow",
    title: "Design principles",
    body: "Imperfect > perfect. Rough edges build trust. Think: handwritten letter vs typed memo.",
    rotate: -1.5,
    x: 0,
    y: 0,
  },
  {
    id: "n2",
    color: "pink",
    title: "Open questions",
    body: "Should crayon theme support custom stroke colors? What's the right roughness for ink?",
    rotate: 1.2,
    x: 0,
    y: 0,
  },
  {
    id: "n3",
    color: "blue",
    title: "Reference",
    body: "Rough.js docs: roughjs.com\nBowing controls how curved lines are.\nSeed for stable shapes.",
    rotate: -0.8,
    x: 0,
    y: 0,
  },
  {
    id: "n4",
    color: "green",
    title: "To ship next",
    body: "◎ Tooltip component\n◈ DatePicker\n◇ Combobox multi-select\n✦ Color picker update",
    rotate: 2,
    x: 0,
    y: 0,
  },
  {
    id: "n5",
    color: "orange",
    title: "Inspiration",
    body: "Sketchnotes by Mike Rohde. Bullet journaling aesthetics. Moleskine grid paper feel.",
    rotate: -1,
    x: 0,
    y: 0,
  },
];

const ANNOTATION_ITEMS = [
  { id: "ann1", text: "This section needs revision", type: "arrow" as const },
  { id: "ann2", text: "Important constraint", type: "bracket" as const },
  { id: "ann3", text: "Revisit in v1.3", type: "circle" as const },
];

const NOTE_COLORS: NoteColor[] = ["yellow", "pink", "blue", "green", "orange"];

export default function NotebookPage() {
  const [notes, setNotes] = useState<Note[]>(INITIAL_NOTES);
  const [mainText, setMainText] = useState(
    `# Crumble Design System — Working Notes\n\nThis is the main canvas for capturing design decisions, open questions, and references as we build the component library.\n\nThe goal is to make rough.js feel native — not like a novelty. Every design decision should reinforce the hand-crafted aesthetic without sacrificing usability.`,
  );
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteBody, setNewNoteBody] = useState("");
  const [newNoteColor, setNewNoteColor] = useState<NoteColor>("yellow");
  const nextId = useRef(INITIAL_NOTES.length + 1);

  const addNote = () => {
    if (!newNoteTitle.trim() && !newNoteBody.trim()) {
      setShowAddNote(false);
      return;
    }
    const note: Note = {
      id: `n${nextId.current++}`,
      color: newNoteColor,
      title: newNoteTitle || "Untitled",
      body: newNoteBody,
      rotate: (Math.random() - 0.5) * 4,
      x: 0,
      y: 0,
    };
    setNotes((prev) => [...prev, note]);
    setNewNoteTitle("");
    setNewNoteBody("");
    setNewNoteColor("yellow");
    setShowAddNote(false);
  };

  const removeNote = (id: string) => {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <main className="min-h-screen bg-background text-foreground flex flex-col">
      {/* ── Toolbar ── */}
      <header className="sticky top-0 z-40 flex items-center justify-between px-6 py-3 bg-background/90 backdrop-blur border-b border-border/20">
        <div className="flex items-center gap-3">
          <span className="font-[family-name:var(--font-display)] italic text-base">
            Notebook
          </span>
          <Badge id="notebook-badge" variant="outline" className="text-[10px]">
            Auto-saved
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <Button
            size="sm"
            variant="ghost"
            onClick={() => setShowAddNote(true)}
          >
            + Sticky note
          </Button>
          <Button size="sm" variant="ghost">
            + Text block
          </Button>
          <Button size="sm" variant="ghost">
            ⌘ Z
          </Button>
          <Button size="sm">Export PDF</Button>
        </div>
      </header>

      <div className="flex-1 flex gap-0 overflow-hidden">
        {/* ── Canvas / Main area ── */}
        <div className="flex-1 overflow-y-auto px-8 py-10">
          {/* Page title area */}
          <div className="max-w-3xl mx-auto mb-10">
            <div className="flex items-center gap-3 mb-6">
              <span className="text-3xl">📓</span>
              <h1 className="text-[28px] font-medium">
                <RoughHighlight
                  type="underline"
                  color="currentColor"
                  opacity={0.3}
                  animate
                  id="notebook-title-hl"
                >
                  Working Notes
                </RoughHighlight>
              </h1>
              <Badge
                id="notebook-date"
                variant="outline"
                className="ml-auto text-[10px]"
              >
                March 2024
              </Badge>
            </div>

            <RoughLine orientation="horizontal" id="notebook-top-div" />
          </div>

          {/* Main text area */}
          <div className="max-w-3xl mx-auto mb-12">
            <Card id="notebook-main-card" padding={32}>
              <Textarea
                id="notebook-main-text"
                value={mainText}
                onChange={(e) => setMainText(e.target.value)}
                rows={8}
                className="font-[family-name:var(--font-serif,_Georgia,_serif)] text-[16px] leading-[1.8] border-none bg-transparent focus:ring-0 resize-none w-full outline-none"
                placeholder="Start writing..."
              />
            </Card>
          </div>

          {/* Section label */}
          <div className="max-w-3xl mx-auto mb-6">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
              Sticky Notes
            </p>
          </div>

          {/* Sticky notes grid */}
          <div className="max-w-5xl mx-auto">
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
              }}
            >
              {notes.map((note) => (
                <div
                  key={note.id}
                  style={{
                    transform: `rotate(${note.rotate}deg)`,
                    transition: "transform 0.2s ease",
                  }}
                  className="hover:scale-[1.02] hover:rotate-0 transition-all duration-200"
                >
                  <StickyNote
                    id={note.id}
                    color={note.color}
                    title={note.title}
                    rotate={0}
                    className="w-full"
                  >
                    <p className="text-[13px] leading-relaxed text-muted-foreground whitespace-pre-line mt-2">
                      {note.body}
                    </p>
                    <button
                      onClick={() => removeNote(note.id)}
                      className="absolute top-2 right-2 text-muted-foreground/40 hover:text-muted-foreground transition-colors text-[12px] leading-none"
                      aria-label="Remove note"
                    >
                      ×
                    </button>
                  </StickyNote>
                </div>
              ))}

              {/* Add note card */}
              {showAddNote && (
                <div style={{ transform: "rotate(-0.5deg)" }}>
                  <Card
                    id="notebook-new-note"
                    padding={20}
                    className="flex flex-col gap-3 bg-[oklch(0.97_0.09_90)] dark:bg-[oklch(0.25_0.04_90)]"
                  >
                    {/* Color picker row */}
                    <div className="flex gap-1.5 mb-1">
                      {NOTE_COLORS.map((c) => (
                        <button
                          key={c}
                          onClick={() => setNewNoteColor(c)}
                          className={`w-4 h-4 rounded-full transition-transform ${newNoteColor === c ? "scale-125 ring-1 ring-foreground/20" : ""}`}
                          style={{
                            background: {
                              yellow: "oklch(0.91 0.12 90)",
                              pink: "oklch(0.88 0.1 340)",
                              blue: "oklch(0.88 0.08 240)",
                              green: "oklch(0.88 0.1 145)",
                              orange: "oklch(0.88 0.12 55)",
                            }[c],
                          }}
                          aria-label={c}
                        />
                      ))}
                    </div>
                    <input
                      autoFocus
                      placeholder="Title..."
                      value={newNoteTitle}
                      onChange={(e) => setNewNoteTitle(e.target.value)}
                      className="font-medium text-[13px] bg-transparent border-none outline-none placeholder:text-muted-foreground/50 w-full"
                    />
                    <textarea
                      rows={4}
                      placeholder="Write something..."
                      value={newNoteBody}
                      onChange={(e) => setNewNoteBody(e.target.value)}
                      className="text-[12px] leading-relaxed bg-transparent border-none outline-none resize-none placeholder:text-muted-foreground/50 w-full text-muted-foreground"
                    />
                    <div className="flex gap-2 pt-1 border-t border-border/20">
                      <Button size="sm" onClick={addNote}>
                        Add
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setShowAddNote(false)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </Card>
                </div>
              )}
            </div>
          </div>

          {/* Annotations section */}
          <div className="max-w-3xl mx-auto mt-14 mb-6">
            <RoughLine orientation="horizontal" id="notebook-annot-div" />
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mt-8 mb-5">
              Annotations
            </p>
            <div className="flex flex-col gap-4">
              {ANNOTATION_ITEMS.map((ann) => (
                <Annotation
                  key={ann.id}
                  id={ann.id}
                  type="underline"
                  label={ann.text}
                >
                  <Card
                    id={`ann-card-${ann.id}`}
                    padding={16}
                    className="w-full"
                  >
                    <p className="text-[13px] text-muted-foreground">
                      {ann.text}
                    </p>
                  </Card>
                </Annotation>
              ))}
            </div>
          </div>

          {/* Rough sketch area */}
          <div className="max-w-3xl mx-auto mt-14 mb-10">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-5">
              Sketch area
            </p>
            <Card
              id="notebook-sketch-area"
              padding={32}
              className="min-h-[200px] flex flex-col items-center justify-center gap-3"
            >
              <div
                className="flex gap-6 opacity-40 pointer-events-none"
                aria-hidden
              >
                <RoughRect id="sketch-rect-1" />
                <RoughRect id="sketch-rect-2" />
                <RoughRect id="sketch-rect-3" />
              </div>
              <p className="text-[12px] text-muted-foreground/50 text-center mt-2">
                Sketch area — drag primitives here in a future update
              </p>
            </Card>
          </div>
        </div>

        {/* ── Right panel — outline ── */}
        <aside className="hidden xl:flex flex-col w-56 shrink-0 border-l border-border/20 px-4 py-8 gap-5 sticky top-14 h-[calc(100vh-3.5rem)] overflow-y-auto">
          <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground">
            Contents
          </p>
          <nav className="flex flex-col gap-2">
            <a
              href="#"
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors"
            >
              Working Notes
            </a>
            <a
              href="#"
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors pl-3"
            >
              Sticky Notes ({notes.length})
            </a>
            <a
              href="#"
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors pl-3"
            >
              Annotations
            </a>
            <a
              href="#"
              className="text-[12px] text-muted-foreground hover:text-foreground transition-colors pl-3"
            >
              Sketch Area
            </a>
          </nav>

          <div className="mt-4 pt-4 border-t border-border/20">
            <p className="text-[10px] font-medium uppercase tracking-[0.14em] text-muted-foreground mb-3">
              Quick add
            </p>
            <div className="flex flex-col gap-2">
              <Button
                size="sm"
                onClick={() => setShowAddNote(true)}
                className="justify-start text-[12px]"
              >
                ✦ Sticky note
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="justify-start text-[12px]"
              >
                ◎ Text block
              </Button>
              <Button
                size="sm"
                variant="ghost"
                className="justify-start text-[12px]"
              >
                ◇ Divider
              </Button>
            </div>
          </div>

          <div className="mt-auto pt-4 border-t border-border/20">
            <p className="text-[11px] text-muted-foreground">
              {notes.length} notes · Last saved just now
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}
