import Link from "next/link";
import { CASES } from "./data/cases";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 gap-8">
      <h1 className="text-3xl font-bold mb-8">Choose a Case</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
        {CASES.map((c) => (
          <Link key={c.slug} href={`/case/${c.slug}`} className="block border border-gray-200 outline-4 outline-transparent hover:outline-gray-100 rounded-lg p-6 transition-all bg-white text-black">
            <div className="flex flex-col items-center text-center justify-center gap-2">
              <span className="text-xl font-semibold">{c.purpose}</span>
              <span className="text-sm opacity-50">{c.shortDescription}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
