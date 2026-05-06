"use client";

import { useEffect, useState, use } from "react";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { ProjectForm } from "../../components/project-form";
import { Project } from "@/types/project";
import { Loader2 } from "lucide-react";

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = use(params);
    const { authProvider } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);

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

    const handleSubmit = async (data: Partial<Project>) => {
        const service = new ProjectService(authProvider);
        await service.updateProject(id, data);
    };

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
                <p className="text-muted-foreground mt-2">The project you are looking for does not exist or you dont have permission to view it.</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">Edit Project</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Update the details of <span className="font-semibold text-foreground">{project.name}</span>.
                </p>
            </div>
            <ProjectForm initialData={project} onSubmit={handleSubmit} />
        </div>
    );
}