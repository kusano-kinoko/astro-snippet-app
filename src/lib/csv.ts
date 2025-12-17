import snippetsSource from "../data/snippets.csv?raw";

export type Snippet = {
  slug: string;
  title: string;
  description: string;
  category: string;
  type: string;
  tags: string[];
  code: string;
  created_at: string;
  updated_at: string;
};

function parseLine(line: string): string[] {
  const cells: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      const next = line[i + 1];
      if (inQuotes && next === '"') {
        current += '"';
        i++; // skip escaped quote
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      cells.push(current);
      current = "";
    } else {
      current += char;
    }
  }

  cells.push(current);
  return cells.map((cell) => cell.trim());
}

function parseCsv(text: string): Record<string, string>[] {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length < 2) return [];

  const headers = parseLine(lines.shift()!);

  return lines.map((line) => {
    const row = parseLine(line);
    return headers.reduce<Record<string, string>>((acc, header, index) => {
      acc[header] = row[index] ?? "";
      return acc;
    }, {});
  });
}

export function loadSnippets(source: string = snippetsSource): Snippet[] {
  return parseCsv(source).map((row) => ({
    slug: row.slug,
    title: row.title,
    description: row.description,
    category: row.category,
    type: row.type,
    tags: row.tags
      .split(";")
      .map((tag) => tag.trim())
      .filter(Boolean),
    code: row.code,
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
}

export function groupByCategory(snippets: Snippet[]): Record<string, Snippet[]> {
  return snippets.reduce<Record<string, Snippet[]>>((acc, snippet) => {
    acc[snippet.category] ??= [];
    acc[snippet.category].push(snippet);
    return acc;
  }, {});
}
