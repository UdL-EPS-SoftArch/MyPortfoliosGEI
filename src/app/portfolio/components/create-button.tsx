"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/components/authentication";
import { Plus } from "lucide-react";

type Props = {
    forceVisible?: boolean;
};

export default function CreatePortfolioButton({ forceVisible = false }: Props) {
    const { user } = useAuth();

    if (!forceVisible && !user) return null;

    return (
        <Link href="/portfolio/create">
            <Button size="sm" className="gap-1 bg-white text-black hover:bg-gray-200">
                <Plus className="h-4 w-4" />
                Crear
            </Button>
        </Link>
    );
}
