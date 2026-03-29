"use client";

import { useEffect, useState } from "react";
import { Avatar } from "@/components/crumble/ui/avatar";
import { Badge } from "@/components/crumble/ui/badge";
import { Button } from "@/components/crumble/ui/button";
import { Card } from "@/components/crumble/ui/card";
import { Input } from "@/components/crumble/ui/input";
import { Select } from "@/components/crumble/ui/select";
import {
  StickyNote,
  type StickyNoteColor,
} from "@/components/crumble/ui/sticky-note";
import { Textarea } from "@/components/crumble/ui/textarea";
import { Tooltip } from "@/components/crumble/ui/tooltip";

export interface KanbanTask {
  assigneeFallback?: string;
  description?: string;
  id: string;
  priority: "high" | "medium" | "low";
  tag?: string;
  title: string;
}

export interface KanbanColumn {
  color: StickyNoteColor;
  id: string;
  label: string;
  tasks: KanbanTask[];
}

interface NewTaskDraft {
  assigneeFallback: string;
  description: string;
  priority: KanbanTask["priority"];
  tag: string;
  title: string;
}

interface EditingTaskState {
  columnId: string;
  taskId: string;
  value: string;
}

export interface KanbanColumnBlockProps {
  addTaskLabel?: string;
  emptyStateLabel?: string;
  initialColumns?: KanbanColumn[];
  onBoardChange?: (columns: KanbanColumn[]) => void;
  priorityFilterLabel?: string;
  searchPlaceholder?: string;
  title?: string;
}

const DEFAULT_COLUMNS: KanbanColumn[] = [
  {
    id: "todo",
    label: "To Do",
    color: "yellow",
    tasks: [
      {
        id: "task-1",
        title: "Audit empty states",
        description: "Check docs pages that still use placeholder copy.",
        priority: "high",
        assigneeFallback: "GL",
        tag: "design",
      },
      {
        id: "task-2",
        title: "Ship rough drawer docs",
        description: "Document the open and close patterns.",
        priority: "medium",
        assigneeFallback: "AC",
        tag: "docs",
      },
    ],
  },
  {
    id: "doing",
    label: "In Progress",
    color: "blue",
    tasks: [
      {
        id: "task-3",
        title: "Replace direct rough calls",
        description: "Move remaining components to useRough helpers.",
        priority: "high",
        assigneeFallback: "DP",
        tag: "eng",
      },
    ],
  },
  {
    id: "done",
    label: "Done",
    color: "green",
    tasks: [
      {
        id: "task-4",
        title: "Polish preview container",
        description:
          "Align install command copy with the current registry path.",
        priority: "low",
        assigneeFallback: "BM",
        tag: "site",
      },
    ],
  },
];

function createEmptyDraft(): NewTaskDraft {
  return {
    title: "",
    description: "",
    assigneeFallback: "",
    tag: "",
    priority: "medium",
  };
}

export function KanbanColumnBlock({
  addTaskLabel = "+ Add task",
  emptyStateLabel = "No tasks match the current filters.",
  initialColumns = DEFAULT_COLUMNS,
  onBoardChange,
  priorityFilterLabel = "Priority",
  searchPlaceholder = "Search tasks...",
  title = "Sprint board",
}: KanbanColumnBlockProps) {
  const [columns, setColumns] = useState(initialColumns);
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | KanbanTask["priority"]
  >("all");
  const [openFormColumnId, setOpenFormColumnId] = useState<string | null>(null);
  const [drafts, setDrafts] = useState<Record<string, NewTaskDraft>>({});
  const [editingTask, setEditingTask] = useState<EditingTaskState | null>(null);

  useEffect(() => {
    setColumns(initialColumns);
  }, [initialColumns]);

  const updateBoard = (
    updater: (current: KanbanColumn[]) => KanbanColumn[],
  ) => {
    setColumns((current) => {
      const next = updater(current);
      onBoardChange?.(next);
      return next;
    });
  };

  const getDraft = (columnId: string) => drafts[columnId] ?? createEmptyDraft();

  const isVisibleTask = (task: KanbanTask) => {
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;
    const query = search.trim().toLowerCase();
    if (!matchesPriority) return false;
    if (!query) return true;
    return [task.title, task.description, task.tag, task.assigneeFallback]
      .filter(Boolean)
      .some((value) => String(value).toLowerCase().includes(query));
  };

  const moveTask = (
    taskId: string,
    fromColumnId: string,
    toColumnId: string,
  ) => {
    if (fromColumnId === toColumnId) return;

    updateBoard((current) => {
      let movedTask: KanbanTask | undefined;
      const removed = current.map((column) => {
        if (column.id !== fromColumnId) return column;
        const nextTasks = column.tasks.filter((task) => {
          if (task.id === taskId) {
            movedTask = task;
            return false;
          }
          return true;
        });
        return { ...column, tasks: nextTasks };
      });

      if (!movedTask) return current;

      return removed.map((column) =>
        column.id === toColumnId
          ? { ...column, tasks: [...column.tasks, movedTask as KanbanTask] }
          : column,
      );
    });
  };

  const submitDraft = (columnId: string) => {
    const draft = getDraft(columnId);
    if (!draft.title.trim()) return;

    const task: KanbanTask = {
      id: `task-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      title: draft.title.trim(),
      description: draft.description.trim() || undefined,
      assigneeFallback: draft.assigneeFallback.trim() || undefined,
      tag: draft.tag.trim() || undefined,
      priority: draft.priority,
    };

    updateBoard((current) =>
      current.map((column) =>
        column.id === columnId
          ? { ...column, tasks: [...column.tasks, task] }
          : column,
      ),
    );

    setDrafts((current) => ({ ...current, [columnId]: createEmptyDraft() }));
    setOpenFormColumnId(null);
  };

  const commitEdit = () => {
    if (!editingTask) return;
    const value = editingTask.value.trim();
    if (!value) {
      setEditingTask(null);
      return;
    }

    updateBoard((current) =>
      current.map((column) =>
        column.id === editingTask.columnId
          ? {
              ...column,
              tasks: column.tasks.map((task) =>
                task.id === editingTask.taskId
                  ? { ...task, title: value }
                  : task,
              ),
            }
          : column,
      ),
    );
    setEditingTask(null);
  };

  return (
    <div className="flex w-full flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="text-lg font-semibold">{title}</p>
        <div className="flex flex-wrap items-center gap-2">
          <Input
            className="w-56"
            onChange={(event) => setSearch(event.target.value)}
            placeholder={searchPlaceholder}
            value={search}
          />
          <Select
            onChange={(value) =>
              setPriorityFilter(value as "all" | KanbanTask["priority"])
            }
            options={[
              { value: "all", label: `${priorityFilterLabel}: all` },
              { value: "high", label: `${priorityFilterLabel}: high` },
              { value: "medium", label: `${priorityFilterLabel}: medium` },
              { value: "low", label: `${priorityFilterLabel}: low` },
            ]}
            value={priorityFilter}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {columns.map((column, columnIndex) => {
          const draft = getDraft(column.id);
          const visibleTasks = column.tasks.filter(isVisibleTask);

          return (
            <Card key={column.id} padding={18} style={{ overflow: "visible" }}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-semibold">{column.label}</p>
                  <Badge variant="outline">{visibleTasks.length}</Badge>
                </div>
                <Button
                  onClick={() =>
                    setOpenFormColumnId((current) =>
                      current === column.id ? null : column.id,
                    )
                  }
                  size="sm"
                  variant="ghost"
                >
                  {addTaskLabel}
                </Button>
              </div>

              {openFormColumnId === column.id ? (
                <div className="mb-4 flex flex-col gap-3">
                  <Input
                    label="Title"
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [column.id]: { ...draft, title: event.target.value },
                      }))
                    }
                    value={draft.title}
                  />
                  <Textarea
                    autoGrow
                    label="Description"
                    onChange={(event) =>
                      setDrafts((current) => ({
                        ...current,
                        [column.id]: {
                          ...draft,
                          description: event.target.value,
                        },
                      }))
                    }
                    value={draft.description}
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Assignee"
                      maxLength={2}
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [column.id]: {
                            ...draft,
                            assigneeFallback: event.target.value.toUpperCase(),
                          },
                        }))
                      }
                      value={draft.assigneeFallback}
                    />
                    <Input
                      label="Tag"
                      onChange={(event) =>
                        setDrafts((current) => ({
                          ...current,
                          [column.id]: { ...draft, tag: event.target.value },
                        }))
                      }
                      value={draft.tag}
                    />
                  </div>
                  <Select
                    onChange={(value) =>
                      setDrafts((current) => ({
                        ...current,
                        [column.id]: {
                          ...draft,
                          priority: value as KanbanTask["priority"],
                        },
                      }))
                    }
                    options={[
                      { value: "high", label: "High priority" },
                      { value: "medium", label: "Medium priority" },
                      { value: "low", label: "Low priority" },
                    ]}
                    value={draft.priority}
                  />
                  <div className="flex gap-2">
                    <Button onClick={() => submitDraft(column.id)} size="sm">
                      Save task
                    </Button>
                    <Button
                      onClick={() => setOpenFormColumnId(null)}
                      size="sm"
                      variant="ghost"
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : null}

              <div className="flex flex-col gap-3">
                {visibleTasks.map((task, taskIndex) => {
                  const isEditing =
                    editingTask?.columnId === column.id &&
                    editingTask.taskId === task.id;

                  return (
                    <StickyNote
                      key={task.id}
                      className="group w-full"
                      color={column.color}
                      rotate={(columnIndex + taskIndex) % 2 === 0 ? -1 : 1}
                      title={
                        isEditing ? (
                          <Input
                            autoFocus
                            className="w-full"
                            onBlur={commitEdit}
                            onChange={(event) =>
                              setEditingTask((current) =>
                                current
                                  ? { ...current, value: event.target.value }
                                  : current,
                              )
                            }
                            onKeyDown={(event) => {
                              if (event.key === "Enter") {
                                event.preventDefault();
                                commitEdit();
                              }
                              if (event.key === "Escape") {
                                setEditingTask(null);
                              }
                            }}
                            value={editingTask?.value ?? ""}
                          />
                        ) : (
                          <button
                            className="text-left text-sm font-semibold"
                            onClick={() =>
                              setEditingTask({
                                columnId: column.id,
                                taskId: task.id,
                                value: task.title,
                              })
                            }
                            type="button"
                          >
                            {task.title}
                          </button>
                        )
                      }
                    >
                      <div className="space-y-3">
                        {task.description ? (
                          <p className="text-xs leading-5 text-foreground/80">
                            {task.description}
                          </p>
                        ) : null}

                        <div className="flex flex-wrap items-center gap-2">
                          <Badge
                            variant={
                              task.priority === "high"
                                ? "destructive"
                                : task.priority === "medium"
                                  ? "warning"
                                  : "outline"
                            }
                          >
                            {task.priority}
                          </Badge>
                          {task.tag ? (
                            <Badge variant="outline">{task.tag}</Badge>
                          ) : null}
                          {task.assigneeFallback ? (
                            <Avatar
                              fallback={task.assigneeFallback}
                              size={24}
                            />
                          ) : null}
                        </div>

                        <div className="flex flex-wrap gap-2 opacity-0 transition-opacity group-hover:opacity-100">
                          {columns
                            .filter(
                              (targetColumn) => targetColumn.id !== column.id,
                            )
                            .map((targetColumn) => (
                              <Tooltip
                                key={targetColumn.id}
                                content={`Move to ${targetColumn.label}`}
                              >
                                <span>
                                  <Button
                                    onClick={() =>
                                      moveTask(
                                        task.id,
                                        column.id,
                                        targetColumn.id,
                                      )
                                    }
                                    size="sm"
                                    variant="ghost"
                                  >
                                    {targetColumn.label}
                                  </Button>
                                </span>
                              </Tooltip>
                            ))}
                          <Tooltip content="Delete task">
                            <span>
                              <Button
                                onClick={() =>
                                  updateBoard((current) =>
                                    current.map((currentColumn) =>
                                      currentColumn.id === column.id
                                        ? {
                                            ...currentColumn,
                                            tasks: currentColumn.tasks.filter(
                                              (currentTask) =>
                                                currentTask.id !== task.id,
                                            ),
                                          }
                                        : currentColumn,
                                    ),
                                  )
                                }
                                size="sm"
                                variant="ghost"
                              >
                                Delete
                              </Button>
                            </span>
                          </Tooltip>
                        </div>
                      </div>
                    </StickyNote>
                  );
                })}

                {visibleTasks.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    {emptyStateLabel}
                  </p>
                ) : null}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
