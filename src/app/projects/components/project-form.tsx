"use client";

import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            placeholder="Tell us about the project..."
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="ToDo">To Do</option>
                                <option value="In_Progress">In Progress</option>
                                <option value="Done">Done</option>
                                <option value="In_Revision">In Revision</option>
                            </select>
                        </div>
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