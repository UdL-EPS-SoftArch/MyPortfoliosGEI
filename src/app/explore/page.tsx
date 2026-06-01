"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Search, Loader2, Globe, Lock, Calendar, FileText, Layers } from "lucide-react";
import { PortfolioService } from "@/api/portfolioApi";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { Portfolio } from "@/types/portfolio";
import { Project, Status } from "@/types/project";
import Loginbar from "@/app/components/loginbar";

type ContentType = "all" | "portfolios" | "projects";
type StatusFilter = "all" | Status;

const STATUS_LABELS: Record<Status, string> = {
    ToDo: "To Do",
    In_Progress: "In Progress",
    Done: "Done",
    In_Revision: "In Revision",
};

const STATUS_COLORS: Record<Status, string> = {
    ToDo: "bg-slate-500/70",
    In_Progress: "bg-blue-500/70",
    Done: "bg-green-500/70",
    In_Revision: "bg-yellow-500/70",
};

function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
    return (
        <div className="border-b border-white/10 pb-5">
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-gray-400">{title}</p>
            {children}
        </div>
    );
}

function FilterPill({
    active,
    onClick,
    children,
}: {
    active: boolean;
    onClick: () => void;
    children: React.ReactNode;
}) {
    return (
        <button
            onClick={onClick}
            className={`w-full rounded-md px-3 py-2 text-left text-sm transition ${
                active
                    ? "bg-white/20 font-semibold text-white"
                    : "text-gray-400 hover:bg-white/10 hover:text-white"
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
                <div className="mb-1 flex items-center gap-2">
                    <Layers className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                    <span className="text-xs text-gray-400">Portfolio</span>
                </div>
                <h3 className="font-bold">{portfolio.name}</h3>
                {portfolio.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-300">{portfolio.description}</p>
                )}
            </div>
        </Link>
    );
}

function ProjectCard({ project }: { project: Project }) {
    const id = project.uri?.split("/").pop();
    const statusKey = (project.status as Status) || "ToDo";
    return (
        <Link
            href={`/projects/${id}`}
            className="group overflow-hidden rounded-md border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
        >
            <div className="p-4">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                        <FileText className="h-3.5 w-3.5 shrink-0 text-gray-400" />
                        <span className="text-xs text-gray-400">Project</span>
                    </div>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${STATUS_COLORS[statusKey]}`}>
                        {STATUS_LABELS[statusKey]}
                    </span>
                </div>
                <h3 className="font-bold">{project.name}</h3>
                {project.description && (
                    <p className="mt-1.5 line-clamp-2 text-sm text-gray-300">{project.description}</p>
                )}
                <div className="mt-3 flex items-center gap-3 text-xs text-gray-400">
                    {project.isPrivate ? (
                        <span className="flex items-center gap-1"><Lock className="h-3 w-3 text-amber-400" /> Private</span>
                    ) : (
                        <span className="flex items-center gap-1"><Globe className="h-3 w-3 text-blue-400" /> Public</span>
                    )}
                    {project.created && (
                        <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(project.created).toLocaleDateString()}
                        </span>
                    )}
                </div>
            </div>
        </Link>
    );
}

export default function ExplorePage() {
    const { authProvider } = useAuth();
    const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [typeFilter, setTypeFilter] = useState<ContentType>("all");
    const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

    useEffect(() => {
        async function load() {
            try {
                const [p, pr] = await Promise.all([
                    new PortfolioService(authProvider).getPortfolios().catch(() => [] as Portfolio[]),
                    new ProjectService(authProvider).getProjects().catch(() => [] as Project[]),
                ]);
                setPortfolios(p);
                setProjects(pr);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, [authProvider]);

    const results = useMemo(() => {
        const q = search.toLowerCase();

        const matchPortfolio = (p: Portfolio) =>
            `${p.name} ${p.description ?? ""}`.toLowerCase().includes(q);

        const matchProject = (p: Project) =>
            `${p.name} ${p.description ?? ""}`.toLowerCase().includes(q) &&
            (statusFilter === "all" || p.status === statusFilter);

        const showPortfolios = typeFilter === "all" || typeFilter === "portfolios";
        const showProjects = typeFilter === "all" || typeFilter === "projects";

        const filteredPortfolios = showPortfolios ? portfolios.filter(matchPortfolio) : [];
        const filteredProjects = showProjects ? projects.filter(matchProject) : [];

        return { portfolios: filteredPortfolios, projects: filteredProjects };
    }, [search, typeFilter, statusFilter, portfolios, projects]);

    const totalCount = results.portfolios.length + results.projects.length;

    const allStatuses: Status[] = ["ToDo", "In_Progress", "Done", "In_Revision"];

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 font-sans text-white">
            {/* Sticky header */}
            <header className="sticky top-0 z-40 border-b border-white/15 bg-black/35 backdrop-blur-md">
                <div className="grid min-h-20 w-full grid-cols-1 items-center gap-4 px-5 py-4 md:grid-cols-[240px_1fr_240px] md:px-8 lg:px-12">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white transition hover:text-gray-200">
                        MyPortfolios
                    </Link>
                    <form onSubmit={(e) => e.preventDefault()} className="relative w-full max-w-2xl justify-self-center">
                        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                        <input
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            placeholder="Search portfolios and projects..."
                            className="h-11 w-full rounded-md border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-400 transition focus:border-white focus:ring-1 focus:ring-white/50"
                        />
                    </form>
                    <div className="flex justify-start md:justify-end md:justify-self-end">
                        <Loginbar />
                    </div>
                </div>
            </header>

            <div className="grid min-h-[calc(100vh-80px)] grid-cols-1 md:grid-cols-[260px_minmax(0,1fr)]">
                {/* Filter sidebar */}
                <aside className="border-b border-white/15 bg-black/25 p-5 backdrop-blur-sm md:border-b-0 md:border-r md:p-6">
                    <p className="mb-5 text-sm font-bold uppercase tracking-[0.18em] text-gray-300">Filters</p>

                    <div className="space-y-5">
                        <FilterSection title="Type">
                            {(["all", "portfolios", "projects"] as ContentType[]).map((t) => (
                                <FilterPill key={t} active={typeFilter === t} onClick={() => setTypeFilter(t)}>
                                    {t === "all" ? "All" : t === "portfolios" ? "Portfolios" : "Projects"}
                                </FilterPill>
                            ))}
                        </FilterSection>

                        {(typeFilter === "all" || typeFilter === "projects") && (
                            <FilterSection title="Status">
                                <FilterPill active={statusFilter === "all"} onClick={() => setStatusFilter("all")}>
                                    All statuses
                                </FilterPill>
                                {allStatuses.map((s) => (
                                    <FilterPill key={s} active={statusFilter === s} onClick={() => setStatusFilter(s)}>
                                        {STATUS_LABELS[s]}
                                    </FilterPill>
                                ))}
                            </FilterSection>
                        )}
                    </div>
                </aside>

                {/* Main content */}
                <main className="min-w-0 px-5 py-8 sm:px-8 lg:px-10">
                    <div className="mb-6">
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Discover</p>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">Explore</h1>
                        {!loading && (
                            <p className="mt-2 text-sm text-gray-400">
                                {totalCount} {totalCount === 1 ? "result" : "results"}
                                {search && <> for &ldquo;<span className="text-white">{search}</span>&rdquo;</>}
                            </p>
                        )}
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                        </div>
                    ) : totalCount === 0 ? (
                        <div className="rounded-md border border-white/15 bg-white/10 p-8 text-center text-gray-300 backdrop-blur-md">
                            <p className="text-lg">Nothing found.</p>
                            {(search || typeFilter !== "all" || statusFilter !== "all") && (
                                <button
                                    onClick={() => { setSearch(""); setTypeFilter("all"); setStatusFilter("all"); }}
                                    className="mt-3 text-sm text-gray-400 underline hover:text-white"
                                >
                                    Clear all filters
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="space-y-8">
                            {results.portfolios.length > 0 && (
                                <section>
                                    {typeFilter === "all" && (
                                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                                            Portfolios — {results.portfolios.length}
                                        </h2>
                                    )}
                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {results.portfolios.map((p) => (
                                            <PortfolioCard key={p.uri} portfolio={p} />
                                        ))}
                                    </div>
                                </section>
                            )}

                            {results.projects.length > 0 && (
                                <section>
                                    {typeFilter === "all" && (
                                        <h2 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-gray-400">
                                            Projects — {results.projects.length}
                                        </h2>
                                    )}
                                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                                        {results.projects.map((p) => (
                                            <ProjectCard key={p.uri} project={p} />
                                        ))}
                                    </div>
                                </section>
                            )}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
