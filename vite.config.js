import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    {
      name: "api-serverless-dev-middleware",
      configureServer(server) {
        server.middlewares.use(async (req, res, next) => {
          if (req.url && req.url.startsWith("/api/")) {
            const url = new URL(req.url, "http://localhost");
            const endpoint = url.pathname.replace("/api/", "").split("?")[0];
            try {
              const handlerModule = await import(`./api/${endpoint}.js`);
              const query = Object.fromEntries(url.searchParams);
              req.query = query;

              let statusCode = 200;
              res.status = function (code) {
                statusCode = code;
                return res;
              };
              res.json = function (data) {
                res.writeHead(statusCode, {
                  "Content-Type": "application/json",
                });
                res.end(JSON.stringify(data));
              };

              if (req.method === "POST") {
                let bodyStr = "";
                req.on("data", (chunk) => {
                  bodyStr += chunk;
                });
                req.on("end", async () => {
                  try {
                    req.body = bodyStr ? JSON.parse(bodyStr) : {};
                  } catch {
                    req.body = {};
                  }
                  await handlerModule.default(req, res);
                });
                return;
              }

              await handlerModule.default(req, res);
              return;
            } catch (err) {
              console.error(
                `Dev API handler error for /api/${endpoint}:`,
                err.message,
              );
              res.writeHead(404, { "Content-Type": "application/json" });
              res.end(
                JSON.stringify({
                  success: false,
                  error: `Endpoint /api/${endpoint} not found or errored: ${err.message}`,
                }),
              );
              return;
            }
          }
          next();
        });
      },
    },
  ],
});
