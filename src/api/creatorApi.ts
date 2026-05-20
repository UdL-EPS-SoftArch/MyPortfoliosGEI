import { getHal, mergeHalArray } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Creator } from "@/types/creator";

function getResourceUsername(creator: Creator) {
    if (creator.username) return creator.username;
    if (creator.uri) return decodeURIComponent(creator.uri.split("/").filter(Boolean).pop() ?? "");

    const selfHref = creator.link?.("self")?.href;
    if (selfHref) return decodeURIComponent(selfHref.split("/").filter(Boolean).pop() ?? "");

    return "";
}

function normalizeCreator(creator: Creator): Creator {
    return {
        ...creator,
        username: getResourceUsername(creator),
    };
}

export class CreatorService {
    constructor(private authProvider: AuthProvider) {
    }

    async getCreators(): Promise<Creator[]> {
        const resource = await getHal("/creators", this.authProvider);
        const embedded = resource.embeddedArray("creators") || [];
        return mergeHalArray<Creator>(embedded).map(normalizeCreator);
    }
}
