import { Resource } from "halfred";

export interface TagEntity {
    uri: string;
    id?: string;
    name: string;
}

export type Tag = TagEntity & Resource;
