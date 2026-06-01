"use client";

import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { ProjectForm } from "../../components/project-form";
import { Project } from "@/types/project";

interface EditProjectFormProps {
    projectId: string;
    initialData: Project;
}

export default function EditProjectForm({ projectId, initialData }: EditProjectFormProps) {
    const { authProvider } = useAuth();

    const handleSubmit = async (data: Partial<Project>) => {
        const service = new ProjectService(authProvider);
        await service.updateProject(projectId, data);
    };

    return <ProjectForm initialData={initialData} onSubmit={handleSubmit} />;
}
