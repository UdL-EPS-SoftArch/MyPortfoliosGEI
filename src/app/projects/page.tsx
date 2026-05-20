"use client";

import { useEffect, useState } from "react";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { Project } from "@/types/project";
import { ProjectCard } from "./components/project-card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";

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
        <div className="container mx-auto px-6 py-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Projects</h1>
                    <p className="text-muted-foreground mt-1">
                        Manage and explore public and shared projects.
                    </p>
                </div>
                <Button asChild className="shadow-lg hover:shadow-xl transition-all">
                    <Link href="/projects/create">
                        <Plus className="mr-2 h-4 w-4" /> New Project
                    </Link>
                </Button>
            </div>

            <div className="relative mb-8">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                    placeholder="Search projects by name or description..."
                    className="pl-10 h-12 text-lg shadow-sm focus-visible:ring-2"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
                </div>
            ) : filteredProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredProjects.map((project) => (
                        <ProjectCard key={project.uri} project={project} />
                    ))}
                </div>
            ) : (
                <div className="text-center py-20 bg-slate-50 dark:bg-slate-900 rounded-xl border-2 border-dashed">
                    <p className="text-xl text-muted-foreground">No projects found.</p>
                    <Button variant="link" onClick={() => setSearchTerm("")} className="mt-2">
                        Clear search filters
                    </Button>
                </div>
            )}
        </div>
    );
}
