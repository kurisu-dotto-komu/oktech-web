// Shared utility for extracting markdown content
export function extractMarkdownContent(rawContent: () => string): string {
  try {
    const fullContent = rawContent();
    const contentWithoutFrontmatter = fullContent.replace(/^---[\s\S]*?---\s*/, "");
    return contentWithoutFrontmatter.trim();
  } catch {
    return "";
  }
}
