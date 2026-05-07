import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { PortfolioService } from "@/api/portfolioApi";
import { serverAuthProvider } from "@/lib/authProvider";

export default async function PortfolioListPage() {
    const service = new PortfolioService(serverAuthProvider);
    const portfolios = await service.getPortfolios();

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-2xl font-semibold mb-6">Portfolios</h1>

                    {portfolios.length === 0 ? (
                        <p className="text-gray-500">No portfolios yet.</p>
                    ) : (
                        <div className="grid gap-4 w-full sm:grid-cols-2">
                            {portfolios.map((portfolio, i) => {
                                const id = portfolio.uri?.split("/").pop();
                                return (
                                    <Link key={i} href={`/portfolio/${id}`}>
                                        <Card className="hover:shadow-md transition cursor-pointer h-full">
                                            <CardHeader>
                                                <CardTitle>{portfolio.name}</CardTitle>
                                                {portfolio.description && (
                                                    <CardDescription>{portfolio.description}</CardDescription>
                                                )}
                                            </CardHeader>
                                            {portfolio.image && (
                                                <CardContent>
                                                    <img
                                                        src={portfolio.image}
                                                        alt={portfolio.name}
                                                        className="w-full h-40 object-cover rounded-md"
                                                    />
                                                </CardContent>
                                            )}
                                        </Card>
                                    </Link>
                                );
                            })}
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
