"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/components/authentication";
import { Plus } from "lucide-react";

export default function CreatePortfolioButton() {
    const { user } = useAuth();

    if (!user) return null;

    return (
        <Link href="/portfolio/create">
            <Button size="sm" className="gap-1">
                <Plus className="h-4 w-4" />
                New Portfolio
            </Button>
        </Link>
    );
}
