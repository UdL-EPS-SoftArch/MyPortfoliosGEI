import { Resource } from "halfred";

export type Visibility = "PUBLIC" | "PRIVATE" | "UNLISTED" | "RESTRICTED";

export interface PortfolioEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    visibility?: Visibility;
    image?: string;
    created?: Date;
    modified?: Date;
}

export type Portfolio = PortfolioEntity & Resource;
