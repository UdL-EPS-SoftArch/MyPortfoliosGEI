import { Resource } from "halfred";

export interface AssetEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
}

export type Asset = AssetEntity & Resource;
