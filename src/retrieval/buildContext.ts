import { RelevantChunk } from "./types";

export function buildContext(receivedChunks: RelevantChunk[]) {
  let contentArray = [];
  for (const chunk of receivedChunks) {
    contentArray.push(`
    File: ${chunk.payload.filePath}

    Code:

    \`\`\`${chunk.payload.language ?? ""}
    ${chunk.payload.pageContent}
    \`\`\`

    ----------------------------------------
    `);
  }
  const context = contentArray.join("");
  return context;
}
