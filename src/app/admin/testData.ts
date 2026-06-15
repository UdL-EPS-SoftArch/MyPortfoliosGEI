import type { AssetEntity } from "@/types/asset";
import type { CreatorEntity } from "@/types/creator";
import type { PortfolioEntity } from "@/types/portfolio";
import type { ProjectEntity } from "@/types/project";
import type { UserEntity } from "@/types/user";

export const demoAssets: AssetEntity[] = [
    {
        uri: "demo:assets/landing-cover",
        id: "demo-asset-1",
        name: "Landing page cover",
        description: "Image uploaded to the public portfolio.",
        contentType: "image/png",
        url: "https://example.com/assets/landing-cover.png",
        createdBy: "/creators/creator-sample",
    },
    {
        uri: "demo:assets/private-wireframes",
        id: "demo-asset-2",
        name: "Private wireframes",
        description: "Draft design files pending review.",
        contentType: "application/pdf",
        url: "https://example.com/assets/private-wireframes.pdf",
        createdBy: "/creators/designer-sample",
    },
];

export const demoCreators: CreatorEntity[] = [
    {
        uri: "demo:creators/creator-sample",
        username: "creator-sample",
        email: "creator.sample@myportfolios.test",
        roles: "ROLE_USER,ROLE_CREATOR",
        authorities: [
            { authority: "ROLE_USER" },
            { authority: "ROLE_CREATOR" },
        ],
    },
    {
        uri: "demo:creators/designer-sample",
        username: "designer-sample",
        email: "designer.sample@myportfolios.test",
        roles: "ROLE_USER,ROLE_CREATOR",
        authorities: [
            { authority: "ROLE_USER" },
            { authority: "ROLE_CREATOR" },
        ],
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
        status: "In_Revision",
    },
    {
        uri: "demo:projects/private-dashboard",
        id: "demo-project-2",
        name: "Private Dashboard",
        description: "Internal dashboard project with collaborator-only access.",
        flagged: false,
        visibility: "PRIVATE",
        status: "In_Progress",
    },
    {
        uri: "demo:projects/copyright-report",
        id: "demo-project-3",
        name: "Copyright Report",
        description: "Reported by a user for duplicated assets.",
        flagged: true,
        visibility: "RESTRICTED",
        status: "ToDo",
    },
];

export const demoUsers: UserEntity[] = [
    {
        uri: "demo:users/admin-sample",
        username: "admin-sample",
        email: "admin.sample@myportfolios.test",
        roles: "ROLE_USER,ROLE_ADMIN",
        authorities: [
            { authority: "ROLE_USER" },
            { authority: "ROLE_ADMIN" },
        ],
    },
    {
        uri: "demo:users/editor-sample",
        username: "editor-sample",
        email: "editor.sample@myportfolios.test",
        roles: "ROLE_USER,ROLE_EDITOR",
        authorities: [
            { authority: "ROLE_USER" },
            { authority: "ROLE_EDITOR" },
        ],
    },
    {
        uri: "demo:users/user-sample",
        username: "user-sample",
        email: "user.sample@myportfolios.test",
        roles: "ROLE_USER",
        authorities: [
            { authority: "ROLE_USER" },
        ],
    },
];
