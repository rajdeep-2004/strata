import {
  IGNORED_DIRECTORIES,
  IGNORED_EXTENSIONS,
  IGNORED_FILES,
} from "./ingestionConfig";
export function shouldIndexFile(path: string) {
  const pathParts = path.split("/");
  const file = pathParts.pop() || "";
  const extension = "." + file.split(".").at(-1);

  if (pathParts.some((splits) => IGNORED_DIRECTORIES.includes(splits)))
    return false;
  else if (IGNORED_FILES.includes(file)) return false;
  else if (IGNORED_EXTENSIONS.includes(extension)) return false;
  return true;
}
