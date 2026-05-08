import { redirect } from "next/navigation";
import AdminPanel from "@/app/admin/AdminPanel";
import { demoAssets, demoPortfolios, demoProjects } from "@/app/admin/testData";
import { AssetService } from "@/api/assetApi";
import { PortfolioService } from "@/api/portfolioApi";
import { ProjectService } from "@/api/projectApi";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";
import type { Asset, AssetEntity } from "@/types/asset";
import type { Portfolio, PortfolioEntity } from "@/types/portfolio";
import type { Project, ProjectEntity } from "@/types/project";
import type { User, UserEntity } from "@/types/user";

function isAdmin(user: User) {
    return user.role === "ADMIN"
        || user.role === "SUPERADMIN"
        || user.authorities?.some((authority) => authority.authority === "ROLE_ADMIN" || authority.authority === "ADMIN") === true;
}

function toUserEntity(user: User): UserEntity {
    return {
        uri: user.uri,
        username: user.username,
        email: user.email,
        role: user.role,
        authorities: user.authorities,
    };
}

function toAssetEntity(asset: Asset): AssetEntity {
    return {
        uri: asset.uri,
        id: asset.id,
        name: asset.name,
        description: asset.description,
    };
}

function toPortfolioEntity(portfolio: Portfolio): PortfolioEntity {
    return {
        uri: portfolio.uri,
        id: portfolio.id,
        name: portfolio.name,
        description: portfolio.description,
        visibility: portfolio.visibility,
    };
}

function toProjectEntity(project: Project): ProjectEntity {
    return {
        uri: project.uri,
        id: project.id,
        name: project.name,
        description: project.description,
        flagged: project.flagged,
        visibility: project.visibility,
    };
}

function withDemoData<T>(items: T[], demoItems: T[]) {
    return process.env.NODE_ENV === "production" || items.length > 0 ? items : demoItems;
}

export default async function AdminPage() {
    const userService = new UsersService(serverAuthProvider);
    const currentUser = await userService.getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    const assetService = new AssetService(serverAuthProvider);
    const portfolioService = new PortfolioService(serverAuthProvider);
    const projectService = new ProjectService(serverAuthProvider);
    const canManageAll = isAdmin(currentUser);

    let assets: Asset[] = [];
    let portfolios: Portfolio[] = [];
    let projects: Project[] = [];
    const loadErrors: string[] = [];

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
    const initialPortfolios = withDemoData(portfolios.map(toPortfolioEntity), demoPortfolios);
    const initialProjects = withDemoData(projects.map(toProjectEntity), demoProjects);

    if (process.env.NODE_ENV !== "production" && (assets.length === 0 || portfolios.length === 0 || projects.length === 0)) {
        loadErrors.push("Showing development test data for empty collections.");
    }

    return (
        <AdminPanel
            currentUser={toUserEntity(currentUser)}
            initialAssets={initialAssets}
            initialPortfolios={initialPortfolios}
            initialProjects={initialProjects}
            loadErrors={loadErrors}
        />
    );
}
