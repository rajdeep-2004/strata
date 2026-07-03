import {
  RecursiveCharacterTextSplitter,
  SupportedTextSplitterLanguage,
} from "@langchain/textsplitters";
import { Document } from "@langchain/core/documents";
import { CHUNK_OVERLAP, CHUNK_SIZE } from "./ingestionConfig";
import { getLanguage } from "./getExtension";

export async function getChunks(codeContent: string, filePath: string) {
  const language = getLanguage(filePath);

  const splitter = language
    ? RecursiveCharacterTextSplitter.fromLanguage(
        language as SupportedTextSplitterLanguage,
        {
          chunkSize: CHUNK_SIZE,
          chunkOverlap: CHUNK_OVERLAP,
        },
      )
    : new RecursiveCharacterTextSplitter({
        chunkSize: CHUNK_SIZE,
        chunkOverlap: CHUNK_OVERLAP,
      });
  const document = new Document({
    pageContent: codeContent,
    metadata: {
      filePath,
      language,
    },
  });

  const chunks = await splitter.splitDocuments([document]);

  return chunks.map((chunk, index) => {
    chunk.metadata = {
      ...chunk.metadata,
      chunkIndex: index,
      totalChunks: chunks.length,
    };

    return chunk;
  });
}
