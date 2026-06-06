import Link from "next/link";
import type { ReactNode } from "react";
import { Search, FileText, Plus } from "lucide-react";
import { Project } from "@/types/project";
import Loginbar from "@/app/components/loginbar";
import { Button } from "@/components/ui/button";

type Props = {
    ownProjects: Project[];
    activeProjectId?: string;
    searchQuery?: string;
    canManageProjects?: boolean;
    children: ReactNode;
};

function getProjectId(project: Project) {
    return project.uri?.split("/").pop() || "";
}

export default function ProjectWorkspace({
    ownProjects,
    activeProjectId,
    searchQuery = "",
    canManageProjects = false,
    children,
}: Props) {
    return (
        <div className="min-h-screen bg-black font-sans text-white">
            <header className="sticky top-0 z-40 border-b border-white/15 bg-black/50 backdrop-blur-md">
                <div className="flex min-h-20 w-full items-center px-5 py-4 md:px-8 lg:px-12">
                    <div className="flex items-center gap-5 flex-1">
                        <Link
                            href="/"
                            className="shrink-0 text-xl font-bold tracking-tight text-white transition hover:text-gray-200 mr-2"
                        >
                            MyPortfolios
                        </Link>
                        <Link
                            href="/portfolio"
                            className="text-sm font-medium text-gray-300 transition hover:text-white hidden sm:block"
                        >
                            Portfolios
                        </Link>
                        <Link
                            href="/explore"
                            className="text-sm font-medium text-gray-300 transition hover:text-white hidden sm:block"
                        >
                            Explore
                        </Link>
                    </div>

                    <div className="flex justify-center flex-[2] max-w-xl px-4">
                        <form action="/projects" className="relative w-full">
                            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                            <input
                                name="q"
                                defaultValue={searchQuery}
                                placeholder="Search projects"
                                className="h-11 w-full rounded-md border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white outline-none placeholder:text-gray-400 transition focus:border-white focus:ring-1 focus:ring-white/50"
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
                            My projects
                        </h2>
                        {canManageProjects && (
                            <Link href="/projects/create">
                                <Button size="sm" className="gap-1 bg-white text-black hover:bg-gray-200">
                                    <Plus className="h-4 w-4" />
                                    New
                                </Button>
                            </Link>
                        )}
                    </div>

                    <nav className="grid gap-2">
                        {ownProjects.length === 0 ? (
                            <p className="rounded-md border border-white/15 bg-white/5 p-4 text-sm text-gray-300">
                                No projects yet.
                            </p>
                        ) : (
                            ownProjects.map((project) => {
                                const id = getProjectId(project);
                                const isActive = id === activeProjectId;
                                return (
                                    <Link
                                        key={project.uri || project.name}
                                        href={`/projects/${id}`}
                                        className={`flex items-center gap-2 rounded-md border p-3 text-sm font-medium text-white transition ${
                                            isActive
                                                ? "border-white/50 bg-white/20 font-semibold"
                                                : "border-white/15 bg-white/10 hover:bg-white/15"
                                        }`}
                                    >
                                        <FileText className="h-4 w-4 shrink-0 text-gray-300" />
                                        <span className="truncate">{project.name}</span>
                                    </Link>
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
