// How many chunks to pull from Qdrant per question.
// Chunks are small, so a wider net gives the model enough surrounding code.
export const RETRIEVAL_LIMIT = 12;

// Chunks scoring below this cosine similarity are treated as noise.
export const MIN_RELEVANCE_SCORE = 0.3;

export const ANSWER_MODEL = "gemini-3.1-flash-lite";

export const NO_CONTEXT_ANSWER =
  "I couldn't find anything relevant to this question in the indexed codebase. Try rephrasing it, or mention a file, function or feature name.";
