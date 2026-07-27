// Exposes the newest blog posts to the home page as global plugin data.
//
// Docusaurus 3.0 has no supported way to read another plugin's processed
// content (the allContentLoaded lifecycle arrived later), so this plugin reads
// the blog folder directly in its own loadContent lifecycle: dated post
// directories (YYYY-MM-DD-*/index.md), title/slug from frontmatter, and the
// first prose paragraph as the excerpt. The LatestNews component renders the
// result. Because every release ships a blog post, the home page news section
// maintains itself.
const fs = require("fs");
const path = require("path");

const POST_DIR_PATTERN = /^(\d{4})-(\d{2})-(\d{2})-(.+)$/;

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const fields = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^(\w+):\s*(.+)$/);
    if (kv) fields[kv[1]] = kv[2].trim().replace(/^["']|["']$/g, "");
  }
  return fields;
}

function firstParagraph(raw) {
  const body = raw.replace(/^---\r?\n[\s\S]*?\r?\n---/, "");
  for (const block of body.split(/\r?\n\s*\r?\n/)) {
    const text = block.trim();
    // Skip images, imports, headings, and the truncate marker.
    if (!text || text.startsWith("![") || text.startsWith("<") || text.startsWith("#") || text.startsWith("import ")) {
      continue;
    }
    return text
      .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1") // links -> text
      .replace(/[*_`]/g, "")
      .replace(/\s+/g, " ")
      .trim();
  }
  return "";
}

module.exports = function recentBlogPostsPlugin(context) {
  return {
    name: "recent-blog-posts",
    async loadContent() {
      const blogDir = path.join(context.siteDir, "blog");
      if (!fs.existsSync(blogDir)) return [];
      return fs
        .readdirSync(blogDir, { withFileTypes: true })
        .filter((entry) => entry.isDirectory() && POST_DIR_PATTERN.test(entry.name))
        .map((entry) => {
          const indexPath = path.join(blogDir, entry.name, "index.md");
          if (!fs.existsSync(indexPath)) return null;
          const raw = fs.readFileSync(indexPath, "utf8");
          const fm = parseFrontmatter(raw);
          const [, year, month, day, name] = entry.name.match(POST_DIR_PATTERN);
          const permalink = fm.slug
            ? `/blog/${fm.slug}`
            : `/blog/${year}/${month}/${day}/${name}`; // docusaurus default for slugless dated posts
          return {
            title: fm.title || name,
            permalink,
            date: `${year}-${month}-${day}`,
            description: firstParagraph(raw),
          };
        })
        .filter(Boolean)
        .sort((a, b) => b.date.localeCompare(a.date))
        .slice(0, 3);
    },
    async contentLoaded({ content, actions }) {
      actions.setGlobalData({ posts: content });
    },
  };
};
