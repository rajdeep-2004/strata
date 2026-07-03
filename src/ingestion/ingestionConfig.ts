export const IGNORED_DIRECTORIES = [
  ".git",
  ".next",
  ".turbo",
  ".cache",
  ".vscode",
  ".idea",
  "node_modules",
  "dist",
  "build",
  "coverage",
  "vendor",
  "tmp",
  "temp",
  "out",
  "target",
  "bin",
  "obj",
];

export const IGNORED_EXTENSIONS = [
  // Images
  ".png",
  ".jpg",
  ".jpeg",
  ".gif",
  ".svg",
  ".ico",
  ".webp",
  ".bmp",

  // Videos
  ".mp4",
  ".avi",
  ".mov",
  ".mkv",
  ".webm",

  // Audio
  ".mp3",
  ".wav",
  ".ogg",
  ".flac",

  // Archives
  ".zip",
  ".tar",
  ".gz",
  ".rar",
  ".7z",

  // Documents
  ".pdf",
  ".doc",
  ".docx",
  ".ppt",
  ".pptx",
  ".xls",
  ".xlsx",

  // Fonts
  ".ttf",
  ".otf",
  ".woff",
  ".woff2",

  // Executables
  ".exe",
  ".dll",
  ".so",
  ".dylib",
  ".class",
  ".jar",

  // Misc binaries
  ".bin",
  ".iso",
];

export const IGNORED_FILES = [
  "package-lock.json",
  "yarn.lock",
  "pnpm-lock.yaml",
  "bun.lockb",

  ".DS_Store",
  "Thumbs.db",
];

export const LANGUAGES = {
  // JavaScript / TypeScript
  ".js": "js",
  ".jsx": "js",
  ".mjs": "js",
  ".cjs": "js",
  ".ts": "js",
  ".tsx": "js",

  // Python
  ".py": "python",

  // Java
  ".java": "java",

  // Go
  ".go": "go",

  // Rust
  ".rs": "rust",

  // PHP
  ".php": "php",

  // Ruby
  ".rb": "ruby",

  // C#
  ".cs": undefined,

  // C / C++
  ".c": "cpp",
  ".cc": "cpp",
  ".cpp": "cpp",
  ".cxx": "cpp",
  ".h": "cpp",
  ".hpp": "cpp",

  // Kotlin
  ".kt": undefined,
  ".kts": undefined,

  // Swift
  ".swift": "swift",

  // Scala
  ".scala": "scala",

  // Dart
  ".dart": undefined,

  // HTML
  ".html": "html",
  ".htm": "html",

  // Markdown
  ".md": "markdown",
  ".mdx": "markdown",

  // LaTeX
  ".tex": "latex",

  // Protocol Buffers
  ".proto": "proto",

  // SQL
  ".sql": undefined,
} 

export const CHUNK_SIZE = 100
export const CHUNK_OVERLAP = 15