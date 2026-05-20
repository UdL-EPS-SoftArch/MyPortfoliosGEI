"use client";

import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { User } from "@/types/user";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { useAuth } from "@/app/components/authentication";
import { setCookie } from "cookies-next";

type FormValues = {
    username: string;
    email: string;
    password: string;
    confirmPassword?: string;
};

export default function RegistrationPage() {
    const service = new UsersService(clientAuthProvider());
    const { setUser } = useAuth();
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors, isSubmitting },
    } = useForm<FormValues>();

    React.useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const e = params.get("email");
        if (e) setValue("email", e);
    }, [setValue]);

    const [errorMessage, setErrorMessage] = React.useState<string | null>(null);

    const router = useRouter();

    const onSubmit: SubmitHandler<FormValues> = async (data) => {
        setErrorMessage(null);
        try {
            await service.createUser(data as User);
        } catch (err: any) {
            setErrorMessage(err.message || "Registration failed");
            return;
        }
        const authorization = `Basic ${btoa(`${data.username}:${data.password}`)}`;
        setCookie("MYPORTFOLIOS_AUTH", authorization, {
            path: "/",
            sameSite: "lax",
        });
        setUser({
            username: data.username,
            email: data.email,
            authorities: [{ authority: "ROLE_USER" }],
        } as User);
        router.push("/portfolio");
        router.refresh();
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-black via-slate-900 to-blue-950 font-sans text-white">
            <main className="flex w-full max-w-3xl flex-col items-center justify-center py-32 px-16">
                <div className="flex flex-col items-center w-full gap-6 text-center">
                    <Card className="w-full max-w-md bg-white/10 border-white/20 text-white backdrop-blur-md shadow-2xl">
                        <CardHeader>
                            <CardTitle className="text-3xl font-bold">Register</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 text-left">
                                {errorMessage && (
                                    <p className="text-sm text-red-600 mt-1">{errorMessage}</p>
                                )}
                                <div className="space-y-2">
                                    <Label htmlFor="username" className="text-gray-300 font-medium">Name</Label>
                                    <Input
                                        id="username"
                                        className="bg-black/20 border-white/20 text-white focus-visible:ring-white/40 h-12 px-4 placeholder-gray-400"
                                        {...register("username", { required: "Username is required" })}
                                    />
                                    {errors.username && (
                                        <p className="text-sm text-red-600 mt-1">{errors.username.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300 font-medium">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        className="bg-black/20 border-white/20 text-white focus-visible:ring-white/40 h-12 px-4 placeholder-gray-400"
                                        {...register("email", {
                                            required: "Email is required",
                                            pattern: {
                                                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                message: "Invalid email address",
                                            },
                                        })}
                                    />
                                    {errors.email && (
                                        <p className="text-sm text-red-600 mt-1">{errors.email.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-300 font-medium">Password</Label>
                                    <Input
                                        id="password"
                                        type="password"
                                        className="bg-black/20 border-white/20 text-white focus-visible:ring-white/40 h-12 px-4 placeholder-gray-400"
                                        {...register("password", {
                                            required: "Password is required",
                                            minLength: { value: 8, message: "Minimum 8 characters" },
                                            maxLength: { value: 256, message: "Maximum 256 characters" }
                                        })}
                                    />
                                    {errors.password && (
                                        <p className="text-sm text-red-600 mt-1">{errors.password.message}</p>
                                    )}
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-gray-300 font-medium">Confirm Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        className="bg-black/20 border-white/20 text-white focus-visible:ring-white/40 h-12 px-4 placeholder-gray-400"
                                        {...register("confirmPassword", {
                                            validate: (value, formValues) => value === formValues.password || "The passwords do not match"
                                        })}
                                    />
                                    {errors.confirmPassword && (
                                        <p className="text-sm text-red-600 mt-1">{errors.confirmPassword.message}</p>
                                    )}
                                </div>

                                <Button type="submit" className="mt-4 bg-white text-black hover:bg-gray-200 text-base font-semibold py-2" disabled={isSubmitting}>
                                    {isSubmitting ? "Registering..." : "Register"}
                                </Button>
                                <p className="text-sm text-center text-gray-300 mt-4">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-white font-medium hover:underline">
                                        Sign in
                                    </Link>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    );
}
