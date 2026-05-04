const fs = require("fs-extra");
const path = require("path");
const { minify } = require("html-minifier-terser");
const CleanCSS = require("clean-css");
const sass = require("sass");

const sourceSite = path.join(__dirname, "site");
const sourceAssets = path.join(__dirname, "assets");
const sourceScss = path.join(__dirname, "scss", "style.scss");
const dist = path.join(__dirname, "dist");
const distCss = path.join(dist, "css");
const distAssets = path.join(dist, "assets");

async function build() {
  await fs.remove(dist);
  await fs.ensureDir(dist);
  await fs.ensureDir(distCss);

  const scssResult = sass.compile(sourceScss);
  const minifiedCss = new CleanCSS().minify(scssResult.css).styles;
  await fs.writeFile(path.join(distCss, "style.css"), minifiedCss);

  const files = await fs.readdir(sourceSite);

  for (const file of files) {
    if (!file.endsWith(".html")) continue;

    const htmlPath = path.join(sourceSite, file);
    const html = await fs.readFile(htmlPath, "utf8");

    const minifiedHtml = await minify(html, {
      collapseWhitespace: true,
      removeComments: true,
      removeRedundantAttributes: true,
      removeEmptyAttributes: true,
      minifyCSS: true,
      minifyJS: true
    });

    await fs.writeFile(path.join(dist, file), minifiedHtml);
  }

  await fs.copy(sourceAssets, distAssets);

  console.log("Build finished. Files are ready in /dist");
}

build().catch((error) => {
  console.error(error);
  process.exit(1);
});
