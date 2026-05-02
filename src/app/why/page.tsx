import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function WhyPage() {
  const features = [
    {
      title: "Organize Projects & Assets",
      description: "Structure your digital life. Group assets into projects, and projects into beautiful portfolios."
    },
    {
      title: "Granular Privacy & Sharing",
      description: "You control who sees what. Set content to public, private, or restricted, and securely share access with specific collaborators."
    },
    {
      title: "Tagging & Discovery",
      description: "Tag your content to make it easily searchable and discoverable by the community."
    },
    {
      title: "Secure Collaboration",
      description: "A robust role-based system ensuring only authorized users can edit your portfolios."
    }
  ];

  return (
    <div className="relative flex min-h-screen flex-col items-start bg-gradient-to-br from-black via-slate-900 to-blue-950 font-sans text-white pt-32 pb-20 px-8 sm:px-16 lg:px-32 xl:px-40">
      <div className="max-w-4xl">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-6xl mb-6">
          Why MyPortfolios?
        </h1>
        <p className="text-xl text-gray-300 mb-16 leading-relaxed">
          The premier platform designed exclusively for creators to showcase, organize, and securely share their visual content.
        </p>

        <div className="grid gap-10 sm:grid-cols-2">
          {features.map((feature, idx) => (
            <div key={idx} className="flex gap-4">
              <CheckCircle2 className="text-blue-400 shrink-0 w-8 h-8" />
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {feature.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-20">
          <Link
            href="/users/register"
            className="inline-block rounded-md bg-white text-black px-8 py-4 text-lg font-bold hover:bg-gray-200 transition shadow-lg"
          >
            Start Building Today
          </Link>
        </div>
      </div>
    </div>
  );
}
