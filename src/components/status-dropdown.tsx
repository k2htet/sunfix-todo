"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Funnel } from "lucide-react";
import { useQueryStates } from "nuqs";
import { searchParamsParser, Filter } from "@/lib/searchParams";

const StatusDropdown = () => {
  const [, setStatus] = useQueryStates(searchParamsParser);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size={"icon"} variant="outline">
          <Funnel />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>Filter</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={async () => await setStatus({ filter: Filter["all"] })}
        >
          All
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () =>
            await setStatus({ filter: Filter["inComplete"] })
          }
        >
          In Complete
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={async () => await setStatus({ filter: Filter["complete"] })}
        >
          Complete
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default StatusDropdown;
