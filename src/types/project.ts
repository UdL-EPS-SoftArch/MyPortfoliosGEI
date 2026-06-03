import { Resource } from "halfred";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED" | "RESTRICTED";

export type Status = "ToDo" | "In_Progress" | "Done" | "In_Revision";

export interface ProjectEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    flagged?: boolean;
    visibility?: Visibility;
    status?: Status;
    /** URI of the portfolio this project belongs to (optional). */
    portfolio?: string;
}

export type Project = ProjectEntity & Resource;
