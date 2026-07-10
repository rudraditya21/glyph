import { Menu } from "lucide-react";

import { SheetTrigger } from "@/components/ui/sheet";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SidebarTrigger() {
  return (
    <Tooltip>
      <TooltipTrigger>
        <SheetTrigger>
          <div className="border p-3 bg-background rounded-full">
            <Menu className="w-4 h-4" />
          </div>
        </SheetTrigger>
      </TooltipTrigger>
      <TooltipContent side="left">
        <p>Catalog</p>
      </TooltipContent>
    </Tooltip>
  );
}
