import { readFileSync, writeFileSync, readdirSync, statSync } from "fs";
import { join } from "path";

const TOOLS_JSON_PATH = "src/constants/tools.json";

function cleanName(id) {
  // Map common acronyms to full names for cleaner titles
  const replacements = {
    fb: "Facebook",
    ig: "Instagram",
    yt: "YouTube",
    pfp: "Profile Picture",
    mp4: "MP4",
    mp3: "MP3",
    ats: "ATS",
    gpa: "GPA",
    sgpa: "SGPA",
    ssc: "SSC",
    upsc: "UPSC",
    neet: "NEET",
  };

  return id
    .split("-")
    .map((word) => {
      if (replacements[word.toLowerCase()]) {
        return replacements[word.toLowerCase()];
      }
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");
}

function run() {
  const json = JSON.parse(readFileSync(TOOLS_JSON_PATH, "utf8"));
  const dirs = readdirSync("src/app/(downloaders)").filter((f) =>
    statSync(join("src/app/(downloaders)", f)).isDirectory()
  );

  const existingRoutes = new Set();
  Object.values(json.categories).forEach((cat) => {
    (cat.tools || []).forEach((t) => {
      if (t.route) existingRoutes.add(t.route.toLowerCase());
    });
  });

  let count = 0;
  for (const dir of dirs) {
    const route = `/${dir}`.toLowerCase();
    if (existingRoutes.has(route)) {
      continue;
    }

    const name = cleanName(dir);
    let category = "video";
    const dirLower = dir.toLowerCase();
    
    if (
      dirLower.includes("youtube") ||
      dirLower.includes("shorts") ||
      dirLower.includes("thumbnail")
    ) {
      category = "youtube";
    } else if (
      dirLower.includes("mp3") ||
      dirLower.includes("audio") ||
      dirLower.includes("sound") ||
      dirLower.includes("gaana") ||
      dirLower.includes("podcast") ||
      dirLower.includes("music")
    ) {
      category = "audio";
    }

    // Build the metadata object matching tools.json schema
    const toolMeta = {
      id: dir,
      name: name,
      description: `Free, high-speed online downloader to save and download media content from platforms using the ${name}. No registration, 100% secure client-side browser processing.`,
      route: `/${dir}`,
      category: category,
      popular: false,
      extraSlugs: [
        `${dir}-free`,
        `${dir}-online`,
        `free-${dir}-no-signup`,
        `best-${dir}-online`,
        `${dir}-downloader-tool`
      ],
      features: [
        `Download media instantly from the host site`,
        `High quality MP4, MP3, or image extraction where supported`,
        `No signup or account registration required`,
        `Unlimited downloads without daily caps`,
        `100% private - data processed locally in your browser`,
        `Responsive layout - works on desktop, tablet, and mobile`
      ],
      faqs: [
        {
          question: `Is this ${name} free to use?`,
          answer: `Yes, the ${name} is completely free. There are no paid plans, premium limits, or hidden subscriptions.`
        },
        {
          question: `Do I need to sign up or create an account?`,
          answer: `No. You can start using the downloader instantly without providing email addresses or credentials.`
        },
        {
          question: `Does the tool store my downloaded files?`,
          answer: `Never. All operations are processed on the client side. Your downloaded files go directly from the provider servers to your local storage.`
        }
      ],
      howTo: [
        {
          title: `Copy the URL`,
          description: `Navigate to the media post or video on the host platform and copy its URL to your clipboard.`
        },
        {
          title: `Paste into Downloader`,
          description: `Paste the copied link into the input field at the top of this page.`
        },
        {
          title: `Download Media`,
          description: `Click the download/convert button and select your preferred quality options to save the file locally.`
        }
      ],
      article: `\n## About ${name}\n\n${name} is a fast and simple browser utility that lets you save content to your local device directly. Our suite focuses on high performance and maximum privacy, processing inputs locally without hosting tracking parameters.\n\n### Why Use SopKit for Downloads?\n\n- **Zero Logs**: We never save or trace download history.\n- **Speed**: Downloads start instantly at max server speed.\n- **Universal Support**: Works across Android, iOS, Windows, and macOS.`
    };

    if (!json.categories[category]) {
      json.categories[category] = {
        name: category.charAt(0).toUpperCase() + category.slice(1),
        slug: category,
        tools: []
      };
    }

    json.categories[category].tools.push(toolMeta);
    count++;
  }

  // Update total counts
  let totalTools = 0;
  Object.values(json.categories).forEach((cat) => {
    totalTools += (cat.tools || []).length;
  });
  json.metadata.totalTools = totalTools;
  json.metadata.lastUpdated = new Date().toISOString().split("T")[0];

  writeFileSync(TOOLS_JSON_PATH, JSON.stringify(json, null, 2), "utf8");
  console.log(`🎉 Successfully registered ${count} new downloader tools in ${TOOLS_JSON_PATH}!`);
  console.log(`📈 New total tools count: ${totalTools}`);
}

run();
