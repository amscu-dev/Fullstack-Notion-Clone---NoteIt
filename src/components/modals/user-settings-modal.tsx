"use client";

import { Dialog, DialogContent } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { onCloseUserModal } from "@/store/slices/userSettingSlice";
import { UserProfile } from "@clerk/clerk-react";

function UserSettingsModal() {
  const { isOpen } = useAppSelector((state) => state.userSettings);
  const dispatch = useAppDispatch();

  const handleOpenChange = () => {
    dispatch(onCloseUserModal());
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogContent className={cn("max-w-none w-auto p-[-45px]")}>
        <UserProfile />
      </DialogContent>
    </Dialog>
  );
}

export default UserSettingsModal;
