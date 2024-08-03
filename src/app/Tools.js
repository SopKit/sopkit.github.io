import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardTitle,
} from "@/components/ui/card";

export default function Tools() {
  let tools = [
    {
      name: "Markdown to HTML",
      description: "Convert markdown to HTML",
      url: "https://sopkit.github.io/markdown-to-html/",
      image: "",
    },
    {
      name: "Encoding",
      description: "Encoding and Decoding Tool",
      url: "https://sopkit.github.io/Encoding/",
      image: "",
    },
    {
      name: "Web Tools",
      description: "Web Tools",
      url: "https://sopkit.github.io/tools/",
      image: "",
    },
    {
      name: "HTML to Markdown",
      description: "Convert HTML to markdown",
      url: "https://sopkit.github.io/markdown-to-html/",
      image: "",
    },
    {
      name: "HTML to JSX",
      description: "Convert HTML to JSX",
      url: "https://sopkit.github.io/html-to-jsx-converter/",
      image: "",
    },
    {
      name: "Toss a Coin",
      description: "Toss a coin",
      url: "https://sopkit.github.io/toss-a-coin/",
      image: "",
    },
    {
      name: "Play Piano",
      description: "Play Piano on Web",
      url: "https://sopkit.github.io/playable-piano/",
      image: "",
    },
    {
      name: "Daily Todo App",
      description: "Daily Todo App",
      url: "https://sopkit.github.io/daily-todo-app/",
      url2: "https://daily-todo-app.pages.dev/",
      image: "",
    },
    {
      name: "Audio Recorder",
      description:
        "An Audio Recorder with Pause and Download Functionality Using JavaScript",
      url: "https://sopkit.github.io/audio-recorder/",
    },
    {
      name: "Live Markdown Editor",
      description: "Live Markdown Editor",
      url: "https://sopkit.github.io/markdown-editor/",
      image: "",
    },
    {
      //https://sopkit.github.io/file-converter/
      name: "File Converter",
      description:
        "The ultimate online tool for unlimited and free multimedia conversion. Transform images, audio, and videos effortlessly, without restrictions.",
      url: "https://sopkit.github.io/file-converter/",
      image: "",
    },
  ];

  const otherTools = [
    {
        //https://sopkit.github.io/css-custom-scrollbar-maker/
        name: "CSS Custom Scrollbar Maker",
        description:
          "Create custom scrollbars using CSS. Generate your own scrollbar style with this online tool.",
        url: "https://sopkit.github.io/css-custom-scrollbar-maker/",
        image: "",
    }
    ];

  return <>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {tools.map((tool, i) => (
        <Card key={i} className="shadow-lg pt-4">
          <CardContent>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button target="_blank">
              <a href={tool.url}>Visit</a>
            </Button>
          </CardFooter>
        </Card>
      ))}
    </div>
    <div className=" mt-10">
            <h1 className=" text-2xl ">Other Tools</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
      {otherTools.map((tool, i) => (
        <Card key={i} className="shadow-lg pt-4">
          <CardContent>
            <CardTitle>{tool.name}</CardTitle>
            <CardDescription>{tool.description}</CardDescription>
          </CardContent>
          <CardFooter>
            <Button target="_blank">
              <a href={tool.url}>Visit</a>
            </Button>
          </CardFooter>
        </Card>
        ))}
    </div>
    </div>

      </>
}
