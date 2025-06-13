import { PhoneIcon } from "lucide-react";
import { CASES } from "../../data/cases";
import Image from "next/image";

const c = CASES.find((c) => c.slug === "parcel-delivery");

export default function ParcelDeliveryPage() {
  if (!c) return null;
  return (
    <div className="max-w-[1024px] h-screen mx-auto flex justify-center items-center">
      <div className="flex flex-col md:flex-row items-center w-full justify-center bg-blue-100 rounded-2xl p-5">
        <div className="basis-1/2 h-[320px] relative">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-100/50 rounded-2xl" />
          <Image fill className="object-contain" src={"/images/3d-delivery.png"} alt={c.title} />
        </div>

        <span className="basis-1/2">
          <div className="flex flex-col items-start text-left gap-2 p-5">
            <span className="text-2xl font-bold">{c.title}</span>
            <span className="text-lg opacity-70 max-w-md">{c.description}</span>
            <button className={`max-md:w-full cursor-pointer bg-blue-400 text-white text-lg font-medium transition-all px-4 py-2 rounded-full mt-5 flex items-center justify-center gap-2 hover:bg-blue-400/80 hover:scale-105`}>
              <PhoneIcon className="w-5 h-5" /> Call us
            </button>
          </div>
        </span>
      </div>
    </div>
  );
}
