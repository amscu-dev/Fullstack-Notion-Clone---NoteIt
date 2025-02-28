import Image from "next/image";

function Heroes() {
  return (
    <div className="flex flex-col items-center justify-center max-w-5xl">
      <div className="flex items-center gap-x-5">
        <div className="relative w-[150px] h-[150px] sm:w-[200px] sm:h-[200px] md:w-[250px] md:h-[250px]">
          <Image
            src="/document.png"
            className="object-contain dark:hidden"
            fill
            alt="Hero-image-1"
          />
          <Image
            src="/document-dark.png"
            className="object-contain hidden dark:block"
            fill
            alt="Hero-image-1"
          />
        </div>
        <div className="relative h-[250px] w-[250px] hidden md:block">
          <Image
            src="/reading.png"
            className="object-contain dark:hidden"
            fill
            alt="Hero-image-2"
          />
          <Image
            src="/reading-dark.png"
            className="object-contain hidden dark:block"
            fill
            alt="Hero-image-2"
          />
        </div>
      </div>
    </div>
  );
}

export default Heroes;
