"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { useAuth } from "@/app/components/authentication";

type ProfileFormValues = {
    username: string;
    email: string;
    name?: string;
    location?: string;
    twitter?: string;
    instagram?: string;
};

type PasswordFormValues = {
    newPassword: string;
    confirmPassword: string;
};

interface ProfileUser {
    uri?: string;
    username: string;
    email?: string;
    name?: string;
    location?: string;
    twitter?: string;
    instagram?: string;
    authorities?: { authority: string }[];
}

interface ProfileRecord {
    uri: string;
    name: string;
    description?: string;
    created?: string;
    modified?: string;
}

interface ProfileClientProps {
    user: ProfileUser;
    records: ProfileRecord[];
}

export default function ProfileClient({ user, records }: ProfileClientProps) {
    const { setUser } = useAuth();
    const service = new UsersService(clientAuthProvider());

    const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
    const [profileError, setProfileError] = useState<string | null>(null);
    const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
    const [passwordError, setPasswordError] = useState<string | null>(null);

    const {
        register: registerProfile,
        handleSubmit: handleSubmitProfile,
        reset: resetProfile,
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    } = useForm<ProfileFormValues>({
        defaultValues: {
            username: user.username,
            email: user.email ?? "",
            name: user.name ?? "",
            location: user.location ?? "",
            twitter: user.twitter ?? "",
            instagram: user.instagram ?? "",
        },
    });

    const {
        register: registerPassword,
        handleSubmit: handleSubmitPassword,
        reset: resetPassword,
        formState: { errors: passwordErrors, isSubmitting: isPasswordSubmitting },
    } = useForm<PasswordFormValues>();

    const onProfileSubmit: SubmitHandler<ProfileFormValues> = async (data) => {
        setProfileSuccess(null);
        setProfileError(null);
        try {
            const updated = await service.updateUser(user.username, {
                username: data.username,
                email: data.email,
                name: data.name,
                location: data.location,
                twitter: data.twitter,
                instagram: data.instagram,
            });
            setUser(updated);
            resetProfile({
                username: updated.username,
                email: updated.email ?? "",
                name: updated.name ?? "",
                location: updated.location ?? "",
                twitter: updated.twitter ?? "",
                instagram: updated.instagram ?? "",
            });
            setProfileSuccess("Profile updated successfully.");
        } catch {
            setProfileError("Failed to update profile. Please try again.");
        }
    };

    const onPasswordSubmit: SubmitHandler<PasswordFormValues> = async (data) => {
        setPasswordSuccess(null);
        setPasswordError(null);
        try {
            await service.changePassword(user.username, data.newPassword);
            resetPassword();
            setPasswordSuccess("Password changed successfully.");
        } catch {
            setPasswordError("Failed to change password. Please try again.");
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 py-12 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
            <main className="mx-auto grid max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-[320px_1fr] lg:px-8">
                <aside className="space-y-6 rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/40 backdrop-blur-xl dark:border-slate-800/60 dark:bg-slate-900/80 dark:shadow-none">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <Avatar className="h-24 w-24 rounded-full bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-200">
                            <FontAwesomeIcon icon={faUser} className="h-10 w-10" />
                        </Avatar>
                        <div>
                            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Profile</p>
                            <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">{user.name || user.username}</h1>
                            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">@{user.username}</p>
                        </div>
                    </div>

                    <div className="space-y-4 rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-700/60 dark:bg-slate-950/80">
                        {user.location && (
                            <div className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                                <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-200">L</span>
                                <span>{user.location}</span>
                            </div>
                        )}
                        {user.twitter && (
                            <Link href={user.twitter} className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
                                Twitter: {user.twitter.replace(/^https?:\/\//, "")}
                            </Link>
                        )}
                        {user.instagram && (
                            <Link href={user.instagram} className="block rounded-2xl bg-slate-100 px-4 py-3 text-sm text-slate-700 hover:bg-slate-200 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800">
                                Instagram: {user.instagram.replace(/^https?:\/\//, "")}
                            </Link>
                        )}
                    </div>

                    <div className="grid gap-4">
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 text-center dark:border-slate-700/60 dark:bg-slate-950/80">
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{records.length}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Records</p>
                        </div>
                        <div className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 text-center dark:border-slate-700/60 dark:bg-slate-950/80">
                            <p className="text-2xl font-semibold text-slate-900 dark:text-white">{user.authorities?.length ?? 0}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">Followers</p>
                        </div>
                    </div>
                </aside>

                <section className="space-y-6">
                    <div className="rounded-3xl border border-slate-200/70 bg-white/90 p-8 shadow-xl shadow-slate-200/30 backdrop-blur-xl dark:border-slate-800/70 dark:bg-slate-900/80 dark:shadow-none">
                        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h2 className="text-2xl font-semibold tracking-tight text-slate-900 dark:text-white">Your profile</h2>
                            </div>
                            <div className="rounded-3xl bg-slate-50 px-4 py-3 text-sm text-slate-700 dark:bg-slate-950 dark:text-slate-200">
                                Signed in as <span className="font-semibold">{user.username}</span>
                            </div>
                        </div>
                    </div>

                    <Card className="overflow-hidden">
                        <CardHeader className="px-8 pt-8">
                            <CardTitle className="text-2xl">Edit Profile</CardTitle>
                            <CardDescription>Update your name, email, and social links.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6 px-8 pb-8 pt-2">
                            {profileSuccess && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">{profileSuccess}</p>}
                            {profileError && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{profileError}</p>}
                            <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="grid gap-5">
                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="name">Name</Label>
                                        <Input id="name" {...registerProfile("name")} />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input id="username" {...registerProfile("username", { required: "Username is required" })} />
                                        {profileErrors.username && <p className="text-sm text-rose-600">{profileErrors.username.message}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="location">Location</Label>
                                        <Input id="location" {...registerProfile("location")} placeholder="City, Country" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="email">Email</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            {...registerProfile("email", {
                                                required: "Email is required",
                                                pattern: {
                                                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                                                    message: "Invalid email address",
                                                },
                                            })}
                                        />
                                        {profileErrors.email && <p className="text-sm text-rose-600">{profileErrors.email.message}</p>}
                                    </div>
                                </div>

                                <div className="grid gap-4 lg:grid-cols-2">
                                    <div className="grid gap-2">
                                        <Label htmlFor="twitter">Twitter</Label>
                                        <Input id="twitter" {...registerProfile("twitter")} placeholder="https://twitter.com/username" />
                                    </div>
                                    <div className="grid gap-2">
                                        <Label htmlFor="instagram">Instagram</Label>
                                        <Input id="instagram" {...registerProfile("instagram")} placeholder="https://instagram.com/username" />
                                    </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-3">
                                    <Button type="submit" disabled={isProfileSubmitting} className="w-fit">
                                        {isProfileSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                    <p className="text-sm text-slate-500 dark:text-slate-400">Refresh the page to see your updated profile.</p>
                                </div>
                            </form>
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden">
                        <CardHeader className="px-8 pt-8">
                            <CardTitle className="text-2xl">My Portfolios</CardTitle>
                            <CardDescription>Quick access to your portfolios.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4 px-8 pb-8 pt-2">
                            {records.length === 0 ? (
                                <div className="rounded-3xl border border-dashed border-slate-200/70 bg-slate-50 px-5 py-8 text-center text-sm text-slate-500 dark:border-slate-700/60 dark:bg-slate-950/80 dark:text-slate-400">
                                    You have no portfolios yet.
                                </div>
                            ) : (
                                <div className="grid gap-4">
                                    {records.map((record, index) => (
                                        <Card key={index} className="rounded-3xl border border-slate-200/70 bg-slate-50 p-5 dark:border-slate-700/60 dark:bg-slate-950/80">
                                            <CardHeader className="gap-2 p-0">
                                                <CardTitle className="text-lg">
                                                    <Link href={record.uri} className="font-semibold text-slate-900 hover:text-slate-700 dark:text-slate-100 dark:hover:text-white">
                                                        {record.name}
                                                    </Link>
                                                </CardTitle>
                                                {record.description && <CardDescription>{record.description}</CardDescription>}
                                            </CardHeader>
                                        </Card>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    <Card className="overflow-hidden bg-linear-to-br from-slate-100 to-white px-8 py-10 dark:from-slate-900 dark:to-slate-950">
                        <CardTitle className="text-2xl">Security</CardTitle>
                        <CardDescription>Change your password to keep your account secure.</CardDescription>
                        <CardContent className="space-y-6 pt-4">
                            {passwordSuccess && <p className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-200">{passwordSuccess}</p>}
                            {passwordError && <p className="rounded-2xl bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:bg-rose-500/10 dark:text-rose-200">{passwordError}</p>}
                            <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="grid gap-5">
                                <div className="grid gap-2">
                                    <Label htmlFor="newPassword">New Password</Label>
                                    <Input
                                        id="newPassword"
                                        type="password"
                                        {...registerPassword("newPassword", {
                                            required: "New password is required",
                                            minLength: { value: 8, message: "Minimum 8 characters" },
                                            maxLength: { value: 256, message: "Maximum 256 characters" },
                                        })}
                                    />
                                    {passwordErrors.newPassword && <p className="text-sm text-rose-600">{passwordErrors.newPassword.message}</p>}
                                </div>
                                <div className="grid gap-2">
                                    <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                    <Input
                                        id="confirmPassword"
                                        type="password"
                                        {...registerPassword("confirmPassword", {
                                            validate: (value, formValues) =>
                                                value === formValues.newPassword || "Passwords do not match",
                                        })}
                                    />
                                    {passwordErrors.confirmPassword && <p className="text-sm text-rose-600">{passwordErrors.confirmPassword.message}</p>}
                                </div>
                                <Button variant="secondary" type="submit" disabled={isPasswordSubmitting} className="w-fit">
                                    {isPasswordSubmitting ? "Changing..." : "Change Password"}
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </section>
            </main>
        </div>
    );
}