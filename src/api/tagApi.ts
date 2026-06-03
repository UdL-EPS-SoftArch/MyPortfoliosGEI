import { deleteHal, getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Tag, TagEntity } from "@/types/tag";

export class TagService {
    constructor(private authProvider: AuthProvider) {
    }

    async getTags(): Promise<Tag[]> {
        const resource = await getHal("/tags", this.authProvider);
        const embedded = resource.embeddedArray("tags") || [];
        return mergeHalArray<Tag>(embedded);
    }

    async getTagById(id: string): Promise<Tag> {
        const resource = await getHal(`/tags/${id}`, this.authProvider);
        return mergeHal<Tag>(resource);
    }

    async createTag(tag: Pick<TagEntity, "name">): Promise<Tag> {
        const resource = await postHal("/tags", tag, this.authProvider);
        return mergeHal<Tag>(resource);
    }

    async deleteTag(tag: Pick<TagEntity, "uri">): Promise<void> {
        await deleteHal(tag.uri, this.authProvider);
    }
}
