import { getHal, mergeHal, mergeHalArray, postHal, putHal, patchHal, deleteHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Project } from "@/types/project";

export class ProjectService {
    constructor(private authProvider: AuthProvider) {
    }

    async getProjects(): Promise<Project[]> {
        const resource = await getHal('/projects', this.authProvider);
        const embedded = resource.embeddedArray('projects') || [];
        return mergeHalArray<Project>(embedded);
    }

    async getProjectById(id: string): Promise<Project> {
        const resource = await getHal(`/projects/${id}`, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async createProject(project: Partial<Project>): Promise<Project> {
        const resource = await postHal('/projects', project as any, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async updateProject(id: string, project: Partial<Project>): Promise<Project> {
        const resource = await putHal(`/projects/${id}`, project as any, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async patchProject(id: string, project: Partial<Project>): Promise<Project> {
        const resource = await patchHal(`/projects/${id}`, project as any, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async deleteProject(id: string): Promise<void> {
        await deleteHal(`/projects/${id}`, this.authProvider);
    }

    async getProjectRelation<T>(project: Project, relation: string): Promise<T> {
        const resource = await getHal(project.link(relation).href, this.authProvider);
        return mergeHal<T>(resource);
    }
}
