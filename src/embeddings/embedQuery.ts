import { Ollama } from "ollama";
import { OllamaService } from "./ollama";

const ollama = new Ollama();

export async function embedQuery(query: string) {
  const response = await OllamaService(query);
  if (!response.embeddings) throw new Error("Cannot embed the query");
  return response.embeddings[0];
}
