import { Resource } from "halfred";

export type Status = "ToDo" | "In_Progress" | "Done" | "In_Revision";

export interface ProjectEntity {
    uri: string;
    id?: number;
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
}

export type Project = ProjectEntity & Resource;
