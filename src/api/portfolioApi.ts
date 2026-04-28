import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { Portfolio } from "@/types/portfolio";
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

    async getPortfoliosByOwnedBy(owner: User): Promise<Portfolio[]> {
        const resource = await getHal(
            `/portfolios/search/findByOwnedBy?user=${owner.uri}`, this.authProvider);
        const embedded = resource.embeddedArray('portfolios') || [];
        return mergeHalArray<Portfolio>(embedded);
    }

    async createPortfolio(portfolio: Portfolio): Promise<Portfolio> {
        const resource = await postHal('/portfolios', portfolio, this.authProvider);
        return mergeHal<Portfolio>(resource);
    }

    async getPortfolioRelation<T>(portfolio: Portfolio, relation: string): Promise<T> {
        const resource = await getHal(portfolio.link(relation).href, this.authProvider);
        return mergeHal<T>(resource);
    }
}
