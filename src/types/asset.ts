import { Resource } from "halfred";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED" | "RESTRICTED";

export interface AssetEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    visibility?: Visibility;
}

export type Asset = AssetEntity & Resource;
