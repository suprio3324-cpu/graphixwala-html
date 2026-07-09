const http = require("http");
const fs = require("fs");
const path = require("path");

const root = process.cwd();
const port = Number(process.env.PORT || 5500);
const host = "127.0.0.1";

const types = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".xml": "application/xml; charset=utf-8",
  ".txt": "text/plain; charset=utf-8",
};

http
  .createServer((req, res) => {
    const rawPath = decodeURIComponent((req.url || "/").split("?")[0]);
    let filePath = path.resolve(root, rawPath === "/" ? "index.html" : `.${rawPath}`);

    if (!filePath.startsWith(root)) {
      res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Forbidden");
      return;
    }

    fs.stat(filePath, (statError, stat) => {
      if (!statError && stat.isDirectory()) {
        filePath = path.join(filePath, "index.html");
      }

      fs.readFile(filePath, (readError, data) => {
        if (readError) {
          res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
          res.end("Not found");
          return;
        }

        res.writeHead(200, {
          "Content-Type": types[path.extname(filePath).toLowerCase()] || "application/octet-stream",
        });
        res.end(data);
      });
    });
  })
  .listen(port, host, () => {
    console.log(`Static server running at http://${host}:${port}/`);
  });
