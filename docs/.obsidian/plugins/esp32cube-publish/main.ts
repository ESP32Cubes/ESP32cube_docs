import {
  App,
  MarkdownView,
  Notice,
  Plugin,
  PluginSettingTab,
  TFile,
  normalizePath,
  type RequestUrlParam,
  Setting,
  requestUrl
} from "obsidian";

interface Esp32CubeSettings {
  apiBaseUrl: string;
  email: string;
  defaultCategorySlug: string;
  defaultStatus: "draft" | "published";
  /** Vault folder for “pull from site” (created if missing). */
  syncFolder: string;
  /** `my` = your articles; `all` = whole site (server requires admin). */
  pullScope: "my" | "all";
}

const DEFAULT_SETTINGS: Esp32CubeSettings = {
  apiBaseUrl: "http://localhost:3000",
  email: "",
  defaultCategorySlug: "tutorial",
  defaultStatus: "draft",
  syncFolder: "ESP32Cube",
  pullScope: "my"
};

export default class Esp32CubePublishPlugin extends Plugin {
  settings!: Esp32CubeSettings;

  async onload(): Promise<void> {
    await this.loadSettings();
    this.addSettingTab(new Esp32CubeSettingTab(this.app, this));

    this.addRibbonIcon("upload-cloud", "发布到 ESP32Cube", () => {
      const view = this.app.workspace.getActiveViewOfType(MarkdownView);
      if (!view) {
        new Notice("ESP32Cube: 请先打开一篇 Markdown 笔记。");
        return;
      }
      void this.publishActiveNote(view);
    });

    this.addCommand({
      id: "esp32cube-publish-note",
      name: "Publish to ESP32Cube",
      editorCheckCallback: (checking, _editor, view) => {
        if (!(view instanceof MarkdownView)) return false;
        if (!checking) {
          void this.publishActiveNote(view);
        }
        return true;
      }
    });

    this.addCommand({
      id: "esp32cube-test-connection",
      name: "ESP32Cube: Test API connection",
      callback: () => void this.testConnection()
    });

    this.addCommand({
      id: "esp32cube-pull-articles",
      name: "ESP32Cube: Pull articles from site",
      callback: () => void this.pullArticlesFromSite()
    });
  }

  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  normalizeBaseUrl(): string {
    return this.settings.apiBaseUrl.replace(/\/$/, "");
  }

  publishHeadersJson(): Record<string, string> {
    return {
      "Content-Type": "application/json",
      "X-Publish-Email": this.settings.email.trim()
    };
  }

  async testConnection(): Promise<void> {
    if (!this.settings.email.trim()) {
      new Notice("ESP32Cube: set user email in settings.");
      return;
    }
    const base = this.normalizeBaseUrl();
    try {
      const res = await requestUrl({
        url: `${base}/api/publish/article`,
        method: "GET",
        headers: {
          "X-Publish-Email": this.settings.email.trim()
        }
      });
      if (res.status !== 200) {
        new Notice(`ESP32Cube: HTTP ${res.status}`);
        return;
      }
      const data = res.json as { categories?: unknown[] };
      const n = Array.isArray(data.categories) ? data.categories.length : 0;
      new Notice(`ESP32Cube: connected — ${n} categories.`);
    } catch (e) {
      new Notice(`ESP32Cube: ${e instanceof Error ? e.message : "request failed"}`);
    }
  }

  async pullArticlesFromSite(): Promise<void> {
    const email = this.settings.email.trim();
    if (!email) {
      new Notice("ESP32Cube: set user email in settings.");
      return;
    }

    const base = this.normalizeBaseUrl();
    const scope = this.settings.pullScope === "all" ? "all" : "my";
    const folderPath = normalizePath(this.settings.syncFolder.trim() || "ESP32Cube");

    try {
      new Notice("ESP32Cube: pulling articles…");
      const res = await requestUrl({
        url: `${base}/api/publish/articles?scope=${encodeURIComponent(scope)}&email=${encodeURIComponent(email)}`,
        method: "GET",
        headers: {
          "X-Publish-Email": email
        }
      });

      if (res.status < 200 || res.status >= 300) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = res.json as { error?: string };
          if (j?.error) msg = j.error;
        } catch {
          /* ignore */
        }
        new Notice(`ESP32Cube: ${msg}`);
        return;
      }

      const data = res.json as {
        articles?: Array<{ filename?: string; markdown: string; id?: string }>;
      };
      const articles = Array.isArray(data.articles) ? data.articles : [];
      if (articles.length === 0) {
        new Notice("ESP32Cube: no articles returned.");
        return;
      }

      if (!this.app.vault.getAbstractFileByPath(folderPath)) {
        await this.app.vault.createFolder(folderPath);
      }

      let written = 0;
      let skippedNoId = 0;
      for (const a of articles) {
        const md = typeof a.markdown === "string" ? a.markdown : "";
        if (!md) continue;
        const articleId =
          (typeof a.id === "string" && a.id.trim()) || extractFrontmatterScalar(md, "id") || "";
        const name = toIdMarkdownFilename(articleId);
        if (!name) {
          skippedNoId += 1;
          continue;
        }
        const path = normalizePath(`${folderPath}/${name}`);
        const existing = this.app.vault.getAbstractFileByPath(path);
        if (existing instanceof TFile) {
          await this.app.vault.modify(existing, md);
        } else {
          await this.app.vault.create(path, md);
        }
        written += 1;
      }

      const skipHint = skippedNoId > 0 ? `, skipped ${skippedNoId} without id` : "";
      new Notice(`ESP32Cube: pulled ${written} article(s) → ${folderPath}${skipHint}`);
    } catch (e) {
      new Notice(`ESP32Cube: ${e instanceof Error ? e.message : "request failed"}`);
    }
  }

  async publishActiveNote(view: MarkdownView): Promise<void> {
    if (!this.settings.email.trim()) {
      new Notice("ESP32Cube: set user email in settings.");
      return;
    }

    const file = view.file;
    if (!file) {
      new Notice("ESP32Cube: no file open.");
      return;
    }

    const content = await this.app.vault.read(file);
    const cache = this.app.metadataCache.getFileCache(file);
    const fm = cache?.frontmatter ?? {};

    const title =
      (typeof fm.title === "string" && fm.title.trim()) || file.basename;

    const slug =
      typeof fm.slug === "string" && fm.slug.trim() ? fm.slug.trim() : undefined;

    const articleId =
      typeof fm.id === "string" && fm.id.trim() ? fm.id.trim() : undefined;

    const categorySlug =
      (typeof fm.category === "string" && fm.category.trim()) ||
      (typeof fm.categorySlug === "string" && fm.categorySlug.trim()) ||
      this.settings.defaultCategorySlug;

    const tags = normalizeTags(fm.tags);

    const excerpt =
      typeof fm.excerpt === "string"
        ? fm.excerpt
        : typeof fm.summary === "string"
          ? fm.summary
          : undefined;

    const coverImage =
      typeof fm.cover === "string"
        ? fm.cover
        : typeof fm.coverImage === "string"
          ? fm.coverImage
          : undefined;

    const status: "draft" | "published" =
      fm.status === "published" || fm.status === "draft"
        ? fm.status
        : this.settings.defaultStatus;

    const embeddedImages = await collectEmbeddedImagesFromNote(this.app, file, content);

    const email = this.settings.email.trim();
    const payload = {
      email,
      title,
      content,
      categorySlug,
      slug,
      id: articleId,
      tags: tags.length ? tags : undefined,
      excerpt,
      coverImage,
      status,
      embeddedImages: embeddedImages.length ? embeddedImages : undefined
    };

    const base = this.normalizeBaseUrl();
    try {
      new Notice("ESP32Cube: publishing…");
      const param: RequestUrlParam = {
        url: `${base}/api/publish/article`,
        method: "POST",
        headers: this.publishHeadersJson(),
        body: JSON.stringify(payload)
      };
      const res = await requestUrl(param);

      if (res.status < 200 || res.status >= 300) {
        let msg = `HTTP ${res.status}`;
        try {
          const j = res.json as { error?: string };
          if (j?.error) msg = j.error;
        } catch {
          /* ignore */
        }
        new Notice(`ESP32Cube: ${msg}`);
        return;
      }

      const data = res.json as {
        id?: string;
        slug?: string;
        urlPath?: string;
        created?: boolean;
        markdown?: string;
        content?: string;
        filename?: string;
      };
      const path = data.urlPath ?? (data.slug ? `/post/${data.slug}` : "");
      const serverMarkdown = await this.resolvePublishedMarkdown(base, email, data);
      await this.applyPublishResultToLocalFile(file, data, serverMarkdown);
      const renamedPath = await this.renameLocalFileAfterPublish(file, data);

      const syncHint = serverMarkdown ? " + local synced" : " + frontmatter synced";
      const renameHint = renamedPath ? ` + renamed to ${renamedPath}` : "";
      new Notice(
        `ESP32Cube: ${data.created ? "Created" : "Updated"} ${path || "ok"}${syncHint}${renameHint}`
      );
    } catch (e) {
      new Notice(`ESP32Cube: ${e instanceof Error ? e.message : "request failed"}`);
    }
  }

  async renameLocalFileAfterPublish(
    file: TFile,
    data: { id?: string }
  ): Promise<string | undefined> {
    const targetName = toIdMarkdownFilename(data.id);
    if (!targetName) return undefined;

    const parentPath = file.parent?.path ?? "";
    const desiredPath = parentPath
      ? normalizePath(`${parentPath}/${targetName}`)
      : normalizePath(targetName);
    if (desiredPath === file.path) return undefined;

    const nextPath = this.resolveAvailablePath(desiredPath, file.path);
    if (!nextPath || nextPath === file.path) return undefined;

    try {
      await this.app.vault.rename(file, nextPath);
      return nextPath;
    } catch {
      return undefined;
    }
  }

  resolveAvailablePath(desiredPath: string, currentPath: string): string | undefined {
    const normalizedDesired = normalizePath(desiredPath);
    if (normalizedDesired === currentPath) return currentPath;

    const existing = this.app.vault.getAbstractFileByPath(normalizedDesired);
    if (!(existing instanceof TFile) || existing.path === currentPath) {
      return normalizedDesired;
    }

    const dot = normalizedDesired.lastIndexOf(".");
    const base = dot > 0 ? normalizedDesired.slice(0, dot) : normalizedDesired;
    const ext = dot > 0 ? normalizedDesired.slice(dot) : "";

    for (let i = 1; i <= 999; i += 1) {
      const candidate = normalizePath(`${base}-${i}${ext}`);
      const f = this.app.vault.getAbstractFileByPath(candidate);
      if (!(f instanceof TFile) || f.path === currentPath) {
        return candidate;
      }
    }

    return undefined;
  }

  async resolvePublishedMarkdown(
    base: string,
    email: string,
    data: { id?: string; slug?: string; markdown?: string; content?: string }
  ): Promise<string | undefined> {
    const inlineMd =
      typeof data.markdown === "string" && data.markdown.trim()
        ? data.markdown
        : typeof data.content === "string" && data.content.trim()
          ? data.content
          : undefined;
    if (inlineMd) return inlineMd;

    const id = typeof data.id === "string" ? data.id.trim() : "";
    const slug = typeof data.slug === "string" ? data.slug.trim() : "";

    const byArticleApi = await this.fetchMarkdownFromArticleApi(base, email, id, slug);
    if (byArticleApi) return byArticleApi;

    return await this.fetchMarkdownFromArticlesList(base, email, id, slug);
  }

  async fetchMarkdownFromArticleApi(
    base: string,
    email: string,
    id: string,
    slug: string
  ): Promise<string | undefined> {
    const tries: string[] = [];
    if (id) tries.push(`${base}/api/publish/article?id=${encodeURIComponent(id)}&email=${encodeURIComponent(email)}`);
    if (slug) tries.push(`${base}/api/publish/article?slug=${encodeURIComponent(slug)}&email=${encodeURIComponent(email)}`);

    for (const url of tries) {
      try {
        const res = await requestUrl({
          url,
          method: "GET",
          headers: { "X-Publish-Email": email }
        });
        if (res.status < 200 || res.status >= 300) continue;

        const j = res.json as { markdown?: string; content?: string };
        const md =
          typeof j?.markdown === "string" && j.markdown.trim()
            ? j.markdown
            : typeof j?.content === "string" && j.content.trim()
              ? j.content
              : undefined;
        if (md) return md;
      } catch {
        /* ignore and try fallback */
      }
    }

    return undefined;
  }

  async fetchMarkdownFromArticlesList(
    base: string,
    email: string,
    id: string,
    slug: string
  ): Promise<string | undefined> {
    try {
      const res = await requestUrl({
        url: `${base}/api/publish/articles?scope=my&email=${encodeURIComponent(email)}`,
        method: "GET",
        headers: { "X-Publish-Email": email }
      });
      if (res.status < 200 || res.status >= 300) return undefined;

      const data = res.json as {
        articles?: Array<{ filename: string; markdown: string }>;
      };
      const articles = Array.isArray(data.articles) ? data.articles : [];
      if (articles.length === 0) return undefined;

      if (id) {
        const byId = articles.find((a) => hasFrontmatterScalar(a.markdown, "id", id));
        if (byId?.markdown) return byId.markdown;
      }
      if (slug) {
        const bySlug =
          articles.find((a) => hasFrontmatterScalar(a.markdown, "slug", slug)) ??
          articles.find((a) => normalizePath(a.filename).toLowerCase().includes(slug.toLowerCase()));
        if (bySlug?.markdown) return bySlug.markdown;
      }
    } catch {
      /* ignore */
    }
    return undefined;
  }

  async applyPublishResultToLocalFile(
    file: TFile,
    data: { id?: string; slug?: string },
    serverMarkdown?: string
  ): Promise<void> {
    try {
      let next =
        typeof serverMarkdown === "string" && serverMarkdown.trim()
          ? serverMarkdown
          : await this.app.vault.read(file);

      const pairs: Record<string, string> = {};
      if (typeof data.id === "string" && data.id.trim()) {
        pairs.id = data.id.trim();
      }
      if (typeof data.slug === "string" && data.slug.trim()) {
        pairs.slug = data.slug.trim();
      }

      if (Object.keys(pairs).length > 0) {
        next = upsertYamlScalarsInFrontmatter(next, pairs);
      }

      const raw = await this.app.vault.read(file);
      if (next !== raw) {
        await this.app.vault.modify(file, next);
      }
    } catch {
      /* keep publish success notice even if local sync fails */
    }
  }
}

/** Insert or replace scalar keys in the first YAML frontmatter block; if none, prepends one. */
function upsertYamlScalarsInFrontmatter(raw: string, pairs: Record<string, string>): string {
  const m = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!m) {
    const lines = ["---"];
    for (const [k, v] of Object.entries(pairs)) {
      lines.push(`${k}: ${yamlScalar(v)}`);
    }
    lines.push("---", "");
    return `${lines.join("\n")}\n${raw}`;
  }
  let fm = m[1];
  const body = m[2];
  for (const [k, v] of Object.entries(pairs)) {
    const line = `${k}: ${yamlScalar(v)}`;
    const re = new RegExp(`^${escapeRegExp(k)}:\\s.*$`, "m");
    if (re.test(fm)) {
      fm = fm.replace(re, line);
    } else {
      fm = `${fm.replace(/\s*$/, "")}\n${line}`;
    }
  }
  return `---\n${fm}\n---\n${body}`;
}

function yamlScalar(s: string): string {
  if (/[:#\n[\]{}]/.test(s) || /^\s|\s$/.test(s)) {
    return JSON.stringify(s);
  }
  return s;
}

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function hasFrontmatterScalar(markdown: string, key: string, expected: string): boolean {
  if (!markdown || !expected) return false;
  const m = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return false;
  const fm = m[1];
  const re = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, "m");
  const sm = fm.match(re);
  if (!sm) return false;
  const raw = sm[1].trim();
  const unquoted = raw.replace(/^['\"]|['\"]$/g, "").trim();
  return unquoted === expected;
}

function extractFrontmatterScalar(markdown: string, key: string): string | undefined {
  if (!markdown) return undefined;
  const m = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!m) return undefined;
  const fm = m[1];
  const re = new RegExp(`^${escapeRegExp(key)}:\\s*(.+)$`, "m");
  const sm = fm.match(re);
  if (!sm) return undefined;
  const raw = sm[1].trim();
  const unquoted = raw.replace(/^['\"]|['\"]$/g, "").trim();
  return unquoted || undefined;
}

function toIdMarkdownFilename(id?: string): string | undefined {
  if (typeof id !== "string") return undefined;
  const trimmed = id.trim();
  if (!trimmed) return undefined;
  const safe = trimmed
    .replace(/[<>:"/\\|?*\x00-\x1F]/g, "-")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^[-.]+|[-.]+$/g, "");
  if (!safe) return undefined;
  return `${safe}.md`;
}

const IMAGE_EXT = new Set(["png", "jpg", "jpeg", "gif", "webp"]);
const MAX_EMBEDDED_IMAGES = 25;
const MAX_EMBEDDED_BYTES = 2 * 1024 * 1024;

function mimeFromExt(ext: string): string {
  const e = ext.toLowerCase();
  if (e === "jpg" || e === "jpeg") return "image/jpeg";
  if (e === "png") return "image/png";
  if (e === "gif") return "image/gif";
  if (e === "webp") return "image/webp";
  return "application/octet-stream";
}

function arrayBufferToBase64(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.byteLength; i += 1) {
    binary += String.fromCharCode(bytes[i]!);
  }
  return btoa(binary);
}

function resolveImageFile(app: App, source: TFile, linkpath: string): TFile | null {
  const t = linkpath.trim();
  if (!t) return null;
  const fromMeta = app.metadataCache.getFirstLinkpathDest(t, source.path);
  if (fromMeta instanceof TFile) return fromMeta;
  const parent = source.parent?.path ?? "";
  const joined = parent ? normalizePath(`${parent}/${t}`) : normalizePath(t);
  const f = app.vault.getAbstractFileByPath(joined);
  return f instanceof TFile ? f : null;
}

type EmbeddedPart = { replace: string; data: string; mime: string };

async function collectEmbeddedImagesFromNote(
  app: App,
  source: TFile,
  markdown: string
): Promise<EmbeddedPart[]> {
  const out: EmbeddedPart[] = [];
  const seen = new Set<string>();

  const wikiRe = /!\[\[([^\]|]+)(?:\|[^\]]*)?\]\]/g;
  let m: RegExpExecArray | null;
  while ((m = wikiRe.exec(markdown)) !== null) {
    const full = m[0];
    if (seen.has(full)) continue;
    const name = m[1].trim();
    const img = resolveImageFile(app, source, name);
    if (!(img instanceof TFile)) continue;
    const ext = img.extension.toLowerCase();
    if (!IMAGE_EXT.has(ext)) continue;
    const buf = await app.vault.readBinary(img);
    if (buf.byteLength > MAX_EMBEDDED_BYTES) {
      new Notice(`ESP32Cube: skip large image ${img.name} (>2MB)`);
      continue;
    }
    seen.add(full);
    out.push({ replace: full, data: arrayBufferToBase64(buf), mime: mimeFromExt(ext) });
    if (out.length >= MAX_EMBEDDED_IMAGES) break;
  }

  if (out.length < MAX_EMBEDDED_IMAGES) {
    const mdRe = /!\[([^\]]*)\]\(([^)]+)\)/g;
    while ((m = mdRe.exec(markdown)) !== null) {
      const full = m[0];
      if (seen.has(full)) continue;
      let src = m[2].trim();
      if (src.startsWith("<") && src.endsWith(">")) {
        src = src.slice(1, -1).trim();
      }
      if (/^https?:\/\//i.test(src) || /^data:/i.test(src)) continue;
      try {
        src = decodeURIComponent(src);
      } catch {
        /* keep encoded */
      }
      const img = resolveImageFile(app, source, src);
      if (!(img instanceof TFile)) continue;
      const ext = img.extension.toLowerCase();
      if (!IMAGE_EXT.has(ext)) continue;
      const buf = await app.vault.readBinary(img);
      if (buf.byteLength > MAX_EMBEDDED_BYTES) {
        new Notice(`ESP32Cube: skip large image ${img.name} (>2MB)`);
        continue;
      }
      seen.add(full);
      out.push({ replace: full, data: arrayBufferToBase64(buf), mime: mimeFromExt(ext) });
      if (out.length >= MAX_EMBEDDED_IMAGES) break;
    }
  }

  return out;
}

function normalizeTags(raw: unknown): string[] {
  if (Array.isArray(raw)) {
    return raw.map((t) => String(t).trim()).filter(Boolean);
  }
  if (typeof raw === "string") {
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }
  return [];
}

class Esp32CubeSettingTab extends PluginSettingTab {
  plugin: Esp32CubePublishPlugin;

  constructor(app: App, plugin: Esp32CubePublishPlugin) {
    super(app, plugin);
    this.plugin = plugin;
  }

  display(): void {
    const { containerEl } = this;
    containerEl.empty();

    containerEl.createEl("h2", { text: "ESP32Cube Publish" });

    new Setting(containerEl)
      .setName("API base URL")
      .setDesc("Site origin without trailing slash (e.g. http://localhost:3000).")
      .addText((t) =>
        t
          .setPlaceholder("http://localhost:3000")
          .setValue(this.plugin.settings.apiBaseUrl)
          .onChange(async (v) => {
            this.plugin.settings.apiBaseUrl = v.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("User email")
      .setDesc(
        "Your account email. Sent as X-Publish-Email and in the JSON body as email. Match this in your API route."
      )
      .addText((t) =>
        t
          .setPlaceholder("you@example.com")
          .setValue(this.plugin.settings.email)
          .onChange(async (v) => {
            this.plugin.settings.email = v.trim();
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Default category slug")
      .setDesc("Prisma Category.slug when the note has no category in frontmatter.")
      .addText((t) =>
        t
          .setPlaceholder("tutorial")
          .setValue(this.plugin.settings.defaultCategorySlug)
          .onChange(async (v) => {
            this.plugin.settings.defaultCategorySlug = v.trim() || "tutorial";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Default status")
      .setDesc("draft or published if the note omits status in YAML.")
      .addDropdown((d) =>
        d
          .addOption("draft", "draft")
          .addOption("published", "published")
          .setValue(this.plugin.settings.defaultStatus)
          .onChange(async (v) => {
            this.plugin.settings.defaultStatus = v as "draft" | "published";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Sync folder (pull)")
      .setDesc("Relative path in the vault where “Pull articles from site” writes .md files.")
      .addText((t) =>
        t
          .setPlaceholder("ESP32Cube")
          .setValue(this.plugin.settings.syncFolder)
          .onChange(async (v) => {
            this.plugin.settings.syncFolder = v.trim() || "ESP32Cube";
            await this.plugin.saveSettings();
          })
      );

    new Setting(containerEl)
      .setName("Pull scope")
      .setDesc("all = entire site (your account must be admin on the server).")
      .addDropdown((d) =>
        d
          .addOption("my", "my articles")
          .addOption("all", "all articles (admin)")
          .setValue(this.plugin.settings.pullScope)
          .onChange(async (v) => {
            this.plugin.settings.pullScope = v as "my" | "all";
            await this.plugin.saveSettings();
          })
      );
  }
}
