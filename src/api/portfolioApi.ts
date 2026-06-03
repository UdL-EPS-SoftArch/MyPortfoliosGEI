import { deleteHal, getHal, mergeHal, mergeHalArray, patchHal, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Portfolio, PortfolioEntity } from "@/types/portfolio";
import { User } from "@/types/user";

export class PortfolioService {
    constructor(private authProvider: AuthProvider) {
    }

    async getPortfolios(): Promise<Portfolio[]> {
        const resource = await getHal('/portfolios', this.authProvider);
        const embedded = resource.embeddedArray('portfolios') || [];
        return mergeHalArray<Portfolio>(embedded);
    }

    async getPortfolioById(id: string): Promise<Portfolio> {
        const resource = await getHal(`/portfolios/${id}`, this.authProvider);
        return mergeHal<Portfolio>(resource);
    }

    async getPortfoliosByCreator(creator: User): Promise<Portfolio[]> {
        const resource = await getHal(
            `/portfolios/search/findByCreator?user=${creator.uri}`, this.authProvider);
        const embedded = resource.embeddedArray('portfolios') || [];
        return mergeHalArray<Portfolio>(embedded);
    }

    async createPortfolio(portfolio: Omit<PortfolioEntity, "uri">): Promise<Portfolio> {
        const resource = await postHal('/portfolios', portfolio, this.authProvider);
        return mergeHal<Portfolio>(resource);
    }

    async updatePortfolio(id: string, partial: Partial<Portfolio>): Promise<Portfolio> {
        const resource = await patchHal(`/portfolios/${id}`, partial, this.authProvider);
        return mergeHal<Portfolio>(resource);
    }

    async deletePortfolio(id: string): Promise<void> {
        await deleteHal(`/portfolios/${id}`, this.authProvider);
    }

    async getPortfolioRelation<T>(portfolio: Portfolio, relation: string): Promise<T> {
        const resource = await getHal(portfolio.link(relation).href, this.authProvider);
        return mergeHal<T>(resource);
    }
}
