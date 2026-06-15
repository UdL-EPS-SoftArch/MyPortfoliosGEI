import { getHal, mergeHal, mergeHalArray, postHal, patchHal, deleteHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Project, ProjectEntity } from "@/types/project";

function toProjectPayload(project: Partial<ProjectEntity>) {
    const payload = { ...project };
    const { isPrivate } = payload;

    delete payload.uri;
    delete payload.id;
    delete payload.isPrivate;

    if (typeof isPrivate === "boolean" && !payload.visibility) {
        payload.visibility = isPrivate ? "PRIVATE" : "PUBLIC";
    }

    return payload;
}

export class ProjectService {
    constructor(private authProvider: AuthProvider) {
    }

    async getProjects(): Promise<Project[]> {
        const resource = await getHal("/projects", this.authProvider);
        const embedded = resource.embeddedArray("projects") || [];
        return mergeHalArray<Project>(embedded);
    }

    async getProjectById(id: string): Promise<Project> {
        const resource = await getHal(`/projects/${id}`, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async getProjectsByCreator(user: { uri?: string }): Promise<Project[]> {
        if (!user.uri) return [];
        const resource = await getHal(
            `/projects/search/findByCreator?creator=${encodeURIComponent(user.uri)}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray("projects") || [];
        return mergeHalArray<Project>(embedded);
    }

    async getProjectsByPortfolio(portfolioId: string): Promise<Project[]> {
        const resource = await getHal(
            `/projects/search/findByPortfolio?portfolio=/portfolios/${portfolioId}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray("projects") || [];
        return mergeHalArray<Project>(embedded);
    }

    async createProject(project: Partial<ProjectEntity>): Promise<Project> {
        const resource = await postHal("/projects", toProjectPayload(project), this.authProvider);
        return mergeHal<Project>(resource);
    }

    async updateProject(id: string | undefined, project: Partial<ProjectEntity>): Promise<Project> {
        const resource = await patchHal(`/projects/${id}`, toProjectPayload(project), this.authProvider);
        return mergeHal<Project>(resource);
    }

    async patchProject(id: string, project: Partial<ProjectEntity>): Promise<Project> {
        const resource = await patchHal(`/projects/${id}`, project, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async deleteProject(id: string | undefined): Promise<void> {
        await deleteHal(`/projects/${id}`, this.authProvider);
    }

    async getProjectRelation<T>(project: Project, relation: string): Promise<T> {
        const resource = await getHal(project.link(relation).href, this.authProvider);
        return mergeHal<T>(resource);
    }
}
