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
    created?: string; // ZonedDateTime as string
    lastModified?: string;
    creator?: string; // URI of the user
    moderator?: string; // URI of the user
    project?: string; // URI of parent project
    visibility?: Visibility;
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
    } as Project;
}
