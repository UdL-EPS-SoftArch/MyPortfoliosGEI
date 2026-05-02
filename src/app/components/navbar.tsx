"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "@/app/components/authentication";
import Loginbar from "@/app/components/loginbar";

export default function Navbar() {
    const pathname = usePathname();
    const {user} = useAuth();

    const navLinks = [
        {href: "/", label: "Home"},
        {href: "/users", label: "Users", roles: ["ROLE_USER"]}
    ];

    return (
        <nav className="bg-white border-b shadow-sm dark:bg-black">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
                <div className="flex gap-2 font-bold w-auto text-xl items-center">
                    MyPortfolios
                </div>

                <div className="flex gap-4">
                    {navLinks
                        .filter(({roles}) =>
                            !roles || user?.authorities?.some(
                                userAuth => roles.includes(userAuth.authority)))
                        .map(({href, label}) => {
                            const active = pathname === href;
                            return (
                                <Link
                                    key={href}
                                    href={href}
                                    className={
                                        active
                                            ? "text-blue-600 font-medium border-b-2 border-blue-600 pb-1"
                                            : "text-gray-600 hover:text-gray-900 transition"
                                    }
                                >
                                    {label}
                                </Link>
                            );
                        })}
                </div>

                <div className="ml-auto">
                    <Loginbar/>
                </div>

            </div>
        </nav>
    );
}
