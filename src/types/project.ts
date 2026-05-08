import { Resource } from "halfred";

export interface ProjectEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    flagged?: boolean;
    visibility?: string;
}

export type Project = ProjectEntity & Resource;
