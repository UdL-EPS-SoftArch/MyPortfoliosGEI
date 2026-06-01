import { serverAuthProvider } from "@/lib/authProvider";
import { ProjectService } from "@/api/projectApi";
import { UsersService } from "@/api/userApi";
import ProjectWorkspace from "@/app/projects/components/project-workspace";
import Link from "next/link";
import { Calendar, Globe, Lock, Edit, LayoutGrid, UserIcon } from "lucide-react";
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
            <div className="mx-auto w-full max-w-6xl">
                {/* Back link */}
                <div className="mb-6">
                    <Link
                        href="/projects"
                        className="text-sm text-gray-400 transition hover:text-white"
                    >
                        ← Back to projects
                    </Link>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content (Left) */}
                    <div className="flex-1 space-y-8">
                        {/* Header */}
                        <div className="rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
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

                        {/* Content Grid (Placeholders for Assets as per Sketch) */}
                        <div className="grid grid-cols-6 grid-rows-4 gap-4 h-[600px]">
                            <div className="col-span-2 row-span-2 rounded-md border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center animate-pulse">
                                <LayoutGrid size={40} className="text-gray-500" />
                            </div>
                            <div className="col-span-4 row-span-3 rounded-md shadow-sm border border-white/15 bg-white/10 flex items-center justify-center group overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-white/0" />
                                <span className="text-gray-400 font-medium relative z-10">Main Content Area</span>
                            </div>
                            <div className="col-span-2 row-span-2 rounded-md border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center animate-pulse">
                                <LayoutGrid size={32} className="text-gray-500" />
                            </div>
                            <div className="col-span-2 row-span-1 bg-white/5 border border-white/10 rounded-md flex items-center justify-center">
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Upcoming</span>
                            </div>
                            <div className="col-span-2 row-span-1 bg-white/5 border border-white/10 rounded-md flex items-center justify-center">
                                <span className="text-xs text-gray-500 uppercase tracking-widest font-bold">Upcoming</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:w-80 space-y-6">
                        <div className="rounded-md border border-white/15 bg-white/10 backdrop-blur-md overflow-hidden">
                            <div className="p-6">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-400 mb-6">Hola! 👋</h2>
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-white/10 p-3 rounded-md">
                                                    <UserIcon size={20} className="text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Creator</p>
                                                    <p className="font-semibold text-white truncate max-w-[150px]">
                                                        {project.creator ? "Project Owner" : "Unknown User"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="bg-white/10 p-3 rounded-md">
                                                    <Calendar size={20} className="text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Created On</p>
                                                    <p className="font-semibold text-white">
                                                        {project.created ? new Date(project.created).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="bg-white/10 p-3 rounded-md">
                                                    <Calendar size={20} className="text-gray-300" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-gray-400 uppercase tracking-tight">Last Modified</p>
                                                    <p className="font-semibold text-white">
                                                        {project.lastModified ? new Date(project.lastModified).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-6 border-t border-white/10">
                                        <button className="w-full rounded-md bg-white/10 hover:bg-white/20 transition-all text-white h-10 font-bold shadow-md border border-white/15">
                                            Manage Access
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Additional Sidebar Block */}
                        <div className="bg-gradient-to-br from-indigo-900/40 to-blue-900/40 border border-indigo-500/30 rounded-md p-6 text-white shadow-lg">
                            <h3 className="font-bold text-lg mb-2">Project Insights</h3>
                            <p className="text-gray-300 text-sm mb-6 leading-relaxed">
                                Soon you will be able to see detailed analytics and contribution graphs here.
                            </p>
                            <button className="w-full bg-indigo-500/20 hover:bg-indigo-500/40 border border-indigo-400/30 text-white font-bold rounded-md h-10 backdrop-blur-md transition-all">
                                View Analytics
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </ProjectWorkspace>
    );
}
