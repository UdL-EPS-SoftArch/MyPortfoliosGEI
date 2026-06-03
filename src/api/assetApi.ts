import { deleteHal, getHal, mergeHal, mergeHalArray, patchHal, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Asset, AssetEntity } from "@/types/asset";

export class AssetService {
    constructor(private authProvider: AuthProvider) {
    }

    async getAssets(): Promise<Asset[]> {
        const resource = await getHal("/assets", this.authProvider);
        const embedded = resource.embeddedArray("assets") || [];
        return mergeHalArray<Asset>(embedded);
    }

    async getAssetById(id: string): Promise<Asset> {
        const resource = await getHal(`/assets/${id}`, this.authProvider);
        return mergeHal<Asset>(resource);
    }

    async getAssetsByProject(projectUri: string): Promise<Asset[]> {
        const resource = await getHal(
            `/assets/search/findByBelongsTo?project=${projectUri}`,
            this.authProvider
        );
        const embedded = resource.embeddedArray("assets") || [];
        return mergeHalArray<Asset>(embedded);
    }

    async createAsset(asset: Omit<AssetEntity, "uri">): Promise<Asset> {
        const resource = await postHal("/assets", asset, this.authProvider);
        return mergeHal<Asset>(resource);
    }

    async updateAsset(asset: Pick<AssetEntity, "uri">, updates: Partial<AssetEntity>): Promise<Asset> {
        const resource = await patchHal(asset.uri, updates, this.authProvider);
        return mergeHal<Asset>(resource);
    }

    async deleteAsset(asset: Pick<AssetEntity, "uri">): Promise<void> {
        await deleteHal(asset.uri, this.authProvider);
    }
}
