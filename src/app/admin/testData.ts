import type { AssetEntity } from "@/types/asset";
import type { PortfolioEntity } from "@/types/portfolio";
import type { ProjectEntity } from "@/types/project";

export const demoAssets: AssetEntity[] = [
    {
        uri: "demo:assets/landing-cover",
        id: "demo-asset-1",
        name: "Landing page cover",
        description: "Image uploaded to the public portfolio.",
    },
    {
        uri: "demo:assets/private-wireframes",
        id: "demo-asset-2",
        name: "Private wireframes",
        description: "Draft design files pending review.",
    },
];

export const demoPortfolios: PortfolioEntity[] = [
    {
        uri: "demo:portfolios/frontend-showcase",
        id: "demo-portfolio-1",
        name: "Frontend Showcase",
        description: "Portfolio visible to visitors with selected projects.",
        visibility: "PUBLIC",
    },
    {
        uri: "demo:portfolios/client-work",
        id: "demo-portfolio-2",
        name: "Client Work",
        description: "Restricted portfolio for collaborator access.",
        visibility: "RESTRICTED",
    },
];

export const demoProjects: ProjectEntity[] = [
    {
        uri: "demo:projects/legacy-repository",
        id: "demo-project-1",
        name: "Legacy Repository",
        description: "Reported for outdated credentials in a public README.",
        flagged: true,
        visibility: "PUBLIC",
    },
    {
        uri: "demo:projects/private-dashboard",
        id: "demo-project-2",
        name: "Private Dashboard",
        description: "Internal dashboard project with collaborator-only access.",
        flagged: false,
        visibility: "PRIVATE",
    },
    {
        uri: "demo:projects/copyright-report",
        id: "demo-project-3",
        name: "Copyright Report",
        description: "Reported by a user for duplicated assets.",
        flagged: true,
        visibility: "RESTRICTED",
    },
];
