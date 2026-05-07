"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PortfolioService } from "@/api/portfolioApi";
import { Portfolio, Visibility } from "@/types/portfolio";
import { clientAuthProvider } from "@/lib/authProvider";

type FormValues = {
    name: string;
    description: string;
    visibility: Visibility;
};

export default function CreatePortfolioPage() {
    const service = new PortfolioService(clientAuthProvider());
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>({
        defaultValues: { visibility: "PUBLIC" },
    });

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setErrorMessage(null);
        service.createPortfolio(data as Portfolio).then(() => {
            router.push("/portfolio");
        }).catch((error: Error) => {
            setErrorMessage(error.message || "Failed to create portfolio");
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>New Portfolio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                {errorMessage && (
                                    <p className="text-sm text-red-600">{errorMessage}</p>
                                )}

                                <div>
                                    <Label htmlFor="name">Name</Label>
                                    <Input
                                        id="name"
                                        {...register("name", { required: "Name is required" })}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Description</Label>
                                    <Textarea
                                        id="description"
                                        {...register("description", {
                                            maxLength: {
                                                value: 2000,
                                                message: "Description must be 2000 characters or less",
                                            },
                                        })}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="visibility">Visibility</Label>
                                    <select
                                        id="visibility"
                                        className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                                        {...register("visibility", { required: true })}
                                    >
                                        <option value="PUBLIC">Public</option>
                                        <option value="UNLISTED">Unlisted</option>
                                        <option value="PRIVATE">Private</option>
                                    </select>
                                </div>

                                <div className="flex gap-2 mt-2">
                                    <Button type="submit" disabled={isSubmitting} className="flex-1">
                                        {isSubmitting ? "Creating..." : "Create Portfolio"}
                                    </Button>
                                    <Link href="/portfolio" className="flex-1">
                                        <Button type="button" variant="outline" className="w-full">
                                            Cancel
                                        </Button>
                                    </Link>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
