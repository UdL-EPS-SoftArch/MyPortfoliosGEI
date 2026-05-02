"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import Loginbar from "@/app/components/loginbar";

export default function Navbar() {
    const pathname = usePathname();
    const {user} = useAuth();

    const navLinks = [
        {href: "/why", label: "Why MyPortfolios"},
        {href: "/explore", label: "Explore"}
    ];

    const isAuthPage = pathname === "/login" || pathname === "/users/register";

    return (
        <nav className="absolute top-0 w-full z-50 bg-transparent text-white">
            <div className="w-full px-8 sm:px-16 lg:px-32 xl:px-40 py-6 flex items-center gap-6">
                <Link href="/" className="flex gap-2 font-bold w-auto text-xl items-center tracking-tight text-white hover:text-gray-200 transition">
                    MyPortfolios
                </Link>

                {!isAuthPage && (
                    <>
                        <div className="flex gap-6 items-center">
                            {navLinks.map(({href, label}) => {
                                return (
                                    <Link
                                        key={href}
                                        href={href}
                                        className="text-sm font-medium text-white/80 hover:text-white transition"
                                    >
                                        {label}
                                    </Link>
                                );
                            })}
                        </div>

                        <div className="ml-auto">
                            <Loginbar/>
                        </div>
                    </>
                )}

            </div>
        </nav>
    );
}
