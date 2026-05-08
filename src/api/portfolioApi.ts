import { deleteHal, getHal, mergeHal, mergeHalArray, patchHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import type { Portfolio, PortfolioEntity } from "@/types/portfolio";

export class PortfolioService {
    constructor(private authProvider: AuthProvider) {
    }

    async getPortfolios(): Promise<Portfolio[]> {
        const resource = await getHal("/portfolios", this.authProvider);
        const embedded = resource.embeddedArray("portfolios") || [];
        return mergeHalArray<Portfolio>(embedded);
    }

    async updatePortfolio(portfolio: Pick<PortfolioEntity, "uri">, updates: Partial<PortfolioEntity>): Promise<Portfolio> {
        const resource = await patchHal(portfolio.uri, updates, this.authProvider);
        return mergeHal<Portfolio>(resource);
    }

    async deletePortfolio(portfolio: Pick<PortfolioEntity, "uri">): Promise<void> {
        await deleteHal(portfolio.uri, this.authProvider);
    }
}
