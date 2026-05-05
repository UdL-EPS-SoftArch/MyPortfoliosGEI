"use client";

import { useEffect, useState, use } from "react";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { Project } from "@/types/project";
import { Loader2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

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
                {/* El contenido se añadirá en los siguientes commits */}
                <p>Project: {project.name}</p>
            </div>
        </div>
    );
}