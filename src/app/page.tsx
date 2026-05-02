"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/users/register?email=${encodeURIComponent(email)}`);
  };

  return (
    <div className="relative flex min-h-screen flex-col items-start bg-gradient-to-br from-black via-slate-900 to-blue-950 font-sans text-white overflow-hidden">
      {/* Optional: Place banner.jpg as an absolute background image here */}
      <div className="absolute inset-0 z-0 opacity-40 mix-blend-overlay">
        {/* <Image src="/banner.jpg" alt="Background" fill className="object-cover" priority /> */}
      </div>

      <main className="relative z-10 flex w-full flex-col items-start justify-center flex-1 px-8 sm:px-16 lg:px-32 xl:px-40 pt-32 pb-20">
        
        <div className="max-w-3xl">
          <h1 className="text-6xl font-extrabold tracking-tight text-white sm:text-7xl lg:text-8xl mb-8 leading-tight">
            Build your digital legacy.
          </h1>
          
          <p className="max-w-2xl text-xl leading-8 text-gray-300 mb-12">
            MyPortfolios is the premier platform for creators. Organize your projects, showcase visual assets, and collaborate securely. 
            Join the community and start building your stunning portfolio today.
          </p>

          <form onSubmit={handleSignup} className="flex flex-col sm:flex-row gap-4 max-w-xl">
            <input
              type="email"
              required
              placeholder="Email address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="flex-1 rounded-md border border-white/20 bg-white/10 px-5 py-4 text-lg text-white placeholder-gray-400 backdrop-blur-sm focus:border-white focus:outline-none focus:ring-1 focus:ring-white transition"
            />
            <button
              type="submit"
              className="rounded-md bg-white text-black px-8 py-4 text-lg font-bold hover:bg-gray-200 transition shadow-lg"
            >
              Sign up for MyPortfolios
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}
