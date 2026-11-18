import { RelevantChunk } from "./types";

function formatLineRange(chunk: RelevantChunk) {
  const lines = chunk.payload.loc?.lines;
  return lines ? `lines ${lines.from}-${lines.to}` : "lines unknown";
}

// Groups chunks by file so the model reads each file's code in source order.
// Files are ordered by their best-matching chunk, most relevant first.
export function buildContext(receivedChunks: RelevantChunk[]) {
  const chunksByFile = new Map<string, RelevantChunk[]>();

  for (const chunk of receivedChunks) {
    const filePath = chunk.payload.filePath;
    chunksByFile.set(filePath, [...(chunksByFile.get(filePath) ?? []), chunk]);
  }

  const fileBlocks = [...chunksByFile.entries()].map(([filePath, chunks]) => {
    const snippets = [...chunks]
      .sort((a, b) => a.payload.chunkIndex - b.payload.chunkIndex)
      .map(
        (chunk) =>
          `<snippet ${formatLineRange(chunk)}>\n\`\`\`${chunk.payload.language ?? ""}\n${chunk.payload.pageContent}\n\`\`\`\n</snippet>`,
      )
      .join("\n");

    return `<file path="${filePath}">\n${snippets}\n</file>`;
  });

  return fileBlocks.join("\n\n");
}
