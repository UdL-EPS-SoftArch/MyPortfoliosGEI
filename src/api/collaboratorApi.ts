import { deleteHal, getHal, mergeHal, mergeHalArray, patchHal, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Collaborator, CollaboratorAction, CollaboratorEntity } from "@/types/collaborator";

export class CollaboratorService {
    constructor(private authProvider: AuthProvider) {
    }

    /** All collaborators for a given project URI. */
    async getByProject(projectUri: string): Promise<Collaborator[]> {
        const resource = await getHal(
            `/collaborators/search/findByProject?project=${projectUri}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray("collaborators") || [];
        return mergeHalArray<Collaborator>(embedded);
    }

    /** All projects a user collaborates on (by user URI). */
    async getByUser(userUri: string): Promise<Collaborator[]> {
        const resource = await getHal(
            `/collaborators/search/findByUser?user=${userUri}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray("collaborators") || [];
        return mergeHalArray<Collaborator>(embedded);
    }

    async addCollaborator(
        userUri: string,
        projectUri: string,
        action: CollaboratorAction
    ): Promise<Collaborator> {
        const payload = { user: userUri, project: projectUri, action };
        const resource = await postHal("/collaborators", payload, this.authProvider);
        return mergeHal<Collaborator>(resource);
    }

    async updateAction(
        collaborator: Pick<CollaboratorEntity, "uri">,
        action: CollaboratorAction
    ): Promise<Collaborator> {
        const resource = await patchHal(collaborator.uri, { action }, this.authProvider);
        return mergeHal<Collaborator>(resource);
    }

    async removeCollaborator(collaborator: Pick<CollaboratorEntity, "uri">): Promise<void> {
        await deleteHal(collaborator.uri, this.authProvider);
    }
}
