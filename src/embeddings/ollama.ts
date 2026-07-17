import { Ollama } from "ollama";

const ollama = new Ollama();

export async function OllamaService(input: string | string[]) {
  const response = await ollama.embed({
    model: "nomic-embed-text",
    input: input
  });
  return response;
}
