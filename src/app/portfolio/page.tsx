import Link from "next/link";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";

// TODO: Remove mock data and restore API calls
const mockUsers = [
    { username: "pedro", portfolioCount: 4 },
    { username: "maria", portfolioCount: 2 },
    { username: "carlos", portfolioCount: 3 },
];

export default async function PortfolioListPage() {
    const users = mockUsers;

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <h1 className="text-2xl font-semibold mb-6">Portfolios</h1>

                    <div className="grid gap-4 w-full sm:grid-cols-2">
                        {users.map((user, i) => (
                            <Link key={i} href={`/portfolio/${user.username}`}>
                                <Card className="hover:shadow-md transition cursor-pointer h-full">
                                    <CardHeader>
                                        <CardTitle>{user.username}</CardTitle>
                                        <CardDescription>
                                            {user.portfolioCount} portfolio{user.portfolioCount !== 1 ? "s" : ""}
                                        </CardDescription>
                                    </CardHeader>
                                </Card>
                            </Link>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    );
}
