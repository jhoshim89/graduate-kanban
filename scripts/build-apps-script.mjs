import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { basename, join, resolve } from "node:path";

const root = resolve(new URL("..", import.meta.url).pathname);
const distDir = join(root, "dist");
const appsScriptDir = join(root, "apps-script");
const htmlPath = join(distDir, "index.html");
const outPath = join(appsScriptDir, "Index.html");

let html = readFileSync(htmlPath, "utf8");

html = html.replace(
  /<script type="module"[^>]*src="([^"]+)"[^>]*><\/script>/,
  (_, src) => {
    const js = readFileSync(join(distDir, "assets", basename(src)), "utf8");
    return `<script type="module">\n${js}\n</script>`;
  }
);

html = html.replace(
  /<link rel="stylesheet"[^>]*href="([^"]+)"[^>]*>/,
  (_, href) => {
    const css = readFileSync(join(distDir, "assets", basename(href)), "utf8");
    return `<style>\n${css}\n</style>`;
  }
);

if (!html.includes("<base target=\"_top\">")) {
  html = html.replace("</head>", "  <base target=\"_top\">\n</head>");
}

mkdirSync(appsScriptDir, { recursive: true });
writeFileSync(outPath, html);
console.log(`Wrote ${outPath}`);
