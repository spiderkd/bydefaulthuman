interface PropRow {
  default?: string;
  description: string;
  prop: string;
  required?: boolean;
  type: string;
}

interface PropsTableProps {
  rows: PropRow[];
}

export function PropsTable({ rows }: PropsTableProps) {
  return (
    <div className="my-4 w-full overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-border text-left">
            <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Prop
            </th>
            <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Type
            </th>
            <th className="py-2 pr-4 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Default
            </th>
            <th className="py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Description
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.prop} className="border-b border-border/40">
              <td className="py-2 pr-4">
                <code className="rounded bg-muted px-1.5 py-0.5 font-mono text-xs">
                  {row.prop}
                  {row.required ? (
                    <span className="ml-0.5 text-destructive">*</span>
                  ) : null}
                </code>
              </td>
              <td className="py-2 pr-4">
                <code className="font-mono text-xs text-muted-foreground">
                  {row.type}
                </code>
              </td>
              <td className="py-2 pr-4">
                {row.default ? (
                  <code className="font-mono text-xs text-muted-foreground">
                    {row.default}
                  </code>
                ) : (
                  <span className="text-xs text-muted-foreground/40">-</span>
                )}
              </td>
              <td className="py-2 text-xs text-muted-foreground">
                {row.description}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
