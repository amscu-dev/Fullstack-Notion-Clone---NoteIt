import { cn } from "@/lib/utils";
import { Poppins } from "next/font/google";
import Image from "next/image";

const font = Poppins({
  subsets: ["latin"],
  weight: ["400", "500"],
});

function Logo() {
  return (
    <div className="hidden md:flex items-center gap-x-2">
      <Image
        src="/logo.png"
        height="40"
        width="40"
        alt="Logo"
        className="dark:hidden"
      />
      <Image
        src="/logo-dark.png"
        height="40"
        width="40"
        alt="Logo"
        className="hidden dark:block"
      />
      <p className={cn("font-medium", font.className)}>NoteIt</p>
    </div>
  );
}

export default Logo;
