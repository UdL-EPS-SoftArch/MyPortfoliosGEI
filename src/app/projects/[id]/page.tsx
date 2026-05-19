"use client";

import { useEffect, useState, use } from "react";
import { ProjectService } from "@/api/projectApi";
import { useAuth } from "@/app/components/authentication";
import { Project } from "@/types/project";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Loader2, Calendar, User as UserIcon, Globe, Lock, ArrowLeft, MoreHorizontal, LayoutGrid } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProjectDetailPageProps {
    params: Promise<{ id: string }>;
}

export default function ProjectDetailPage({ params }: ProjectDetailPageProps) {
    const { id } = use(params);
    const { authProvider, user: currentUser } = useAuth();
    const [project, setProject] = useState<Project | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

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

    if (!project) {
        return (
            <div className="container mx-auto px-6 py-20 text-center">
                <h1 className="text-2xl font-bold">Project not found</h1>
                <Button variant="link" onClick={() => router.push("/projects")} className="mt-4">
                    <ArrowLeft className="mr-2 h-4 w-4" /> Back to projects
                </Button>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        ToDo: "bg-slate-500",
        In_Progress: "bg-blue-500",
        Done: "bg-green-500",
        In_Revision: "bg-yellow-500",
    };

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black">
            <div className="container mx-auto px-6 py-8">
                {/* Header Actions */}
                <div className="flex justify-between items-center mb-8">
                    <Button variant="ghost" onClick={() => router.push("/projects")} className="hover:bg-white dark:hover:bg-slate-900 shadow-sm">
                        <ArrowLeft className="mr-2 h-4 w-4" /> Back
                    </Button>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" className="rounded-full shadow-sm">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                        <Button asChild className="rounded-full shadow-lg">
                            <Link href={`/projects/${id}/edit`}>Edit Project</Link>
                        </Button>
                    </div>
                </div>

                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Main Content Area (Left) */}
                    <div className="flex-1 space-y-8">
                        {/* Hero Section */}
                        <div className="bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-sm border border-slate-200/50 dark:border-slate-800/50">
                            <div className="flex items-center gap-3 mb-4">
                                <Badge className={`${statusColors[project.status || "ToDo"]} text-white border-none px-3 py-1 text-sm rounded-full`}>
                                    {project.status?.replace("_", " ")}
                                </Badge>
                                {project.isPrivate ? (
                                    <Badge variant="outline" className="rounded-full flex gap-1 items-center px-3 py-1">
                                        <Lock size={12} className="text-amber-500" /> Private
                                    </Badge>
                                ) : (
                                    <Badge variant="outline" className="rounded-full flex gap-1 items-center px-3 py-1">
                                        <Globe size={12} className="text-blue-500" /> Public
                                    </Badge>
                                )}
                            </div>
                            <h1 className="text-5xl font-black tracking-tight mb-4 text-slate-900 dark:text-white">
                                {project.name}
                            </h1>
                            <p className="text-xl text-slate-600 dark:text-slate-400 leading-relaxed max-w-3xl">
                                {project.description || "This project doesn't have a description yet. Add one to help others understand your goals."}
                            </p>
                        </div>

                        {/* Content Grid (Placeholders for Assets as per Sketch) */}
                        <div className="grid grid-cols-6 grid-rows-4 gap-4 h-[600px]">
                            <div className="col-span-2 row-span-2 bg-blue-100 dark:bg-blue-900/20 rounded-3xl border-2 border-dashed border-blue-200 dark:border-blue-800 flex items-center justify-center animate-pulse">
                                <LayoutGrid size={40} className="text-blue-300 dark:text-blue-700" />
                            </div>
                            <div className="col-span-4 row-span-3 bg-white dark:bg-slate-900 rounded-3xl shadow-sm border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-center group overflow-hidden relative">
                                <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10" />
                                <span className="text-slate-400 dark:text-slate-600 font-medium relative z-10">Main Content Area</span>
                            </div>
                            <div className="col-span-2 row-span-2 bg-indigo-100 dark:bg-indigo-900/20 rounded-3xl border-2 border-dashed border-indigo-200 dark:border-indigo-800 flex items-center justify-center animate-pulse">
                                <LayoutGrid size={32} className="text-indigo-300 dark:text-indigo-700" />
                            </div>
                            <div className="col-span-2 row-span-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center">
                                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Upcoming</span>
                            </div>
                            <div className="col-span-2 row-span-1 bg-slate-200/50 dark:bg-slate-800/50 rounded-3xl flex items-center justify-center">
                                <span className="text-xs text-slate-400 uppercase tracking-widest font-bold">Upcoming</span>
                            </div>
                        </div>
                    </div>

                    {/* Sidebar (Right) */}
                    <div className="lg:w-96 space-y-6">
                        <Card className="rounded-3xl shadow-xl border-none overflow-hidden bg-white dark:bg-slate-900">
                            <CardContent className="p-8">
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 mb-6">Hola! 👋</h2>
                                        <div className="space-y-6">
                                            <div className="flex items-start gap-4">
                                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
                                                    <UserIcon size={20} className="text-slate-600 dark:text-slate-300" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Creator</p>
                                                    <p className="font-semibold text-slate-900 dark:text-white truncate max-w-[200px]">
                                                        {project.creator ? "Project Owner" : "Unknown User"}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
                                                    <Calendar size={20} className="text-slate-600 dark:text-slate-300" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Created On</p>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {project.created ? new Date(project.created).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-4">
                                                <div className="bg-slate-100 dark:bg-slate-800 p-3 rounded-2xl">
                                                    <Calendar size={20} className="text-slate-600 dark:text-slate-300" />
                                                </div>
                                                <div>
                                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-tight">Last Modified</p>
                                                    <p className="font-semibold text-slate-900 dark:text-white">
                                                        {project.lastModified ? new Date(project.lastModified).toLocaleDateString(undefined, { dateStyle: 'long' }) : 'N/A'}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-slate-100 dark:border-slate-800">
                                        <Button className="w-full rounded-2xl h-12 font-bold shadow-md hover:shadow-lg transition-all" variant="secondary">
                                            Manage Access
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Additional Sidebar Block */}
                        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl p-8 text-white shadow-lg shadow-blue-500/20">
                            <h3 className="font-bold text-xl mb-2">Project Insights</h3>
                            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
                                Soon you will be able to see detailed analytics and contribution graphs here.
                            </p>
                            <Button className="w-full bg-white/20 hover:bg-white/30 border-none text-white font-bold rounded-xl h-11 backdrop-blur-md">
                                View Analytics
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
