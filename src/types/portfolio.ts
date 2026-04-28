import { Resource } from "halfred";

export interface PortfolioEntity {
    uri: string;
    name: string;
    description?: string;
    image?: string;
    created?: Date;
    modified?: Date;
}

export type Portfolio = PortfolioEntity & Resource;
