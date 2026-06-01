"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Loader2, Layers } from "lucide-react";
import { PortfolioService } from "@/api/portfolioApi";
import { useAuth } from "@/app/components/authentication";
import { Portfolio } from "@/types/portfolio";
import Loginbar from "@/app/components/loginbar";

type SortOrder = "newest" | "oldest" | "az";

const SORT_LABELS: Record<SortOrder, string> = {
    newest: "Newest first",
    oldest: "Oldest first",
    az: "A → Z",
};

function FilterPill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                active ? "bg-white/20 font-semibold text-white" : "text-gray-400 hover:bg-white/10 hover:text-white"
            }`}
        >
            {children}
        </button>
    );
}

function PortfolioCard({ portfolio }: { portfolio: Portfolio }) {
    const id = portfolio.uri?.split("/").pop();
    return (
        <Link
            href={`/portfolio/${id}`}
            className="group overflow-hidden rounded-md border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
        >
            <div className="aspect-[16/9] w-full bg-black/30">
                {portfolio.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                        src={portfolio.image}
                        alt={portfolio.name}
                        className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                    />
                ) : (
                    <div className="flex h-full items-center justify-center">
                        <Layers className="h-8 w-8 text-gray-600" />
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="font-bold">{portfolio.name}</h3>
                {portfolio.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-300">{portfolio.description}</p>
                )}
            </div>
        </Link>
    );
}

export default function ExplorePage() {
    const { authProvider } = useAuth();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [sortOrder, setSortOrder] = useState<SortOrder>("newest");

    useEffect(() => {
        new PortfolioService(authProvider)
            .getPortfolios()
            .then(setPortfolios)
            .catch(() => setPortfolios([]))
            .finally(() => setLoading(false));
    }, [authProvider]);

    const results = useMemo(() => {
        const q = search.toLowerCase();
        let filtered = portfolios.filter((p) =>
            `${p.name} ${p.description ?? ""}`.toLowerCase().includes(q)
        );
        if (sortOrder === "newest") {
            filtered = [...filtered].sort((a, b) =>
                new Date(b.created ?? 0).getTime() - new Date(a.created ?? 0).getTime()
            );
        } else if (sortOrder === "oldest") {
            filtered = [...filtered].sort((a, b) =>
                new Date(a.created ?? 0).getTime() - new Date(b.created ?? 0).getTime()
            );
        } else {
            filtered = [...filtered].sort((a, b) => a.name.localeCompare(b.name));
        }
        return filtered;
    }, [search, sortOrder, portfolios]);

    return (
        <div className="min-h-screen bg-black font-sans text-white">
            {/* Sticky header */}
            <header className="sticky top-0 z-40 border-b border-white/15 bg-black/35 backdrop-blur-md">
                <div className="flex min-h-20 w-full items-center px-5 py-4 md:px-8 lg:px-12">
                    <div className="flex items-center gap-5 flex-1">
                        <Link href="/" className="shrink-0 text-xl font-bold tracking-tight text-white transition hover:text-gray-200 mr-2">
                            MyPortfolios
                        </Link>
                        <Link href="/portfolio" className="text-sm font-medium text-gray-300 transition hover:text-white hidden sm:block">
                            Portfolios
                        </Link>
                        <Link href="/projects" className="text-sm font-medium text-gray-300 transition hover:text-white hidden sm:block">
                            Projects
                        </Link>
                    </div>

                    <div className="flex justify-center flex-[2] max-w-xl px-4">
                        <div className="relative w-full">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search portfolios..."
                                className="h-11 w-full rounded-md border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-400 transition focus:border-white focus:ring-1 focus:ring-white/50"
                            />
                        </div>
                    </div>

                    <div className="flex flex-1 items-center justify-end">
                        <Loginbar />
                    </div>
                </div>
            </header>

            {/* Body: sidebar + content always side by side */}
            <div className="flex min-h-[calc(100vh-80px)]">
                <aside className="hidden w-60 shrink-0 border-r border-white/15 bg-black/25 p-5 md:block md:p-6">
                    <p className="mb-5 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">Sort by</p>
                    <div className="space-y-1">
                        {(["newest", "oldest", "az"] as SortOrder[]).map((s) => (
                            <FilterPill key={s} active={sortOrder === s} onClick={() => setSortOrder(s)}>
                                {SORT_LABELS[s]}
                            </FilterPill>
                        ))}
                    </div>
                </aside>

                <main className="min-w-0 flex-1 px-5 py-8 sm:px-8 lg:px-10">
                    <div className="mb-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Discover</p>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Explore</h1>
                        {!loading && (
                            <p className="mt-2 text-sm text-gray-400">
                                {results.length} {results.length === 1 ? "portfolio" : "portfolios"}
                                {search && <> for &ldquo;<span className="text-white">{search}</span>&rdquo;</>}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                        </div>
                    ) : results.length === 0 ? (
                        <div className="rounded-md border border-white/15 bg-white/10 p-8 text-center text-gray-300 backdrop-blur-md">
                            <p className="text-lg">No portfolios found.</p>
                            {search && (
                                <button
                                    onClick={() => setSearch("")}
                                    className="mt-3 text-sm text-gray-400 underline hover:text-white"
                                >
                                    Clear search
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                            {results.map((p) => (
                                <PortfolioCard key={p.uri} portfolio={p} />
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
