import Link from "next/link";
import type { ReactNode } from "react";
import { Search, FileText } from "lucide-react";
import { Portfolio } from "@/types/portfolio";
import CreatePortfolioButton from "@/app/portfolio/components/create-button";
import DeletePortfolioButton from "@/app/portfolio/components/delete-button";
import Loginbar from "@/app/components/loginbar";

type Props = {
    ownPortfolios: Portfolio[];
    activePortfolioId?: string;
    searchQuery?: string;
    canManagePortfolios?: boolean;
    children: ReactNode;
};

function getPortfolioId(portfolio: Portfolio) {
    return portfolio.uri?.split("/").pop() || "";
}

export default function PortfolioWorkspace({
    ownPortfolios,
    activePortfolioId,
    searchQuery = "",
    canManagePortfolios = false,
    children,
}: Props) {
    return (
        <div className="min-h-screen bg-black font-sans text-white">
            <header className="sticky top-0 z-40 border-b border-white/15 bg-black/35 backdrop-blur-md">
                <div className="flex min-h-20 w-full items-center px-5 py-4 md:px-8 lg:px-12">
                    <div className="flex items-center gap-5 flex-1">
                        <Link
                            href="/"
                            className="shrink-0 text-xl font-bold tracking-tight text-white transition hover:text-gray-200 mr-2"
                        >
                            MyPortfolios
                        </Link>
                        <Link
                            href="/projects"
                            className="text-sm font-medium text-gray-300 transition hover:text-white hidden sm:block"
                        >
                            Projects
                        </Link>
                        <Link
                            href="/explore"
                            className="text-sm font-medium text-gray-300 transition hover:text-white hidden sm:block"
                        >
                            Explore
                        </Link>
                    </div>

                    <div className="flex justify-center flex-[2] max-w-xl px-4">
                        <form action="/portfolio" className="relative w-full">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                name="q"
                                defaultValue={searchQuery}
                                placeholder="Buscar portfolios"
                                className="h-11 w-full rounded-md border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white shadow-lg outline-none placeholder:text-gray-400 transition focus:border-white focus:ring-1 focus:ring-white/50"
                            />
                        </form>
                    </div>

                    <div className="flex flex-1 items-center justify-end">
                        <Loginbar />
                    </div>
                </div>
            </header>

            <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 md:grid-cols-[280px_minmax(0,1fr)]">
                <aside className="border-b border-white/15 bg-black/25 p-5 backdrop-blur-sm md:border-b-0 md:border-r md:p-6">
                    <div className="mb-5 flex items-center justify-between gap-3">
                        <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-300">
                            Mis portfolios
                        </h2>
                        <CreatePortfolioButton forceVisible={canManagePortfolios} />
                    </div>

                    <nav className="grid gap-2">
                        {ownPortfolios.length === 0 ? (
                            <p className="rounded-md border border-white/15 bg-white/5 p-4 text-sm text-gray-300">
                                No tienes portfolios todavia.
                            </p>
                        ) : (
                            ownPortfolios.map((portfolio) => {
                                const id = getPortfolioId(portfolio);
                                const isActive = id === activePortfolioId;

                                return (
                                    <div
                                        key={portfolio.uri || portfolio.name}
                                        className={`group rounded-md border p-2 transition ${
                                            isActive
                                                ? "border-white/50 bg-white/20"
                                                : "border-white/15 bg-white/10 hover:bg-white/15"
                                        }`}
                                    >
                                        <div className="flex items-center gap-2">
                                            <Link
                                                href={`/portfolio/${id}`}
                                                className="flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-2 text-sm font-semibold text-white"
                                            >
                                                <FileText className="h-4 w-4 shrink-0 text-gray-300" />
                                                <span className="truncate">{portfolio.name}</span>
                                            </Link>
                                            {id && (
                                                <DeletePortfolioButton
                                                    portfolioId={id}
                                                    forceVisible={canManagePortfolios}
                                                />
                                            )}
                                        </div>
                                    </div>
                                );
                            })
                        )}
                    </nav>
                </aside>

                <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-14">
                    {children}
                </main>
            </div>
        </div>
    );
}
