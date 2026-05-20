"use client";

import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { ProjectForm } from "../components/project-form";
import { Project } from "@/types/project";

export default function CreateProjectPage() {
    const { authProvider } = useAuth();

    const handleSubmit = async (data: Partial<Project>) => {
        const service = new ProjectService(authProvider);
        await service.createProject(data);
    };

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">Launch a New Project</h1>
                <p className="text-muted-foreground mt-2 text-lg">
                    Fill in the details below to start your new journey.
                </p>
            </div>
            <ProjectForm onSubmit={handleSubmit} />
        </div>
    );
}