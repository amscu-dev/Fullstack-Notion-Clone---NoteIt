"use client";

import { Avatar, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAppDispatch } from "@/store/hooks";
import { onOpenUserModal } from "@/store/slices/userSettingSlice";
import { SignOutButton, useUser } from "@clerk/clerk-react";
import { ChevronsLeftRight, LogOut, Settings } from "lucide-react";

function UserItem() {
  const dispatch = useAppDispatch();
  const { user } = useUser();

  const handleOpenChange = () => {
    dispatch(onOpenUserModal());
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div
            role="button"
            className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
          >
            <div className="gap-x-2 flex items-center max-w-[150px]">
              <Avatar className="h-5 w-5">
                <AvatarImage src={user?.imageUrl} />
              </Avatar>
              <span className="text-start font-medium line-clamp-1">
                {user?.username}&apos;s NoteIt
              </span>
            </div>
            <ChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-80"
          // Dropdown-ul se aliniază la începutul (stânga) elementului părinte.
          align="start"
          // Adaugă un offset (deplasare) de 11px pe axa X față de poziția de aliniere (align).
          alignOffset={11}
          // Montează forțat componenta în DOM chiar și atunci când este invizibilă.
          // Util atunci când vrei să păstrezi dropdown-ul în structură pentru SEO, animații sau pentru a evita un flicker la deschidere.
          forceMount
        >
          <div className="flex flex-col space-y-4 p-2">
            <p className="text-xs font-medium leading-none text-muted-foreground">
              {user?.emailAddresses[0].emailAddress}
            </p>
            <div className="flex items-center gap-x-2">
              <div className="rounded-md bg-secondary p-1">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={user?.imageUrl} />
                </Avatar>
              </div>
              <div className="space-y-1">
                <p className="text-sm line-clamp-1">
                  {user?.username}&apos;s NoteIt
                </p>
              </div>
            </div>
          </div>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer text-muted-foreground"
          >
            <div role="button" onClick={handleOpenChange}>
              <Settings />
              User Settings
            </div>
          </DropdownMenuItem>
          <DropdownMenuItem
            asChild
            className="w-full cursor-pointer text-muted-foreground"
          >
            <SignOutButton>
              <div>
                <LogOut />
                Log out
              </div>
            </SignOutButton>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export default UserItem;
