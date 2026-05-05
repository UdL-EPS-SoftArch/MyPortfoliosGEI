"use client";

import { useEffect, useState, use } from "react";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
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

    if (loading) {
        return (
            <div className="flex justify-center items-center py-40">
                <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
            </div>
        );
    }

    return null; // Temporalment fins al següent commit
}