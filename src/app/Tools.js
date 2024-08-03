import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardTitle } from "@/components/ui/card";


export default function Tools() {
    let tools = [
        {
          name: "Markdown to HTML",
          description: "Convert markdown to HTML",
          url: "https://sopkit.github.io/markdown-to-html/",
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
            url2:"https://daily-todo-app.pages.dev/",
            image: "",
        },{
            name: "Audio Recorder",
            description: "An Audio Recorder with Pause and Download Functionality Using JavaScript",
            url: "https://sopkit.github.io/audio-recorder/",
        }
    ];

    return (

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-10">
            {tools.map((tool, i) => (
                <Card key={i} className="shadow-lg pt-4">
                    <CardContent>
                        <CardTitle>{tool.name}</CardTitle>
                        <CardDescription>{tool.description}</CardDescription>
                    </CardContent>
                    <CardFooter>
                        <Button  target="_blank">
                            <a href={tool.url} >
                            Visit
                            </a>
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
