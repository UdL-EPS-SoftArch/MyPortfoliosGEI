"use client";

import { useForm } from "react-hook-form";
import { Project } from "@/types/project";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: Partial<Project>) => Promise<void>;
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<Partial<Project>>({
        defaultValues: initialData || {
            name: "",
            description: "",
            status: "ToDo",
            isPrivate: false,
        }
    });
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleFormSubmit = async (data: Partial<Project>) => {
        setLoading(true);
        try {
            await onSubmit(data);
            router.push("/projects");
            router.refresh();
        } catch (error) {
            console.error("Error submitting form:", error);
            alert("Failed to save project.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="max-w-2xl mx-auto shadow-xl">
            <CardHeader className="bg-slate-50 dark:bg-slate-900 border-b">
                <CardTitle>{initialData ? "Edit Project" : "Create New Project"}</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
                <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Project Name</Label>
                        <Input
                            id="name"
                            {...register("name", { required: "Name is required" })}
                            placeholder="Enter project name"
                            className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            {...register("description")}
                            placeholder="Tell us about the project..."
                            rows={4}
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                {...register("status")}
                                className="w-full flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                            >
                                <option value="ToDo">To Do</option>
                                <option value="In_Progress">In Progress</option>
                                <option value="Done">Done</option>
                                <option value="In_Revision">In Revision</option>
                            </select>
                        </div>

                        <div className="flex items-center space-x-2 pt-8">
                            <input
                                type="checkbox"
                                id="isPrivate"
                                {...register("isPrivate")}
                                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <Label htmlFor="isPrivate">Make this project private</Label>
                        </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                        <Button type="button" variant="outline" onClick={() => router.back()}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={loading}>
                            {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
                        </Button>
                    </div>
                </form>
            </CardContent>
        </Card>
    );
}