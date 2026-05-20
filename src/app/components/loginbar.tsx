"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { clientAuthProvider } from "@/lib/authProvider";
import { UsersService } from "@/api/userApi";
import { deleteCookie } from "cookies-next";
import { useAuth } from "@/app/components/authentication";
import { Avatar } from "@/components/ui/avatar";
import { User as UserIcon } from "lucide-react";

export default function Loginbar() {
    const router = useRouter();
    const { user, setUser } = useAuth();

    function logout() {
        deleteCookie("MYPORTFOLIOS_AUTH");
        setUser(null);
        router.push("/login");
    }

    useEffect(() => {
        if (user) return;

        let mounted = true;
        async function load() {
            try {
                const service = new UsersService(clientAuthProvider());
                const data = await service.getCurrentUser();
                if (mounted) setUser(data ?? null);
            } catch {
                if (mounted) setUser(null);
            }
        }
        load();
        return () => { mounted = false; };
    }, [user, setUser]);

    if (user) {
        return (
            <div className="flex items-center gap-5">
                <div className="flex items-center gap-2">
                    <Avatar className="rounded-lg flex items-center justify-center bg-white/15 text-white">
                        <UserIcon className="h-4 w-4" />
                    </Avatar>
                    <Link href={`/users/${user.username}`}
                          className="text-white text-md font-medium hover:text-gray-200 transition"> {user.username ?? "User"} </Link>
                </div>
                <button
                    onClick={logout}
                    className="inline-flex items-center px-3 py-1.5 bg-white text-black rounded-md text-sm font-medium hover:bg-gray-200 transition"
                >
                    Logout
                </button>
            </div>
        );
    }

    return (
        <div className="flex items-center gap-4">
            <Link href="/login"
                  className="text-sm font-medium text-white/80 hover:text-white transition"> Sign in </Link>
            <Link href="/users/register"
                  className="inline-flex items-center px-3 py-1.5 border border-white/40 text-white rounded-md text-sm hover:border-white transition"> Sign up </Link>
        </div>
    )

}
