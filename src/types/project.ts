import { Resource } from "halfred";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED" | "RESTRICTED";

export type Status = "ToDo" | "In_Progress" | "Done" | "In_Revision";

export interface ProjectEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    flagged?: boolean;
    isPrivate?: boolean;
    visibility?: Visibility;
    status?: Status;
}

export type Project = ProjectEntity & Resource;
