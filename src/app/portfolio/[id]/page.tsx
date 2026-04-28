import Link from "next/link";
import { Card, CardHeader, CardDescription, CardTitle } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { User, Folder } from "lucide-react";
import CreatePortfolioButton from "@/app/portfolio/components/create-button";

// TODO: Remove mock data and restore API calls
const mockPortfoliosByUser: Record<string, { id: string; name: string; description: string; image?: string; created: Date }[]> = {
    pedro: [
        { id: "1", name: "Diseño Web Corporativo", description: "Rediseño completo del sitio web corporativo para una empresa tecnológica. Incluye sistema de diseño, responsive design y optimización de rendimiento.", image: "https://picsum.photos/800/400?random=1", created: new Date("2025-03-15") },
        { id: "2", name: "App Mobile E-commerce", description: "Aplicación móvil para tienda online con carrito de compras, pagos integrados y seguimiento de pedidos.", image: "https://picsum.photos/800/400?random=2", created: new Date("2025-06-20") },
        { id: "3", name: "Dashboard Analytics", description: "Panel de control con visualización de datos en tiempo real, gráficos interactivos y reportes automatizados.", image: "https://picsum.photos/800/400?random=3", created: new Date("2025-09-01") },
        { id: "4", name: "Branding Startup", description: "Identidad visual completa para startup fintech: logo, paleta de colores, tipografía y guidelines.", image: "https://picsum.photos/800/400?random=4", created: new Date("2025-11-10") },
    ],
    maria: [
        { id: "5", name: "UI Kit SaaS", description: "Kit de componentes reutilizables para plataformas SaaS.", image: "https://picsum.photos/800/400?random=5", created: new Date("2025-04-10") },
        { id: "6", name: "Landing Page Startup", description: "Diseño de landing page para captación de leads.", image: "https://picsum.photos/800/400?random=6", created: new Date("2025-07-22") },
    ],
};

export default async function PortfolioUserPage(props: { params: Promise<{ id: string }> }) {
    const { id: username } = await props.params;
    const portfolios = mockPortfoliosByUser[username] || [];

    return (
        <div className="flex min-h-screen bg-zinc-50 font-sans dark:bg-black">
            {/* Sidebar */}
            <aside className="w-64 border-r bg-white dark:bg-zinc-900 p-6 flex flex-col gap-6">
                <div className="flex flex-col items-center gap-3">
                    <Avatar className="w-16 h-16 rounded-full flex items-center justify-center bg-gray-200 dark:bg-zinc-700">
                        <User className="h-7 w-7 text-gray-500" />
                    </Avatar>
                    <Link
                        href={`/users/${username}`}
                        className="text-sm font-medium text-blue-600 hover:underline"
                    >
                        {username}
                    </Link>
                </div>

                <nav className="flex flex-col gap-2">
                    {portfolios.map((p, i) => (
                        <a
                            key={i}
                            href={`#portfolio-${p.id}`}
                            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800 transition"
                        >
                            <Folder className="h-4 w-4" />
                            <span className="truncate">{p.name}</span>
                        </a>
                    ))}
                </nav>

                <div className="mt-auto">
                    <CreatePortfolioButton ownerUsername={username} />
                </div>
            </aside>

            {/* Main content */}
            <main className="flex-1 p-10 bg-white dark:bg-black overflow-y-auto">
                <div className="max-w-2xl space-y-10">
                    <h1 className="text-3xl font-bold">Portfolio de {username}</h1>

                    {portfolios.length === 0 && (
                        <p className="text-gray-500">Este usuario no tiene portfolios todavía.</p>
                    )}

                    {portfolios.map((portfolio) => (
                        <Card key={portfolio.id} id={`portfolio-${portfolio.id}`} className="overflow-hidden">
                            <CardHeader>
                                <CardTitle>{portfolio.name}</CardTitle>
                                <CardDescription>{portfolio.description}</CardDescription>
                                {portfolio.created && (
                                    <p className="text-xs text-gray-400 mt-1">
                                        Creado: {new Date(portfolio.created).toLocaleDateString()}
                                    </p>
                                )}
                            </CardHeader>
                            {portfolio.image && (
                                <img
                                    src={portfolio.image}
                                    alt={portfolio.name}
                                    className="w-full h-64 object-cover"
                                />
                            )}
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
