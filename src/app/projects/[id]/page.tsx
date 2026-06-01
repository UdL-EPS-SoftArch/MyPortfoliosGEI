import { serverAuthProvider } from "@/lib/authProvider";
import { ProjectService } from "@/api/projectApi";
import { UsersService } from "@/api/userApi";
import ProjectWorkspace from "@/app/projects/components/project-workspace";
import Link from "next/link";
import { Calendar, Globe, Lock, Edit } from "lucide-react";
import { notFound } from "next/navigation";

const STATUS_LABELS: Record<string, string> = {
    ToDo: "To Do",
    In_Progress: "In Progress",
    Done: "Done",
    In_Revision: "In Revision",
};

const STATUS_COLORS: Record<string, string> = {
    ToDo: "bg-slate-500/70",
    In_Progress: "bg-blue-500/70",
    Done: "bg-green-500/70",
    In_Revision: "bg-yellow-500/70",
};

export default async function ProjectDetailPage(props: { params: Promise<{ id: string }> }) {
    const { id } = await props.params;
    const service = new ProjectService(serverAuthProvider);
    const userService = new UsersService(serverAuthProvider);

    let project;
    try {
        project = await service.getProjectById(id);
    } catch {
        notFound();
    }

    const currentUser = await userService.getCurrentUser().catch(() => null);
    const allProjects = await service.getProjects().catch(() => []);
    const ownProjects = currentUser?.uri
        ? allProjects.filter((p) => p.creator === currentUser.uri)
        : [];

    const statusKey = project.status || "ToDo";
    const isOwner = currentUser && project.creator === currentUser.uri;

    return (
        <ProjectWorkspace
            ownProjects={ownProjects}
            activeProjectId={id}
            canManageProjects={Boolean(currentUser)}
        >
            <article className="mx-auto w-full max-w-4xl">
                {/* Header */}
                <div className="mb-8 rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
                    <div className="mb-4 flex flex-wrap items-center gap-3">
                        <span className={`rounded-full px-3 py-1 text-sm font-semibold text-white ${STATUS_COLORS[statusKey]}`}>
                            {STATUS_LABELS[statusKey]}
                        </span>
                        {project.isPrivate ? (
                            <span className="flex items-center gap-1.5 text-sm text-amber-400">
                                <Lock className="h-3.5 w-3.5" /> Private
                            </span>
                        ) : (
                            <span className="flex items-center gap-1.5 text-sm text-blue-400">
                                <Globe className="h-3.5 w-3.5" /> Public
                            </span>
                        )}
                    </div>

                    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                            <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                                {project.name}
                            </h1>
                            {project.description && (
                                <p className="mt-4 max-w-2xl text-lg leading-8 text-gray-300">
                                    {project.description}
                                </p>
                            )}
                        </div>

                        {isOwner && (
                            <Link
                                href={`/projects/${id}/edit`}
                                className="flex shrink-0 items-center gap-2 rounded-md border border-white/20 bg-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/20"
                            >
                                <Edit className="h-4 w-4" /> Edit
                            </Link>
                        )}
                    </div>
                </div>

                {/* Metadata */}
                <div className="grid gap-4 sm:grid-cols-2">
                    {project.created && (
                        <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                            <Calendar className="h-5 w-5 shrink-0 text-gray-400" />
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Created</p>
                                <p className="mt-0.5 text-sm font-medium text-white">
                                    {new Date(project.created).toLocaleDateString(undefined, { dateStyle: "long" })}
                                </p>
                            </div>
                        </div>
                    )}
                    {project.lastModified && (
                        <div className="flex items-center gap-3 rounded-md border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                            <Calendar className="h-5 w-5 shrink-0 text-gray-400" />
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-400">Last modified</p>
                                <p className="mt-0.5 text-sm font-medium text-white">
                                    {new Date(project.lastModified).toLocaleDateString(undefined, { dateStyle: "long" })}
                                </p>
                            </div>
                        </div>
                    )}
                </div>

                {/* Back link */}
                <div className="mt-8">
                    <Link
                        href="/projects"
                        className="text-sm text-gray-400 transition hover:text-white"
                    >
                        ← Back to projects
                    </Link>
                </div>
            </article>
        </ProjectWorkspace>
    );
}
