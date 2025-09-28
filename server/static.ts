import express from "express";
import path from "path";
import fs from "fs";

export function serveStatic(app: express.Express) {
  const distPath = path.resolve("dist/public");
  const clientDistPath = path.resolve("client/dist");
  
  // Check if either dist/public or client/dist exists
  const staticPath = fs.existsSync(distPath) ? distPath : 
                   (fs.existsSync(clientDistPath) ? clientDistPath : null);

  if (!staticPath) {
    console.warn(`Build directory not found: ${distPath} or ${clientDistPath}`);
    return;
  }

  console.log(`Serving static files from: ${staticPath}`);
  app.use(express.static(staticPath));

  // Fallback to index.html for SPA routing
  app.use("*", (_req, res) => {
    const indexPath = path.join(staticPath, "index.html");
    if (fs.existsSync(indexPath)) {
      res.sendFile(indexPath);
    } else {
      res.status(404).send('Index.html not found');
    }
  });
}
