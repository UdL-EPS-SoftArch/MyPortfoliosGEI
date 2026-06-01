"use client";

import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { ProjectForm } from "../components/project-form";
import { Project } from "@/types/project";

export default function CreateProjectForm() {
    const { authProvider } = useAuth();

    const handleSubmit = async (data: Partial<Project>) => {
        const service = new ProjectService(authProvider);
        await service.createProject(data);
    };

    return <ProjectForm onSubmit={handleSubmit} />;
}
