import { SheetTrigger } from "@/components/ui/sheet";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import { Menu } from "lucide-react";

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
        <p>Menu</p>
      </TooltipContent>
    </Tooltip>
  )
}