import { Resource } from "halfred";

export type CollaboratorAction = "View" | "Edit" | "Remove";

export interface CollaboratorEntity {
    uri: string;
    id?: string;
    /** URI of the user who has collaborator access. */
    user: string;
    /** URI of the project this collaborator has access to. */
    project: string;
    action: CollaboratorAction;
}

export type Collaborator = CollaboratorEntity & Resource;
