"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useForm, SubmitHandler } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { UsersService } from "@/api/userApi";
import { clientAuthProvider } from "@/lib/authProvider";
import { useAuth } from "@/app/components/authentication";
import Loginbar from "@/app/components/loginbar";

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

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
    return (
        <div className="grid gap-1.5">
            <label className="text-sm font-medium text-gray-300">{label}</label>
            {children}
            {error && <p className="text-sm text-rose-400">{error}</p>}
        </div>
    );
}

function DarkInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            className={
                "h-10 w-full rounded-md border border-white/20 bg-white/10 px-3 text-sm text-white placeholder:text-gray-500 outline-none transition focus:border-white/50 focus:ring-1 focus:ring-white/30 " +
                (props.className ?? "")
            }
        />
    );
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
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 font-sans text-white">
            <header className="sticky top-0 z-40 border-b border-white/15 bg-black/35 backdrop-blur-md">
                <div className="grid min-h-20 w-full grid-cols-1 items-center gap-4 px-5 py-4 md:grid-cols-[240px_1fr_240px] md:px-8 lg:px-12">
                    <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white transition hover:text-gray-200">
                        MyPortfolios
                    </Link>
                    <div />
                    <div className="flex justify-start md:justify-end md:justify-self-end">
                        <Loginbar />
                    </div>
                </div>
            </header>
            <main className="mx-auto grid max-w-5xl gap-8 px-5 py-12 sm:px-8 lg:grid-cols-[280px_1fr] lg:px-14">

                {/* Sidebar */}
                <aside className="space-y-5 rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                    <div className="flex flex-col items-center gap-4 text-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-white/20 bg-white/10">
                            <FontAwesomeIcon icon={faUser} className="h-8 w-8 text-gray-300" />
                        </div>
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gray-400">Profile</p>
                            <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">{user.name || user.username}</h1>
                            <p className="mt-1 text-sm text-gray-400">@{user.username}</p>
                        </div>
                    </div>

                    {(user.location || user.twitter || user.instagram) && (
                        <div className="space-y-2 rounded-md border border-white/10 bg-white/5 p-4">
                            {user.location && (
                                <div className="flex items-center gap-2 text-sm text-gray-300">
                                    <span className="text-gray-400">L</span>
                                    <span>{user.location}</span>
                                </div>
                            )}
                            {user.twitter && (
                                <Link href={user.twitter} className="block rounded-md bg-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/15 hover:text-white">
                                    Twitter: {user.twitter.replace(/^https?:\/\//, "")}
                                </Link>
                            )}
                            {user.instagram && (
                                <Link href={user.instagram} className="block rounded-md bg-white/10 px-3 py-2 text-sm text-gray-300 transition hover:bg-white/15 hover:text-white">
                                    Instagram: {user.instagram.replace(/^https?:\/\//, "")}
                                </Link>
                            )}
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md border border-white/10 bg-white/5 p-4 text-center">
                            <p className="text-2xl font-bold text-white">{records.length}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">Records</p>
                        </div>
                        <div className="rounded-md border border-white/10 bg-white/5 p-4 text-center">
                            <p className="text-2xl font-bold text-white">{user.authorities?.length ?? 0}</p>
                            <p className="mt-1 text-xs uppercase tracking-[0.2em] text-gray-400">Roles</p>
                        </div>
                    </div>
                </aside>

                {/* Main content */}
                <section className="space-y-6">
                    {/* Header banner */}
                    <div className="rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">Account</p>
                                <h2 className="mt-1 text-2xl font-bold tracking-tight text-white">Your profile</h2>
                            </div>
                            <div className="rounded-md border border-white/15 bg-white/10 px-4 py-2 text-sm text-gray-300">
                                Signed in as <span className="font-semibold text-white">{user.username}</span>
                            </div>
                        </div>
                    </div>

                    {/* Edit profile */}
                    <div className="rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                        <h3 className="mb-1 text-xl font-bold text-white">Edit Profile</h3>
                        <p className="mb-6 text-sm text-gray-400">Update your name, email, and social links.</p>
                        {profileSuccess && <p className="mb-4 rounded-md bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">{profileSuccess}</p>}
                        {profileError && <p className="mb-4 rounded-md bg-rose-500/15 px-4 py-3 text-sm text-rose-300">{profileError}</p>}
                        <form onSubmit={handleSubmitProfile(onProfileSubmit)} className="grid gap-5">
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Name">
                                    <DarkInput id="name" {...registerProfile("name")} />
                                </Field>
                                <Field label="Username" error={profileErrors.username?.message}>
                                    <DarkInput id="username" {...registerProfile("username", { required: "Username is required" })} />
                                </Field>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Location">
                                    <DarkInput id="location" {...registerProfile("location")} placeholder="City, Country" />
                                </Field>
                                <Field label="Email" error={profileErrors.email?.message}>
                                    <DarkInput
                                        id="email"
                                        type="email"
                                        {...registerProfile("email", {
                                            required: "Email is required",
                                            pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Invalid email address" },
                                        })}
                                    />
                                </Field>
                            </div>
                            <div className="grid gap-4 sm:grid-cols-2">
                                <Field label="Twitter">
                                    <DarkInput id="twitter" {...registerProfile("twitter")} placeholder="https://twitter.com/username" />
                                </Field>
                                <Field label="Instagram">
                                    <DarkInput id="instagram" {...registerProfile("instagram")} placeholder="https://instagram.com/username" />
                                </Field>
                            </div>
                            <div className="flex flex-wrap items-center gap-3">
                                <button
                                    type="submit"
                                    disabled={isProfileSubmitting}
                                    className="rounded-md bg-white px-5 py-2 text-sm font-bold text-black transition hover:bg-gray-200 disabled:opacity-60"
                                >
                                    {isProfileSubmitting ? "Saving..." : "Save Changes"}
                                </button>
                                <p className="text-sm text-gray-500">Refresh the page to see your updated profile.</p>
                            </div>
                        </form>
                    </div>

                    {/* My Portfolios */}
                    <div className="rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                        <h3 className="mb-1 text-xl font-bold text-white">My Portfolios</h3>
                        <p className="mb-6 text-sm text-gray-400">Quick access to your portfolios.</p>
                        {records.length === 0 ? (
                            <div className="rounded-md border border-white/10 bg-white/5 px-5 py-8 text-center text-sm text-gray-400">
                                You have no portfolios yet.
                            </div>
                        ) : (
                            <div className="grid gap-3">
                                {records.map((record, index) => (
                                    <div key={index} className="rounded-md border border-white/10 bg-white/5 p-4">
                                        <Link href={record.uri} className="font-semibold text-white hover:text-gray-200">
                                            {record.name}
                                        </Link>
                                        {record.description && (
                                            <p className="mt-1 text-sm text-gray-400">{record.description}</p>
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Security */}
                    <div className="rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md">
                        <h3 className="mb-1 text-xl font-bold text-white">Security</h3>
                        <p className="mb-6 text-sm text-gray-400">Change your password to keep your account secure.</p>
                        {passwordSuccess && <p className="mb-4 rounded-md bg-emerald-500/15 px-4 py-3 text-sm text-emerald-300">{passwordSuccess}</p>}
                        {passwordError && <p className="mb-4 rounded-md bg-rose-500/15 px-4 py-3 text-sm text-rose-300">{passwordError}</p>}
                        <form onSubmit={handleSubmitPassword(onPasswordSubmit)} className="grid gap-5">
                            <Field label="New Password" error={passwordErrors.newPassword?.message}>
                                <DarkInput
                                    id="newPassword"
                                    type="password"
                                    {...registerPassword("newPassword", {
                                        required: "New password is required",
                                        minLength: { value: 8, message: "Minimum 8 characters" },
                                        maxLength: { value: 256, message: "Maximum 256 characters" },
                                    })}
                                />
                            </Field>
                            <Field label="Confirm New Password" error={passwordErrors.confirmPassword?.message}>
                                <DarkInput
                                    id="confirmPassword"
                                    type="password"
                                    {...registerPassword("confirmPassword", {
                                        validate: (value, formValues) =>
                                            value === formValues.newPassword || "Passwords do not match",
                                    })}
                                />
                            </Field>
                            <button
                                type="submit"
                                disabled={isPasswordSubmitting}
                                className="w-fit rounded-md border border-white/20 bg-white/10 px-5 py-2 text-sm font-semibold text-white transition hover:bg-white/15 disabled:opacity-60"
                            >
                                {isPasswordSubmitting ? "Changing..." : "Change Password"}
                            </button>
                        </form>
                    </div>
                </section>
            </main>
        </div>
    );
}
