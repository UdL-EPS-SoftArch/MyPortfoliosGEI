"use client";

import { Project } from "@/types/project";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { Calendar, Globe, Lock, Edit } from "lucide-react";

interface ProjectCardProps {
    project: Project;
}

export function ProjectCard({ project }: ProjectCardProps) {
    const statusColors: Record<string, string> = {
        ToDo: "bg-slate-500",
        In_Progress: "bg-blue-500",
        Done: "bg-green-500",
        In_Revision: "bg-yellow-500",
    };

    return (
        <Card className="overflow-hidden transition-all hover:shadow-lg group">
            <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold truncate">{project.name}</CardTitle>
                    <Badge variant="outline" className={statusColors[project.status || "ToDo"] + " text-white border-none"}>
                        {project.status?.replace("_", " ")}
                    </Badge>
                </div>
                <CardDescription className="line-clamp-2 mt-1">
                    {project.description || "No description provided."}
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-3 text-sm text-muted-foreground space-y-2">
                <div className="flex items-center gap-2">
                    {project.isPrivate ? (
                        <><Lock size={14} className="text-amber-500" /> Private</>
                    ) : (
                        <><Globe size={14} className="text-blue-500" /> Public</>
                    )}
                </div>
                {project.created && (
                    <div className="flex items-center gap-2">
                        <Calendar size={14} /> {new Date(project.created).toLocaleDateString()}
                    </div>
                )}
            </CardContent>
            <CardFooter className="flex justify-end gap-2 border-t pt-4">
                <Button variant="ghost" size="sm" asChild>
                    <Link href={`/projects/${project.uri.split('/').pop()}/edit`}>
                        <Edit size={14} className="mr-2" /> Edit
                    </Link>
                </Button>
                <Button size="sm" variant="outline" asChild>
                    <Link href={`/projects/${project.uri.split('/').pop()}`}>
                        View Details
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
