"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/components/authentication";
import { Pencil } from "lucide-react";

type Props = {
    portfolioId: string;
    creatorUsername?: string;
    forceVisible?: boolean;
};

export default function EditPortfolioButton({ portfolioId, creatorUsername, forceVisible = false }: Props) {
    const { user } = useAuth();

    if (!forceVisible && (!user || (creatorUsername && user.username !== creatorUsername))) return null;

    return (
        <Link href={`/portfolio/${portfolioId}/edit`}>
            <Button size="sm" variant="outline" className="gap-1 border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white">
                <Pencil className="h-4 w-4" />
                Editar
            </Button>
        </Link>
    );
}
