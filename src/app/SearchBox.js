import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command";
import {
  CalendarIcon,
  EnvelopeClosedIcon,
  FaceIcon,
  GearIcon,
  PersonIcon,
  RocketIcon,
} from "@radix-ui/react-icons";
import Link from "next/link";

export const csvToJSON = (csv) => {
  const lines = csv.split("\n");
  const result = [];
  const headers = lines[0].split(",");

  for (let i = 1; i < lines.length; i++) {
    const obj = {};
    const currentline = lines[i].split(",");

    for (let j = 0; j < headers.length; j++) {
      obj[headers[j]] = currentline[j];
    }

    result.push(obj);
  }

  return result;
}

export async function Search() {
  const url =
    "https://docs.google.com/spreadsheets/d/e/2PACX-1vS7EF_2Yz5C_RbVKsSmOjWWTt2aDWmkb3A1PMbzqQwp8G-FbfxIKEfldhMcMBbdVzhljMSpGHuR7zHV/pub?gid=1011357919&single=true&output=csv";

  const response = await fetch(url);
  const csvData = await response.text();

  const data = csvToJSON(csvData);

  let tools = await fetch("https://docs.google.com/spreadsheets/d/e/2PACX-1vS7EF_2Yz5C_RbVKsSmOjWWTt2aDWmkb3A1PMbzqQwp8G-FbfxIKEfldhMcMBbdVzhljMSpGHuR7zHV/pub?gid=160311338&single=true&output=csv")
  tools = await tools.text()
  tools = csvToJSON(tools)
  return (
    <Command className="rounded-lg border shadow-md w-full">
      <CommandInput placeholder="Type a tool name or search..." />
      <CommandList>
        {data.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <>
            <CommandGroup heading="Top Tools">
              {tools.map((item) => (
                <Link href={item.link} key={item.slug} passHref>
                  <CommandItem>
                    <RocketIcon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                    <CommandShortcut>{item.title}</CommandShortcut>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
            <CommandGroup heading="Results">
              {data.map((item) => (
                <Link href={item.link} key={item.slug} passHref>
                  <CommandItem>
                    <FaceIcon className="mr-2 h-4 w-4" />
                    <span>{item.name}</span>
                    <CommandShortcut>{item.title}</CommandShortcut>
                  </CommandItem>
                </Link>
              ))}
            </CommandGroup>
          </>
        )}
      </CommandList>
    </Command>
  );
}
