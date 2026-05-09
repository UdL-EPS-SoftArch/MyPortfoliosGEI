import { deleteHal, getHal, mergeHal, mergeHalArray, patchHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Project, ProjectEntity } from "@/types/project";

export class ProjectService {
    constructor(private authProvider: AuthProvider) {
    }

    async getProjects(): Promise<Project[]> {
        const resource = await getHal("/projects", this.authProvider);
        const embedded = resource.embeddedArray("projects") || [];
        return mergeHalArray<Project>(embedded);
    }

    async updateProject(project: Pick<ProjectEntity, "uri">, updates: Partial<ProjectEntity>): Promise<Project> {
        const resource = await patchHal(project.uri, updates, this.authProvider);
        return mergeHal<Project>(resource);
    }

    async deleteProject(project: Pick<ProjectEntity, "uri">): Promise<void> {
        await deleteHal(project.uri, this.authProvider);
    }
}
