"use client";

import { Project } from "@/types/project";
import Link from "next/link";
import { Calendar, Globe, Lock, Edit } from "lucide-react";

interface ProjectCardProps {
    project: Project;
}

const statusColors: Record<string, string> = {
    ToDo: "bg-slate-500/70",
    In_Progress: "bg-blue-500/70",
    Done: "bg-green-500/70",
    In_Revision: "bg-yellow-500/70",
};

export function ProjectCard({ project }: ProjectCardProps) {
    const id = project.uri.split("/").pop();
    const statusKey = project.status || "ToDo";

    return (
        <div className="group overflow-hidden rounded-md border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md transition hover:border-white/40 hover:bg-white/15">
            <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                    <h2 className="truncate text-lg font-bold">{project.name}</h2>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-xs font-semibold text-white ${statusColors[statusKey]}`}>
                        {statusKey.replace("_", " ")}
                    </span>
                </div>
                <p className="line-clamp-2 text-sm leading-6 text-gray-300">
                    {project.description || "No description provided."}
                </p>
                <div className="mt-4 space-y-1.5 text-sm text-gray-400">
                    <div className="flex items-center gap-2">
                        {project.isPrivate ? (
                            <><Lock size={13} className="text-amber-400" /> Private</>
                        ) : (
                            <><Globe size={13} className="text-blue-400" /> Public</>
                        )}
                    </div>
                    {project.created && (
                        <div className="flex items-center gap-2">
                            <Calendar size={13} />
                            {new Date(project.created).toLocaleDateString()}
                        </div>
                    )}
                </div>
            </div>
            <div className="flex justify-end gap-2 border-t border-white/10 px-5 py-3">
                <Link
                    href={`/projects/${id}/edit`}
                    className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm text-gray-300 transition hover:bg-white/10 hover:text-white"
                >
                    <Edit size={13} /> Edit
                </Link>
                <Link
                    href={`/projects/${id}`}
                    className="flex items-center gap-1.5 rounded-md border border-white/20 px-3 py-1.5 text-sm text-white transition hover:bg-white/10"
                >
                    View Details
                </Link>
            </div>
        </div>
    );
}
