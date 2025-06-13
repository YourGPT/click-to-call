import { CASES } from "../../data/cases";
import Image from "next/image";

const c = CASES.find((c) => c.slug === "website-development");

export default function WebsiteDevelopmentPage() {
  if (!c) return null;
  return (
    <div className="flex flex-col md:flex-row items-center gap-10 w-full p-10 max-w-[1250px] mx-auto min-h-screen justify-center">
      <span className="basis-1/2">
        <div className="flex flex-col items-start text-left gap-4">
          <span className="text-2xl font-bold">{c.title}</span>
          <span className="opacity-70 max-w-md">{c.description}</span>
          <button className={`max-md:w-full cursor-pointer ${c.buttonClass}`}>{c.button}</button>
        </div>
      </span>
      <Image width={400} height={400} className="basis-1/2 max-w-[450px]" src={c.image} alt={c.title} />
    </div>
  );
}
