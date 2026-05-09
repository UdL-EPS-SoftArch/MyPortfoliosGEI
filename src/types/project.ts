import { Resource } from "halfred";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED" | "RESTRICTED";

export interface ProjectEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    flagged?: boolean;
    visibility?: Visibility;
}

export type Project = ProjectEntity & Resource;
