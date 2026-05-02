import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-5xl flex-col items-center py-20 px-6 sm:px-16 text-center">
        
        <h1 className="text-5xl font-extrabold tracking-tight text-black dark:text-white sm:text-6xl mb-6">
          Welcome to MyPortfolios
        </h1>
        
        <p className="max-w-2xl text-xl leading-8 text-zinc-600 dark:text-zinc-400 mb-10">
          A collaborative platform for creators to organize projects, share visual content, and build stunning digital portfolios. 
          Share your assets with the world and connect with others.
        </p>

        <div className="flex gap-4 mb-16">
          <Link
            href="/users/register"
            className="rounded-full bg-blue-600 px-8 py-4 text-lg font-semibold text-white transition-colors hover:bg-blue-700 shadow-lg"
          >
            Get Started
          </Link>
        </div>

        <div className="w-full max-w-4xl overflow-hidden rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-800 bg-gray-100 dark:bg-zinc-900 flex items-center justify-center min-h-[400px]">
           {/* Place your banner.jpg in the /public folder */}
           <Image 
             src="/banner.jpg" 
             alt="MyPortfolios Banner" 
             width={1200} 
             height={600} 
             className="w-full h-auto object-cover"
             priority
           />
        </div>

      </main>
    </div>
  );
}
