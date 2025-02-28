"use client";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useTheme } from "next-themes";

interface IconPickerProps {
  onChange: (icon: string) => void;
  children: React.ReactNode;
  asChild?: boolean;
}
function IconPicker({ onChange, asChild, children }: IconPickerProps) {
  const { resolvedTheme } = useTheme();

  return (
    <Popover>
      <PopoverTrigger asChild={asChild}>{children}</PopoverTrigger>
      <PopoverContent className="p-0 w-full border-none shadow-none" forceMount>
        <Picker
          data={data}
          theme={resolvedTheme}
          onEmojiSelect={(data) => onChange(data.native)}
        />
      </PopoverContent>
    </Popover>
  );
}

export default IconPicker;
