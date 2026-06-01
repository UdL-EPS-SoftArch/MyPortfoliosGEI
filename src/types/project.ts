import { Resource } from "halfred";

export type Status = "ToDo" | "In_Progress" | "Done" | "In_Revision";
export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED" | "RESTRICTED";

export interface ProjectEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    flagged?: boolean;
    status?: Status;
    isPrivate?: boolean;
    visibility?: Visibility;
    created?: string;
    lastModified?: string;
    creator?: string;
    moderator?: string;
    project?: string;
    /** URI of the portfolio this project belongs to (optional). */
    portfolio?: string;
}

export type Project = ProjectEntity & Resource;

export function toPlainProject(project: Project): Project {
    return {
        uri: project.uri,
        id: project.id,
        name: project.name,
        description: project.description,
        flagged: project.flagged,
        status: project.status,
        isPrivate: project.isPrivate,
        created: project.created,
        lastModified: project.lastModified,
        creator: project.creator,
        moderator: project.moderator,
        project: project.project,
        visibility: project.visibility,
        portfolio: project.portfolio,
    } as Project;
}
