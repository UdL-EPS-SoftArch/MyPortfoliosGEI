"use client";

import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: Partial<Project>) => Promise<void>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
    return (
        <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                <CardTitle>{initialData ? "Edit Project" : "Create New Project"}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            placeholder="Enter project name"
                        />
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="submit">
                            {initialData ? "Update Project" : "Create Project"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}