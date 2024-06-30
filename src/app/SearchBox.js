import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator, CommandShortcut } from "@/components/ui/command";
import { CalendarIcon, EnvelopeClosedIcon, FaceIcon, GearIcon, PersonIcon, RocketIcon } from "@radix-ui/react-icons";
import Link from 'next/link';

export async function Search() {

    const url = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vS7EF_2Yz5C_RbVKsSmOjWWTt2aDWmkb3A1PMbzqQwp8G-FbfxIKEfldhMcMBbdVzhljMSpGHuR7zHV/pub?gid=1011357919&single=true&output=csv';

    const response = await fetch(url);
    const csvData = await response.text();
    const rows = csvData.split('\n');
    const headers = rows[0].split(',');
    const data = rows.slice(1).map(row => {
        const values = row.split(',');
        return headers.reduce((acc, header, index) => {
            acc[header] = values[index];
            return acc;
        }, {});
    });
  
  return (
    <Command className="rounded-lg border shadow-md w-full">
      <CommandInput 
        placeholder="Type a tool name or search..." 
      />
      <CommandList>
        {data.length === 0 ? (
          <CommandEmpty>No results found.</CommandEmpty>
        ) : (
          <>
            <CommandGroup heading="Results">
              {data.map(item => (
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

