import { LANGUAGES } from "./ingestionConfig";

export function getLanguage(path: string) {
  const pathParts = path.split("/");
  const file = pathParts.pop() || "";
  const extension = "." + file.split(".").at(-1);
  return LANGUAGES[extension as keyof typeof LANGUAGES];
}
