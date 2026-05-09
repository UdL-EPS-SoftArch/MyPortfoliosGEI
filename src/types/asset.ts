import { Resource } from "halfred";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED" | "RESTRICTED";

export interface AssetEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    visibility?: Visibility;
    contentType?: string;
    url?: string;
    createdBy?: string;
    lastModifiedBy?: string;
    createdAt?: string;
    updatedAt?: string;
}

export type Asset = AssetEntity & Resource;
