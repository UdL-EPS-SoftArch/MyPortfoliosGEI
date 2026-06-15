"use client";

import { useForm } from "react-hook-form";
import { Project } from "@/types/project";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

interface ProjectFormProps {
    initialData?: Project;
    onSubmit: (data: Partial<Project>) => Promise<void>;
}

function DarkInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={
                "h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-white/50 focus:ring-1 focus:ring-white/30 " +
                (props.className ?? "")
            }
        />
    );
}

function DarkTextarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return (
        <textarea
            {...props}
            className={
                "w-full rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-white/50 focus:ring-1 focus:ring-white/30 " +
                (props.className ?? "")
            }
        />
    );
}

export function ProjectForm({ initialData, onSubmit }: ProjectFormProps) {
    const { register, handleSubmit, formState: { errors } } = useForm<Partial<Project>>({
        defaultValues: initialData || { name: "", description: "", status: "ToDo", isPrivate: false },
    });
    const [loading, setLoading] = useState(false);
    const submittingRef = useRef(false);
    const router = useRouter();

    const handleFormSubmit = async (data: Partial<Project>) => {
        if (submittingRef.current) return;

        submittingRef.current = true;
        setLoading(true);
        try {
            await onSubmit(data);
            router.push("/projects");
            router.refresh();
            // Keep loading=true until navigation unmounts this component
        } catch {
            alert("Failed to save project.");
            submittingRef.current = false;
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-5">
            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Project name</label>
                <DarkInput
                    {...register("name", { required: "Name is required" })}
                    placeholder="Enter project name"
                />
                {errors.name && <p className="text-sm text-rose-400">{errors.name.message}</p>}
            </div>

            <div className="space-y-1.5">
                <label className="text-sm font-medium text-gray-300">Description</label>
                <DarkTextarea
                    {...register("description")}
                    placeholder="Tell us about the project..."
                    rows={4}
                />
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
                <div className="space-y-1.5">
                    <label className="text-sm font-medium text-gray-300">Status</label>
                    <select
                        {...register("status")}
                        className="h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white outline-none transition focus:border-white/50 focus:ring-1 focus:ring-white/30 [&>option]:bg-slate-900"
                    >
                        <option value="ToDo">To Do</option>
                        <option value="In_Progress">In Progress</option>
                        <option value="Done">Done</option>
                        <option value="In_Revision">In Revision</option>
                    </select>
                </div>

                <div className="flex items-center gap-3 pt-7">
                    <input
                        type="checkbox"
                        id="isPrivate"
                        {...register("isPrivate")}
                        className="h-4 w-4 rounded border-gray-600 accent-white"
                    />
                    <label htmlFor="isPrivate" className="text-sm font-medium text-gray-300">
                        Make this project private
                    </label>
                </div>
            </div>

            <div className="flex gap-3 pt-2">
                <button
                    type="submit"
                    disabled={loading}
                    className="rounded-md bg-white px-6 py-2 text-sm font-bold text-black transition hover:bg-gray-200 disabled:opacity-60"
                >
                    {loading ? "Saving..." : initialData ? "Update Project" : "Create Project"}
                </button>
                <button
                    type="button"
                    onClick={() => router.back()}
                    className="rounded-md border border-white/20 bg-white/10 px-6 py-2 text-sm font-semibold text-white transition hover:bg-white/15"
                >
                    Cancel
                </button>
            </div>
        </form>
    );
}
