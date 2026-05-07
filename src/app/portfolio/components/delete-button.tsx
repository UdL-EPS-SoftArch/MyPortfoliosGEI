"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/app/components/authentication";
import { PortfolioService } from "@/api/portfolioApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { Trash2 } from "lucide-react";

type Props = {
    portfolioId: string;
    creatorUsername?: string;
};

export default function DeletePortfolioButton({ portfolioId, creatorUsername }: Props) {
    const { user } = useAuth();
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    if (!user || (creatorUsername && user.username !== creatorUsername)) return null;

    const onClick = () => {
        if (!window.confirm("Delete this portfolio? This action cannot be undone.")) return;

        setIsDeleting(true);
        setErrorMessage(null);

        const service = new PortfolioService(clientAuthProvider());
        service.deletePortfolio(portfolioId).then(() => {
            router.push("/portfolio");
            router.refresh();
        }).catch((error: Error) => {
            setErrorMessage(error.message || "Failed to delete portfolio");
            setIsDeleting(false);
        });
    };

    return (
        <div className="flex flex-col items-end gap-1">
            <Button
                size="sm"
                variant="destructive"
                className="gap-1"
                onClick={onClick}
                disabled={isDeleting}
            >
                <Trash2 className="h-4 w-4" />
                {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            {errorMessage && (
                <p className="text-xs text-red-600">{errorMessage}</p>
            )}
        </div>
    );
}
