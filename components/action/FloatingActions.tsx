import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Plus, PlusCircle } from "lucide-react";
import QuickActions from "./QuickActions";

function FloatingActions() {
  return (
    <Popover>
      <PopoverTrigger className="flex size-16 items-center justify-center rounded-full bg-black/90 backdrop-blur-sm border border-white/10 p-2 shadow-lg hover:border-main-cyan/20 hover:shadow-main-cyan/10 hover:scale-105 transition-all duration-300">
        <PlusCircle color="#16a34a" className="size-14" />
      </PopoverTrigger>
      <PopoverContent className="mr-12 w-[200px] border-white/5 bg-black/95 backdrop-blur-sm shadow-xl">
        <QuickActions isHorizontal />
      </PopoverContent>
    </Popover>
  );
}

export default FloatingActions;
