import Link from "next/link";
import { PortfolioService } from "@/api/portfolioApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";

export default async function PortfolioDetailPage(props: { params: Promise<{ id: string }> }) {
    const service = new PortfolioService(serverAuthProvider);
    const { id } = await props.params;
    const portfolio = await service.getPortfolioById(id);

    let creator: User | null = null;
    try {
        creator = await service.getPortfolioRelation<User>(portfolio, "creator");
    } catch (error) {
        console.log(error);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <div className="space-y-4 w-full">
                        <h1 className="text-2xl font-semibold">{portfolio.name}</h1>

                        {portfolio.description && (
                            <p className="text-gray-700">{portfolio.description}</p>
                        )}

                        {portfolio.visibility && (
                            <p className="text-gray-700">
                                <strong>Visibility:</strong> {portfolio.visibility}
                            </p>
                        )}

                        {creator && (
                            <p className="text-gray-700">
                                <strong>Creator:</strong>{" "}
                                <Link href={`/users/${creator.username}`} className="hover:underline">
                                    {creator.username}
                                </Link>
                            </p>
                        )}
                    </div>
                </div>
            </main>
        </div>
    );
}
