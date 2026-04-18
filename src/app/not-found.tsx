import Link from "next/link";
import { MoveLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="p-6">
        <Link href="/" className="text-2xl font-bold tracking-tight text-black">
          roamie
        </Link>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <h1 className="text-[12rem] font-bold text-gray-100 leading-none">
          404
        </h1>
        <div className="relative -mt-20">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Page not found
          </h2>
          <p className="text-gray-500 text-lg mb-8 max-w-xs mx-auto">
            Looks like this page went on a trip without you
          </p>
          <Link
            href="/"
            className="inline-flex items-center justify-center px-8 py-3 bg-[#FF5A1F] text-white font-semibold rounded-full hover:bg-[#e64d1a] transition-colors gap-2"
          >
            <MoveLeft className="w-4 h-4" />
            Go Back Home
          </Link>
        </div>
      </main>
    </div>
  );
}
