"use client";

import { useEffect, useState } from "react";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { Project } from "@/types/project";
import { ProjectCard } from "./components/project-card";
import Link from "next/link";
import { Plus, Search, Loader2 } from "lucide-react";

export default function ProjectsPage() {
    const { authProvider } = useAuth();
    const [projects, setProjects] = useState<Project[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const service = new ProjectService(authProvider);
                const data = await service.getProjects();
                setProjects(data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [authProvider]);

    const filteredProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 font-sans text-white">
            <div className="mx-auto w-full max-w-5xl px-5 py-12 sm:px-8 lg:px-14">
                <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                            My work
                        </p>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            Projects
                        </h1>
                        <p className="mt-3 max-w-2xl text-base leading-7 text-gray-300">
                            Manage and explore your public and shared projects.
                        </p>
                    </div>
                    <Link
                        href="/projects/create"
                        className="flex w-fit items-center gap-2 rounded-md bg-white px-5 py-3 text-sm font-bold text-black shadow-lg transition hover:bg-gray-200"
                    >
                        <Plus className="h-4 w-4" /> New Project
                    </Link>
                </div>

                <div className="relative mb-8">
                    <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                    <input
                        placeholder="Search projects by name or description..."
                        className="h-11 w-full rounded-md border border-white/20 bg-white/10 pl-11 pr-4 text-sm text-white shadow-lg outline-none placeholder:text-gray-400 transition focus:border-white focus:ring-1 focus:ring-white/50"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-10 w-10 animate-spin text-gray-400" />
                    </div>
                ) : filteredProjects.length > 0 ? (
                    <div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                        {filteredProjects.map((project) => (
                            <ProjectCard key={project.uri} project={project} />
                        ))}
                    </div>
                ) : (
                    <div className="rounded-md border border-white/15 bg-white/10 p-8 text-center text-gray-300 backdrop-blur-md">
                        <p className="text-lg">No projects found.</p>
                        {searchTerm && (
                            <button
                                onClick={() => setSearchTerm("")}
                                className="mt-3 text-sm text-gray-400 underline hover:text-white"
                            >
                                Clear search filters
                            </button>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
