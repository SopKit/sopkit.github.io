import toolsList from "@/data/tools.json";

export const dynamic = "force-static";

export default async function sitemap() {
  const baseUrl = "https://sopkit.github.io";

  // Static routes
  const routes = ["", "/about", "/tool", "/privacy", "/terms"].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: route === "" ? 1 : 0.8,
  }));

  // Dynamic tool routes from registry
  const toolRoutes = toolsList.map((tool) => {
    const url = tool.link.startsWith("http")
      ? tool.link
      : `${baseUrl}${tool.link}`;

    return {
      url,
      lastModified: new Date().toISOString(),
      changeFrequency: "weekly",
      priority: tool.featured ? 0.9 : 0.7,
    };
  });

  return [...routes, ...toolRoutes];
}
