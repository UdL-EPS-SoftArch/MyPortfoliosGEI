import { Resource } from "halfred";

export interface PortfolioEntity {
    uri: string;
    id?: string;
    name: string;
    description?: string;
    visibility?: string;
}

export type Portfolio = PortfolioEntity & Resource;
