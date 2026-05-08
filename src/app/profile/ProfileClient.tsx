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
import { User } from "@/types/user";
import { Record } from "@/types/record";

type ProfileFormValues = {
    email: string;
};

type PasswordFormValues = {
    newPassword: string;
    confirmPassword: string;
};

interface ProfileClientProps {
    user: User;
    records: Record[];
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
        formState: { errors: profileErrors, isSubmitting: isProfileSubmitting },
    } = useForm<ProfileFormValues>({
        defaultValues: { email: user.email ?? "" },
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
            const updated = await service.updateUser(user.username, { email: data.email });
            setUser(updated);
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
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main className="flex min-h-screen w-full max-w-3xl flex-col items-start justify-between py-32 px-16 bg-white dark:bg-black">
                <div className="flex flex-col items-start w-full gap-10">

                    {/* Header */}
                    <div className="flex items-center gap-4">
                        <Avatar className="w-16 h-16 rounded-xl flex items-center justify-center bg-gray-100 dark:bg-gray-800">
                            <FontAwesomeIcon icon={faUser} className="h-7 w-7 text-gray-500" />
                        </Avatar>
                        <div>
                            <h1 className="text-2xl font-semibold">{user.username}</h1>
                            {user.email && (
                                <p className="text-sm text-gray-500">{user.email}</p>
                            )}
                        </div>
                    </div>

                    {/* Edit Profile */}
                    <section className="w-full space-y-4">
                        <h2 className="text-xl font-semibold">Edit Profile</h2>
                        <Card className="w-full">
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="grid gap-4">
                                    {profileSuccess && (
                                        <p className="text-sm text-green-600">{profileSuccess}</p>
                                    )}
                                    {profileError && (
                                        <p className="text-sm text-red-600">{profileError}</p>
                                    )}
                                    <div className="space-y-2">
                                        <Label htmlFor="username">Username</Label>
                                        <Input
                                            id="username"
                                            value={user.username}
                                            disabled
                                            className="bg-gray-50 dark:bg-gray-900 text-gray-400 cursor-not-allowed"
                                        />
                                        <p className="text-xs text-gray-400">Username cannot be changed.</p>
                                    </div>
                                    <div className="space-y-2">
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
                                        {profileErrors.email && (
                                            <p className="text-sm text-red-600">{profileErrors.email.message}</p>
                                        )}
                                    </div>
                                    <Button type="submit" disabled={isProfileSubmitting} className="w-fit">
                                        {isProfileSubmitting ? "Saving..." : "Save Changes"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* Change Password */}
                    <section className="w-full space-y-4">
                        <h2 className="text-xl font-semibold">Change Password</h2>
                        <Card className="w-full">
                            <CardContent className="pt-6">
                                <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="grid gap-4">
                                    {passwordSuccess && (
                                        <p className="text-sm text-green-600">{passwordSuccess}</p>
                                    )}
                                    {passwordError && (
                                        <p className="text-sm text-red-600">{passwordError}</p>
                                    )}
                                    <div className="space-y-2">
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
                                        {passwordErrors.newPassword && (
                                            <p className="text-sm text-red-600">{passwordErrors.newPassword.message}</p>
                                        )}
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                        <Input
                                            id="confirmPassword"
                                            type="password"
                                            {...registerPassword("confirmPassword", {
                                                validate: (value, formValues) =>
                                                    value === formValues.newPassword || "Passwords do not match",
                                            })}
                                        />
                                        {passwordErrors.confirmPassword && (
                                            <p className="text-sm text-red-600">{passwordErrors.confirmPassword.message}</p>
                                        )}
                                    </div>
                                    <Button type="submit" disabled={isPasswordSubmitting} className="w-fit">
                                        {isPasswordSubmitting ? "Changing..." : "Change Password"}
                                    </Button>
                                </form>
                            </CardContent>
                        </Card>
                    </section>

                    {/* My Records */}
                    <section className="w-full space-y-4">
                        <h2 className="text-xl font-semibold">My Records</h2>
                        {records.length === 0 ? (
                            <p className="text-sm text-gray-500">You have no records yet.</p>
                        ) : (
                            <div className="space-y-3 w-full">
                                {records.map((record, i) => (
                                    <Card key={i} className="w-full">
                                        <CardHeader>
                                            <CardTitle>
                                                <Link href={record.uri} className="hover:underline">
                                                    {record.name}
                                                </Link>
                                            </CardTitle>
                                            {record.description && (
                                                <CardDescription>{record.description}</CardDescription>
                                            )}
                                        </CardHeader>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </section>

                </div>
            </main>
        </div>
    );
}