import Footer from "./_components/Footer";
import Heading from "./_components/Heading";
import Heroes from "./_components/Heroes";

export default function MarketingPage() {
  return (
    <div className="min-h-full flex flex-col">
      <div className="flex flex-col items-center justify-center md:justify-start text-center  flex-1  gap-y-6   px-5">
        <Heading />
        <Heroes />
      </div>
      <Footer />
    </div>
  );
}
