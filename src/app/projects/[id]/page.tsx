"use client";

import { useEffect, useState, use } from "react";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { Project } from "@/types/project";
import { Loader2, ArrowLeft, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import Link from "next/link";

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = use(params);
    const { authProvider } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            try {
                const service = new ProjectService(authProvider);
                const data = await service.getProjectById(id);
                setProject(data);
            } catch (error) {
                console.error("Error fetching project:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchProject();
    }, [id, authProvider]);

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    if (!project) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-2xl font-bold">Project not found</h1>
                <Button variant="link" onClick={() => router.push("/projects")} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
                </Button>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            <div className="container mx-auto px-6 py-8">
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" onClick={() => router.push("/projects")} className="hover:bg-white dark:hover:bg-slate-900 shadow-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Button asChild className="rounded-full shadow-lg">
                            <Link href={`/projects/${id}/edit`}>Edit Project</Link>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    <div className="flex-1 space-y-8">
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                            <h1 className="text-5xl font-black tracking-tight text-slate-900 dark:text-white">
                                {project.name}
                            </h1>
                        </div>
                    </div>
                    <div className="lg:w-96 space-y-6"></div>
                </div>
            </div>
        </div>
    );
}