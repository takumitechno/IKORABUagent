import fs from "node:fs";
import path from "node:path";
import { isPubliclyVisible, parseArticleFile } from "./parse";
import { scoreMatch, sortByNewest, toSummary, type ContentRepository } from "./repository";
import type { Article, Category } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content");

/** content/ 配下の全記事を status に関係なく読む（pipeline・テスト用） */
export function loadAllArticles(contentDir = CONTENT_DIR): Article[] {
  const articles: Article[] = [];
  for (const dir of ["articles", "news"]) {
    const full = path.join(/*turbopackIgnore: true*/ contentDir, dir);
    if (!fs.existsSync(full)) continue;
    for (const file of fs.readdirSync(full).filter((f) => f.endsWith(".md")).sort()) {
      const raw = fs.readFileSync(path.join(/*turbopackIgnore: true*/ full, file), "utf8");
      articles.push(parseArticleFile(raw, file.replace(/\.md$/, "")));
    }
  }
  return articles;
}

export function loadCategories(contentDir = CONTENT_DIR): Category[] {
  const raw = JSON.parse(fs.readFileSync(path.join(/*turbopackIgnore: true*/ contentDir, "categories.json"), "utf8")) as Array<Record<string, unknown>>;
  return raw
    .map((c) => ({
      slug: String(c.slug),
      name: String(c.name),
      description: String(c.description),
      icon: String(c.icon),
      sortOrder: Number(c.sort_order),
    }))
    .sort((a, b) => a.sortOrder - b.sortOrder);
}

export class LocalContentRepository implements ContentRepository {
  constructor(
    private readonly contentDir = CONTENT_DIR,
    private readonly now: () => Date = () => new Date(),
  ) {}

  private published(): Article[] {
    const today = this.now();
    return sortByNewest(loadAllArticles(this.contentDir).filter((a) => isPubliclyVisible(a, today)));
  }

  async listCategories() {
    return loadCategories(this.contentDir);
  }

  async listArticles(options: Parameters<ContentRepository["listArticles"]>[0] = {}) {
    let items = this.published();
    if (options.kind) items = items.filter((a) => a.kind === options.kind);
    if (options.category) items = items.filter((a) => a.categories.includes(options.category!));
    if (options.featured) items = items.filter((a) => a.featured);
    if (options.limit) items = items.slice(0, options.limit);
    return items.map(toSummary);
  }

  async getArticle(slug: string) {
    return this.published().find((a) => a.slug === slug) ?? null;
  }

  async search(query: string) {
    return this.published()
      .map((a) => ({ a, score: scoreMatch(a, query) }))
      .filter((x) => x.score > 0)
      .sort((x, y) => y.score - x.score)
      .map((x) => toSummary(x.a));
  }
}
