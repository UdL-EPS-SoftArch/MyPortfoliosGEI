"use client";

import { use } from "react";
import { Project } from "@/types/project";

interface EditProjectPageProps {
    params: Promise<{ id: string }>;
}

export default function EditProjectPage({ params }: EditProjectPageProps) {
    const { id } = use(params);

    return (
        <div className="container mx-auto px-6 py-12">
            <div className="mb-8 text-center">
                <h1 className="text-4xl font-extrabold tracking-tight">Edit Project</h1>
            </div>
        </div>
    );
}