import type { APIRoute } from "astro";
import { getExperiences } from "../lib/firebase/database";

const SITE = "https://genexperiencias.netlify.app";

function toISODate(val: unknown, fallback: string): string {
  try {
    if (!val) return fallback;
    // Firestore Timestamp object con .toDate()
    if (typeof val === "object" && val !== null && "toDate" in val) {
      return (val as { toDate: () => Date }).toDate().toISOString().split("T")[0];
    }
    // Firestore Timestamp con .seconds
    if (typeof val === "object" && val !== null && "seconds" in val) {
      return new Date((val as { seconds: number }).seconds * 1000).toISOString().split("T")[0];
    }
    // Número en milisegundos
    if (typeof val === "number" && !isNaN(val)) {
      return new Date(val).toISOString().split("T")[0];
    }
  } catch {}
  return fallback;
}

const staticRoutes = [
  { url: "/", priority: "1.0", changefreq: "weekly" },
  { url: "/experiencias", priority: "0.9", changefreq: "daily" },
  { url: "/hablemos", priority: "0.7", changefreq: "monthly" },
  { url: "/planes", priority: "0.6", changefreq: "monthly" },
  { url: "/ecosistema", priority: "0.6", changefreq: "monthly" },
];

export const GET: APIRoute = async () => {
  let experiences: { uid: string; updatedAt?: number }[] = [];

  try {
    const all = await getExperiences();
    experiences = all.filter((e) => e.visible === true);
  } catch {
    // si Firestore falla, el sitemap igual se devuelve con las rutas estáticas
  }

  const now = new Date().toISOString().split("T")[0];

  const staticEntries = staticRoutes
    .map(
      (r) => `
  <url>
    <loc>${SITE}${r.url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
    )
    .join("");

  const experienceEntries = experiences
    .map((exp) => {
      const lastmod = toISODate(exp.updatedAt, now);
      return `
  <url>
    <loc>${SITE}/experiencias/${exp.uid}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`;
    })
    .join("");

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticEntries}
${experienceEntries}
</urlset>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
};
