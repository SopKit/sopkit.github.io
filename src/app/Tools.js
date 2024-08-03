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
          url: "https://sopkit.github.io/html-to-markdown/",
          image: "",
        },
        {
          name: "JSON to CSV",
          description: "Convert JSON to CSV",
          url: "https://sopkit.github.io/json-to-csv/",
          image: "",
        },
        {
          name: "CSV to JSON",
          description: "Convert CSV to JSON",
          url: "https://sopkit.github.io/csv-to-json/",
          image: "",
        },
        {
          name: "JSON to YAML",
          description: "Convert JSON to YAML",
          url: "https://sopkit.github.io/json-to-yaml/",
          image: "",
        },
        {
          name: "YAML to JSON",
          description: "Convert YAML to JSON",
          url: "https://sopkit.github.io/yaml-to-json/",
          image: "",
        },
        {
          name: "JSON to XML",
          description: "Convert JSON to XML",
          url: "https://sopkit.github.io/json-to-xml/",
          image: "",
        },
        {
          name: "XML to JSON",
          description: "Convert XML to JSON",
          url: "https://sopkit.github.io/xml-to-json/",
          image: "",
        },
        {
          name: "JSON to URL",
          description: "Convert JSON to URL",
          url: "https://sopkit.github.io/json-to-url/",
          image: "",
        },
        {
          name: "URL to JSON",
          description: "Convert URL to JSON",
          url: "https://sopkit.github.io/url-to-json/",
          image: "",
        },
        {
          name: "JSON to Query String",
          description: "Convert JSON to Query String",
          url: "https://sopkit.github.io/json-to-query-string/",
          image: "",
        },
        {
          name: "Query String to JSON",
          description: "Convert Query String to JSON",
          url: "https://sopkit.github.io/query-string-to-json/",
          image: "",
        },
        {
          name: "JSON to Base64",
          description: "Convert JSON to Base64",
          url: "https://sopkit.github.io/json-to-base64/",
          image: "",
        },
        {
          name: "Base64 to JSON",
          description: "Convert Base64 to JSON",
          url: "https://sopkit.github.io/base64-to-json/",
          image:"",
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
                        <Button as="a" href={tool.url} target="_blank">
                            Visit
                        </Button>
                    </CardFooter>
                </Card>
            ))}
        </div>
    );
}
