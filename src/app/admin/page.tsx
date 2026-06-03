import { redirect } from "next/navigation";
import AdminPanel from "@/app/admin/AdminPanel";
import { demoAssets, demoCreators, demoPortfolios, demoProjects, demoUsers } from "@/app/admin/testData";
import { AssetService } from "@/api/assetApi";
import { CreatorService } from "@/api/creatorApi";
import { PortfolioService } from "@/api/portfolioApi";
import { ProjectService } from "@/api/projectApi";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { isAdminUser } from "@/lib/permissions";
import type { Asset, AssetEntity } from "@/types/asset";
import type { Creator, CreatorEntity } from "@/types/creator";
import type { Portfolio, PortfolioEntity } from "@/types/portfolio";
import type { Project, ProjectEntity } from "@/types/project";
import type { User, UserEntity } from "@/types/user";

function toUserEntity(user: User): UserEntity {
    return {
        uri: user.uri,
        username: user.username,
        email: user.email,
        role: user.role,
        roles: user.roles,
        authorities: user.authorities,
    };
}

function toAssetEntity(asset: Asset): AssetEntity {
    return {
        uri: asset.uri,
        id: asset.id,
        name: asset.name,
        description: asset.description,
        contentType: asset.contentType,
        url: asset.url,
        createdBy: asset.createdBy,
        lastModifiedBy: asset.lastModifiedBy,
        createdAt: asset.createdAt,
        updatedAt: asset.updatedAt,
    };
}

function toCreatorEntity(creator: Creator): CreatorEntity {
    return {
        uri: creator.uri,
        username: creator.username,
        email: creator.email,
        role: creator.role,
        roles: creator.roles,
        authorities: creator.authorities,
    };
}

function toPortfolioEntity(portfolio: Portfolio): PortfolioEntity {
    return {
        uri: portfolio.uri,
        id: portfolio.id,
        name: portfolio.name,
        description: portfolio.description,
        visibility: portfolio.visibility ?? "PUBLIC",
    };
}

function toProjectEntity(project: Project): ProjectEntity {
    return {
        uri: project.uri,
        id: project.id,
        name: project.name,
        description: project.description,
        flagged: project.flagged,
        visibility: project.visibility ?? "PUBLIC",
        status: project.status,
    };
}

function withDemoData<T>(items: T[], demoItems: T[]) {
    return process.env.NODE_ENV === "production" || items.length > 0 ? items : demoItems;
}

function mergeUsers(users: User[]) {
    const byUsername = new Map<string, User>();
    users.forEach((user) => {
        byUsername.set(user.username, {
            ...byUsername.get(user.username),
            ...user,
        });
    });
    return Array.from(byUsername.values());
}

export default async function AdminPage() {
    const userService = new UsersService(serverAuthProvider);
    const currentUser = await userService.getCurrentUser().catch(() => null);

    if (!currentUser) {
        redirect("/login");
    }

    if (!isAdminUser(currentUser)) {
        redirect(`/users/${encodeURIComponent(currentUser.username)}`);
    }

    const assetService = new AssetService(serverAuthProvider);
    const creatorService = new CreatorService(serverAuthProvider);
    const portfolioService = new PortfolioService(serverAuthProvider);
    const projectService = new ProjectService(serverAuthProvider);
    const canManageAll = isAdminUser(currentUser);

    let assets: Asset[] = [];
    let creators: Creator[] = [];
    let portfolios: Portfolio[] = [];
    let projects: Project[] = [];
    let users: User[] = [];
    let admins: User[] = [];
    const loadErrors: string[] = [];

    try {
        users = await userService.getUsers();
    } catch {
        loadErrors.push("Users could not be loaded.");
    }

    try {
        admins = await userService.getAdmins();
    } catch {
        loadErrors.push("Admins could not be loaded.");
    }

    try {
        creators = canManageAll ? await creatorService.getCreators() : [];
    } catch {
        loadErrors.push("Creators could not be loaded.");
    }

    try {
        portfolios = await portfolioService.getPortfolios();
    } catch {
        loadErrors.push("Portfolios could not be loaded.");
    }

    try {
        projects = await projectService.getProjects();
    } catch {
        loadErrors.push("Projects could not be loaded.");
    }

    try {
        assets = canManageAll ? await assetService.getAssets() : [];
    } catch {
        loadErrors.push("Assets could not be loaded.");
    }

    const initialAssets = withDemoData(assets.map(toAssetEntity), demoAssets);
    const initialCreators = withDemoData(creators.map(toCreatorEntity), demoCreators);
    const initialPortfolios = withDemoData(portfolios.map(toPortfolioEntity), demoPortfolios);
    const initialProjects = withDemoData(projects.map(toProjectEntity), demoProjects);
    const allUsers = mergeUsers([...users, ...admins]);
    const initialUsers = withDemoData(allUsers.map(toUserEntity), demoUsers);

    if (process.env.NODE_ENV !== "production" && (assets.length === 0 || creators.length === 0 || portfolios.length === 0 || projects.length === 0 || allUsers.length === 0)) {
        loadErrors.push("Showing development test data for empty collections.");
    }

    return (
        <AdminPanel
            currentUser={toUserEntity(currentUser)}
            initialAssets={initialAssets}
            initialCreators={initialCreators}
            initialPortfolios={initialPortfolios}
            initialProjects={initialProjects}
            initialUsers={initialUsers}
            loadErrors={loadErrors}
        />
    );
}
