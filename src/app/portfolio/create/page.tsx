"use client";

import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { PortfolioService } from "@/api/portfolioApi";
import { Portfolio } from "@/types/portfolio";
import { clientAuthProvider } from "@/lib/authProvider";

type FormValues = {
    name: string;
    description: string;
    image: string;
};

export default function CreatePortfolioPage() {
    const service = new PortfolioService(clientAuthProvider());
    const router = useRouter();
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        setErrorMessage(null);
        service.createPortfolio(data as Portfolio).then(() => {
            router.push("/portfolio");
        }).catch(() => {
            setErrorMessage("Error al crear el portfolio");
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>Nuevo Portfolio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                {errorMessage && (
                                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                                )}

                                <div>
                                    <Label htmlFor="name">Nombre</Label>
                                    <Input
                                        id="name"
                                        {...register("name", { required: "El nombre es obligatorio" })}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-600 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="description">Descripción</Label>
                                    <Textarea
                                        id="description"
                                        {...register("description", { required: "La descripción es obligatoria" })}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-600 mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="image">URL de imagen</Label>
                                    <Input
                                        id="image"
                                        type="url"
                                        placeholder="https://ejemplo.com/imagen.jpg"
                                        {...register("image", {
                                            pattern: {
                                                value: /^https?:\/\/.+/,
                                                message: "Introduce una URL válida",
                                            },
                                        })}
                                    />
                                    {errors.image && (
                                        <p className="text-sm text-red-600 mt-1">{errors.image.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="mt-2" disabled={isSubmitting}>
                                    {isSubmitting ? "Creando..." : "Crear Portfolio"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
