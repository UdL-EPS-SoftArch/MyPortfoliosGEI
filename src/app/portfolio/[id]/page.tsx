/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PortfolioService } from "@/api/portfolioApi";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";
import EditPortfolioButton from "@/app/portfolio/components/edit-button";
import PortfolioWorkspace from "@/app/portfolio/components/portfolio-workspace";

export default async function PortfolioDetailPage(props: { params: Promise<{ id: string }> }) {
    const service = new PortfolioService(serverAuthProvider);
    const userService = new UsersService(serverAuthProvider);
    const { id } = await props.params;
    const [portfolio, currentUser] = await Promise.all([
        service.getPortfolioById(id),
        userService.getCurrentUser().catch(() => null),
    ]);
    const ownPortfolios = currentUser?.uri
        ? await service.getPortfoliosByCreator(currentUser).catch(() => [])
        : [];

    let creator: User | null = null;
    try {
        creator = await service.getPortfolioRelation<User>(portfolio, "creator");
    } catch (error) {
        console.log(error);
    }

    return (
        <PortfolioWorkspace
            ownPortfolios={ownPortfolios}
            activePortfolioId={id}
            canManagePortfolios={Boolean(currentUser)}
        >
            <article className="mx-auto w-full max-w-4xl rounded-md border border-white/15 bg-white/10 p-6 text-white shadow-2xl backdrop-blur-md sm:p-8 lg:p-10">
                <div className="mb-8 flex flex-col gap-5 border-b border-white/15 pb-6 sm:flex-row sm:items-start sm:justify-between">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                            Portfolio
                        </p>
                        <h1 className="mt-2 text-3xl font-extrabold tracking-tight sm:text-5xl">
                            {portfolio.name}
                        </h1>
                        <div className="mt-4 flex flex-wrap gap-3 text-sm text-gray-300">
                            {portfolio.visibility && <span>{portfolio.visibility}</span>}
                            {creator && (
                                <Link href={`/users/${creator.username}`} className="hover:text-white hover:underline">
                                    {creator.username}
                                </Link>
                            )}
                        </div>
                    </div>

                    <EditPortfolioButton
                        portfolioId={id}
                        creatorUsername={creator?.username}
                        forceVisible={Boolean(currentUser && creator && currentUser.username === creator.username)}
                    />
                </div>

                {portfolio.image && (
                    <img
                        src={portfolio.image}
                        alt={portfolio.name}
                        className="mb-8 aspect-[16/9] w-full rounded-md object-cover"
                    />
                )}

                <div className="prose prose-invert max-w-none">
                    {portfolio.description ? (
                        <p className="whitespace-pre-line text-lg leading-8 text-gray-200">
                            {portfolio.description}
                        </p>
                    ) : (
                        <p className="text-gray-300">
                            Este portfolio todavia no tiene contenido de texto.
                        </p>
                    )}
                </div>
            </article>
        </PortfolioWorkspace>
    );
}
