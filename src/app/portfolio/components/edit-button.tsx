"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/components/authentication";
import { Pencil } from "lucide-react";

type Props = {
    portfolioId: string;
    creatorUsername?: string;
};

export default function EditPortfolioButton({ portfolioId, creatorUsername }: Props) {
    const { user } = useAuth();

    if (!user || (creatorUsername && user.username !== creatorUsername)) return null;

    return (
        <Link href={`/portfolio/${portfolioId}/edit`}>
            <Button size="sm" variant="outline" className="gap-1">
                <Pencil className="h-4 w-4" />
                Edit
            </Button>
        </Link>
    );
}
