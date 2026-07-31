/**
 * Virtual Filesystem
 *
 * A tree-based virtual filesystem that models a macOS home directory.
 * Consumed by Finder (list/column views) and will be shared with
 * a future Terminal app (ls, cd, cat).
 *
 * The tree is built once from content data (notes, projects, etc.)
 * and is read-only at runtime.
 */

import { desktopApps } from "@/lib/desktop-apps";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type FSNodeKind = "directory" | "file";

export interface FSFile {
  kind: "file";
  name: string;
  /** Absolute path from root, e.g. "/Users/dhruv/Documents/Notes/my-post.md" */
  path: string;
  size: string;
  /** Human-readable type shown in Finder's "Kind" column */
  fileKind: string;
  dateModified: string;
  /** Optional route to navigate to when opened */
  route?: string;
  /** Optional external URL to open */
  url?: string;
  /** Optional content for `cat` in future Terminal */
  content?: string;
}

export interface FSDirectory {
  kind: "directory";
  name: string;
  path: string;
  dateModified: string;
  children: FSNode[];
  /** Optional URL to open when double-clicked (e.g. GitHub repo) */
  url?: string;
}

export type FSNode = FSFile | FSDirectory;

// ---------------------------------------------------------------------------
// Path utilities
// ---------------------------------------------------------------------------

const HOME = "/Users/dhruv";

export function homePath(...segments: string[]): string {
  return [HOME, ...segments].join("/");
}

export function resolveAbsolute(cwd: string, target: string): string {
  if (target.startsWith("/")) return normalizePath(target);
  if (target === "~") return HOME;
  if (target.startsWith("~/")) return normalizePath(HOME + target.slice(1));

  const parts = cwd.split("/").filter(Boolean);
  for (const seg of target.split("/")) {
    if (seg === "..") parts.pop();
    else if (seg !== "." && seg !== "") parts.push(seg);
  }
  return "/" + parts.join("/");
}

function normalizePath(p: string): string {
  const parts = p.split("/").filter(Boolean);
  const resolved: string[] = [];
  for (const part of parts) {
    if (part === "..") resolved.pop();
    else if (part !== ".") resolved.push(part);
  }
  return "/" + resolved.join("/");
}

// ---------------------------------------------------------------------------
// Tree query helpers
// ---------------------------------------------------------------------------

/** Walk the tree and return the node at `absolutePath`, or null. */
export function getNodeAtPath(root: FSDirectory, absolutePath: string): FSNode | null {
  if (absolutePath === root.path || absolutePath === root.path + "/") return root;

  const relative = absolutePath.startsWith(root.path + "/")
    ? absolutePath.slice(root.path.length + 1)
    : absolutePath.startsWith(root.path)
      ? absolutePath.slice(root.path.length)
      : null;

  if (relative === null || relative === "") return root;

  const segments = relative.split("/").filter(Boolean);
  let current: FSNode = root;

  for (const segment of segments) {
    if (current.kind !== "directory") return null;
    const child: FSNode | undefined = current.children.find((c) => c.name === segment);
    if (!child) return null;
    current = child;
  }

  return current;
}

/** List immediate children of a directory at `absolutePath`. */
export function listDirectory(root: FSDirectory, absolutePath: string): FSNode[] {
  const node = getNodeAtPath(root, absolutePath);
  if (!node || node.kind !== "directory") return [];
  return node.children;
}

/** Get the parent directory path of a given absolute path. */
export function parentPath(absolutePath: string): string {
  const parts = absolutePath.split("/").filter(Boolean);
  parts.pop();
  return parts.length === 0 ? "/" : "/" + parts.join("/");
}

/** Get breadcrumb segments for a path (for Finder's path bar). */
export function breadcrumbs(absolutePath: string): { name: string; path: string }[] {
  const parts = absolutePath.split("/").filter(Boolean);
  return parts.map((name, i) => ({
    name,
    path: "/" + parts.slice(0, i + 1).join("/"),
  }));
}

// ---------------------------------------------------------------------------
// Builder helpers
// ---------------------------------------------------------------------------

function dir(name: string, parentPath: string, children: FSNode[], dateModified?: string, url?: string): FSDirectory {
  const path = parentPath === "/" ? `/${name}` : `${parentPath}/${name}`;
  return {
    kind: "directory",
    name,
    path,
    dateModified: dateModified ?? "Today",
    children,
    ...(url ? { url } : {}),
  };
}

function file(
  name: string,
  parentPath: string,
  opts: Omit<FSFile, "kind" | "name" | "path">,
): FSFile {
  const path = `${parentPath}/${name}`;
  return { kind: "file", name, path, ...opts };
}

// ---------------------------------------------------------------------------
// Project data
// ---------------------------------------------------------------------------

export interface ProjectEntry {
  name: string;
  description: string;
  tech: string[];
  dateModified: string;
  status: "active" | "archived" | "wip";
}

const projects: ProjectEntry[] = [
  {
    name: "how-to-get-rich-final-final",
    description: "Definitely the last final version of the master plan",
    tech: ["Notion", "Coffee", "Delusion"],
    dateModified: "Today at 12:14 PM",
    status: "wip",
  },
  {
    name: "yc-application-v47",
    description: "Tiny edits that somehow changed everything",
    tech: ["Google Docs", "Anxiety", "Hope"],
    dateModified: "Today at 11:59 AM",
    status: "active",
  },
  {
    name: "cold-dms-that-worked",
    description: "Screenshots kept for scientific purposes",
    tech: ["X", "LinkedIn", "Shamelessness"],
    dateModified: "Yesterday at 2:27 PM",
    status: "active",
  },
  {
    name: "fortune-500-vibes",
    description: "Enterprise folder with startup sleep schedule",
    tech: ["CRM", "Calendly", "Adrenaline"],
    dateModified: "Yesterday at 12:45 PM",
    status: "wip",
  },
  {
    name: "ideas-i-will-build-someday",
    description: "A museum of suspiciously good domain names",
    tech: ["README", "Domains", "Copium"],
    dateModified: "Last opened in a dream",
    status: "archived",
  },
];

// ---------------------------------------------------------------------------
// Tree construction
// ---------------------------------------------------------------------------

function buildProjectsDir(): FSDirectory {
  const projectsPath = homePath("Documents", "Projects");
  const children: FSNode[] = projects.map((p) =>
    dir(p.name, projectsPath, [], p.dateModified),
  );
  return dir("Projects", homePath("Documents"), children);
}

function buildDocumentsDir(): FSDirectory {
  const documentsPath = homePath("Documents");
  return dir("Documents", HOME, [
    buildProjectsDir(),
    dir("Notes", documentsPath, [], "Today"),
  ]);
}

function buildDesktopDir(): FSDirectory {
  const desktopPath = homePath("Desktop");
  return dir("Desktop", HOME, [
    file("dhcp_capture.pcap", desktopPath, {
      size: "2 KB",
      fileKind: "Packet Capture",
      dateModified: "17 Feb 2026 at 4:26 AM",
    }),
    file("dhcp_capture.sh", desktopPath, {
      size: "2 KB",
      fileKind: "Terminal script",
      dateModified: "17 Feb 2026 at 4:23 AM",
    }),
  ]);
}

function buildPicturesDir(): FSDirectory {
  return dir("Pictures", HOME, []);
}

function buildMusicDir(): FSDirectory {
  return dir("Music", HOME, []);
}

function buildDownloadsDir(): FSDirectory {
  return dir("Downloads", HOME, []);
}

export function buildFileSystem(): FSDirectory {
  const homeDir: FSDirectory = {
    kind: "directory",
    name: "dhruv",
    path: HOME,
    dateModified: "Today",
    children: [
      buildDesktopDir(),
      buildDocumentsDir(),
      buildDownloadsDir(),
      buildMusicDir(),
      buildPicturesDir(),
    ],
  };

  // /Applications — top-level macOS apps directory
  const applicationsDir = dir("Applications", "/", [
    ...desktopApps.map((app) =>
      file(app.finderAppName, "/Applications", {
        size: app.finderAppSize,
        fileKind: "Application",
        dateModified: "Today",
      }),
    ),
    file("Photos.app", "/Applications", { size: "44 MB", fileKind: "Application", dateModified: "Today" }),
  ]);

  // Root: /
  const root: FSDirectory = {
    kind: "directory",
    name: "/",
    path: "/",
    dateModified: "Today",
    children: [
      applicationsDir,
      dir("Users", "/", [homeDir]),
    ],
  };

  return root;
}

// ---------------------------------------------------------------------------
// Singleton accessor
// ---------------------------------------------------------------------------

let _fs: FSDirectory | null = null;

export function getFileSystem(): FSDirectory {
  if (!_fs) {
    _fs = buildFileSystem();
  }
  return _fs;
}

// ---------------------------------------------------------------------------
// Convenience: get a flat list of projects for Finder/elsewhere
// ---------------------------------------------------------------------------

export function getProjects(): ProjectEntry[] {
  return projects;
}

// ---------------------------------------------------------------------------
// Finder-specific: map a sidebar item to a filesystem path
// ---------------------------------------------------------------------------

const sidebarPathMap: Record<string, string> = {
  Recents: homePath("Documents"),
  Shared: homePath("Documents"),
  Applications: "/Applications",
  Desktop: homePath("Desktop"),
  Documents: homePath("Documents"),
  Downloads: homePath("Downloads"),
  Projects: homePath("Documents", "Projects"),
  Pictures: homePath("Pictures"),
  "iCloud Drive": homePath("Documents"),
  dhruv: HOME,
  "Dhruv's MacBook Air": "/",
};

export function getPathForSidebarItem(item: string): string {
  return sidebarPathMap[item] ?? HOME;
}
