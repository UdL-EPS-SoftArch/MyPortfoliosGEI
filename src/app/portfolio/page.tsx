/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import { PortfolioService } from "@/api/portfolioApi";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";
import PortfolioWorkspace from "@/app/portfolio/components/portfolio-workspace";

type Props = {
    searchParams?: Promise<{ q?: string | string[] }>;
};

function getPortfolioId(uri?: string) {
    return uri?.split("/").pop() || "";
}

export default async function PortfolioListPage({ searchParams }: Props) {
    const params = await searchParams;
    const queryParam = Array.isArray(params?.q) ? params?.q[0] : params?.q;
    const searchQuery = queryParam?.trim() || "";
    const service = new PortfolioService(serverAuthProvider);
    const userService = new UsersService(serverAuthProvider);
    const [portfolios, currentUser] = await Promise.all([
        service.getPortfolios(),
        userService.getCurrentUser().catch(() => null),
    ]);

    const ownPortfolios = currentUser?.uri
        ? await service.getPortfoliosByCreator(currentUser).catch(() => [])
        : [];

    const ownUris = new Set(ownPortfolios.map((portfolio) => portfolio.uri));
    const recommendedPortfolios = portfolios.filter((portfolio) => !ownUris.has(portfolio.uri));
    const basePortfolios = searchQuery ? portfolios : recommendedPortfolios.length ? recommendedPortfolios : portfolios;
    const visiblePortfolios = searchQuery
        ? basePortfolios.filter((portfolio) => {
            const haystack = `${portfolio.name} ${portfolio.description || ""}`.toLowerCase();
            return haystack.includes(searchQuery.toLowerCase());
        })
        : basePortfolios;

    return (
        <PortfolioWorkspace
            ownPortfolios={ownPortfolios}
            searchQuery={searchQuery}
            canManagePortfolios={Boolean(currentUser)}
        >
            <section className="mx-auto w-full max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                        {searchQuery ? "Resultados de busqueda" : "Recomendados"}
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        {searchQuery ? `Portfolios para "${searchQuery}"` : "Portfolios recomendados"}
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-gray-300">
                        {searchQuery
                            ? "Explora portfolios publicados por otros usuarios y abre cualquiera para ver su contenido."
                            : "Selecciona un portfolio propio en la barra lateral o revisa creaciones destacadas de la comunidad."}
                    </p>
                </div>

                {visiblePortfolios.length === 0 ? (
                    <div className="rounded-md border border-white/15 bg-white/10 p-8 text-gray-300 backdrop-blur-md">
                        No hay portfolios para mostrar.
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {visiblePortfolios.map((portfolio) => {
                            const id = getPortfolioId(portfolio.uri);
                            return (
                                <Link
                                    key={portfolio.uri || portfolio.name}
                                    href={`/portfolio/${id}`}
                                    className="group overflow-hidden rounded-md border border-white/15 bg-white/10 text-white shadow-2xl backdrop-blur-md transition hover:border-white/40 hover:bg-white/15"
                                >
                                    <div className="aspect-[16/9] w-full bg-black/30">
                                        {portfolio.image ? (
                                            <img
                                                src={portfolio.image}
                                                alt={portfolio.name}
                                                className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                                            />
                                        ) : (
                                            <div className="flex h-full items-center justify-center text-sm font-medium text-gray-400">
                                                Sin imagen
                                            </div>
                                        )}
                                    </div>
                                    <div className="p-5">
                                        <h2 className="text-xl font-bold">{portfolio.name}</h2>
                                        {portfolio.description && (
                                            <p className="mt-3 line-clamp-3 text-sm leading-6 text-gray-300">
                                                {portfolio.description}
                                            </p>
                                        )}
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                )}
            </section>
        </PortfolioWorkspace>
    );
}
