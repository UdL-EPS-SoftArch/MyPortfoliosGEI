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
        <div className="flex min-h-screen items-center justify-center bg-black px-5 py-24 font-sans text-white">
            <main className="w-full max-w-2xl">
                <div className="mb-8 text-center sm:text-left">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                        Portfolio
                    </p>
                    <h1 className="mt-2 text-4xl font-extrabold tracking-tight text-white">
                        Crear portfolio
                    </h1>
                    <p className="mt-3 text-base leading-7 text-gray-300">
                        Define la informacion principal y despues podras ampliar el contenido.
                    </p>
                </div>

                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <Card className="w-full border-white/20 bg-white/10 text-white shadow-2xl backdrop-blur-md">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold">Nuevo portfolio</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4">
                                {errorMessage && (
                                    <p className="rounded-md border border-red-400/30 bg-red-500/10 px-3 py-2 text-sm text-red-200">
                                        {errorMessage}
                                    </p>
                                )}

                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-300 font-medium">Nombre</Label>
                                    <Input
                                        id="name"
                                        className="h-12 border-white/20 bg-black/20 px-4 text-white placeholder:text-gray-400 focus-visible:ring-white/40"
                                        {...register("name", { required: "El nombre es obligatorio" })}
                                    />
                                    {errors.name && (
                                        <p className="text-sm text-red-300 mt-1">{errors.name.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="description" className="text-gray-300 font-medium">Descripcion</Label>
                                    <Textarea
                                        id="description"
                                        className="min-h-40 border-white/20 bg-black/20 px-4 py-3 text-white placeholder:text-gray-400 focus-visible:ring-white/40"
                                        {...register("description", {
                                            maxLength: {
                                                value: 2000,
                                                message: "La descripcion debe tener 2000 caracteres o menos",
                                            },
                                        })}
                                    />
                                    {errors.description && (
                                        <p className="text-sm text-red-300 mt-1">{errors.description.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="visibility" className="text-gray-300 font-medium">Visibilidad</Label>
                                    <select
                                        id="visibility"
                                        className="flex h-12 w-full rounded-md border border-white/20 bg-black/20 px-4 py-2 text-sm text-white shadow-sm outline-none transition focus:border-white focus:ring-1 focus:ring-white/40"
                                        {...register("visibility", { required: true })}
                                    >
                                        <option className="bg-slate-950" value="PUBLIC">Publico</option>
                                        <option className="bg-slate-950" value="UNLISTED">No listado</option>
                                        <option className="bg-slate-950" value="PRIVATE">Privado</option>
                                    </select>
                                </div>

                                <div className="flex flex-col gap-3 pt-3 sm:flex-row">
                                    <Button type="submit" disabled={isSubmitting} className="flex-1 bg-white text-black hover:bg-gray-200">
                                        {isSubmitting ? "Creando..." : "Crear portfolio"}
                                    </Button>
                                    <Link href="/portfolio" className="flex-1">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            className="w-full border-white/20 bg-white/10 text-white hover:bg-white/20 hover:text-white"
                                        >
                                            Cancelar
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
