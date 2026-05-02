"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm, SubmitHandler } from "react-hook-form";
import { useAuth } from "@/app/components/authentication";
import { deleteCookie, setCookie } from "cookies-next";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";

type FormValues = {
    username: string;
    password: string;
};

export default function LoginPage() {
    const router = useRouter();
    const { setUser } = useAuth();
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>();
    const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

    async function login(username: string, password: string) {
        setErrorMessage(null);
        const authorization = `Basic ${btoa(`${username}:${password}`)}`;
        setCookie("MYPORTFOLIOS_AUTH", authorization, {
            path: "/",
            secure: true,
            sameSite: "strict",
            httpOnly: false,
        });
        const service = new UsersService(clientAuthProvider());
        const user = await service.getCurrentUser();
        setUser(user);
    }

    const onSubmit: SubmitHandler<FormValues> = (data) => {
        login(data.username, data.password).then(() => {
            router.push(`/users/${data.username}`);
        }).catch(() => {
            deleteCookie("MYPORTFOLIOS_AUTH");
            setErrorMessage("Login failed");
        });
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-900 to-blue-950 font-sans text-white">
            <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
                <div className="flex flex-col items-center w-full gap-6 text-center">
                    <Card className="w-full max-w-md bg-white/10 border-white/20 text-white backdrop-blur-md shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">Sign In</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 text-left">
                                {errorMessage && ( // Display error message if present
                                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                                )}
                                <div>
                                    <Label htmlFor="username">Username</Label> {/* Changed htmlFor to username */}
                                    <Input
                                        id="username"
                                        {...register("username", { required: "Username is required" })}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        {...register("password", {
                                            required: "Password is required"
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="mt-4 bg-white text-black hover:bg-gray-200 text-base font-semibold py-2" disabled={isSubmitting}>
                                    {isSubmitting ? "Signing in..." : "Sign in"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
