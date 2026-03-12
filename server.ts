import express from "express";
import { createServer as createViteServer } from "vite";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: '10mb' }));

  // API to save configuration back to App.tsx
  app.post("/api/save-config", (req, res) => {
    try {
      const { devices, plans } = req.body;
      const appPath = path.join(__dirname, "App.tsx");
      let content = fs.readFileSync(appPath, "utf-8");

      // Helper to format data as code string
      const formatAsCode = (data: any[], type: 'SktDevice' | 'SktPlan') => {
        const lines = data.map(item => {
          const entries = Object.entries(item).map(([key, value]) => {
            let formattedValue = value;
            if (typeof value === 'string') {
              formattedValue = `'${value}'`;
            } else if (typeof value === 'object' && value !== null) {
              const innerEntries = Object.entries(value).map(([k, v]) => {
                const val = typeof v === 'string' ? `'${v}'` : v;
                return `'${k}': ${val}`;
              });
              formattedValue = `{ ${innerEntries.join(', ')} }`;
            }
            return `${key}: ${formattedValue}`;
          });
          return `  { ${entries.join(', ')} },`;
        });
        return `const DEFAULT_${type === 'SktDevice' ? 'DEVICES' : 'PLANS'}: ${type}[] = [\n${lines.join('\n')}\n];`;
      };

      const devicesCode = formatAsCode(devices, 'SktDevice');
      const plansCode = formatAsCode(plans, 'SktPlan');

      console.log(`[API] Saving config to ${appPath}`);

      // Replace DEFAULT_DEVICES
      const devicesRegex = /const DEFAULT_DEVICES: SktDevice\[\] = \[[\s\S]*?\];/;
      if (devicesRegex.test(content)) {
        content = content.replace(devicesRegex, devicesCode);
      } else {
        console.warn("[API] DEFAULT_DEVICES regex match failed");
      }

      // Replace DEFAULT_PLANS
      const plansRegex = /const DEFAULT_PLANS: SktPlan\[\] = \[[\s\S]*?\];/;
      if (plansRegex.test(content)) {
        content = content.replace(plansRegex, plansCode);
      } else {
        console.warn("[API] DEFAULT_PLANS regex match failed");
      }

      fs.writeFileSync(appPath, content, "utf-8");
      console.log("[API] App.tsx updated successfully");
      res.json({ success: true, message: "Source code updated successfully" });
    } catch (error) {
      console.error("Failed to save config:", error);
      res.status(500).json({ success: false, error: String(error) });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
