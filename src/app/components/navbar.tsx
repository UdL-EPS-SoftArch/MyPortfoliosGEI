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

    return (
        <nav className="absolute top-0 w-full z-50 bg-transparent text-white">
            <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-6">
                <div className="flex gap-2 font-bold w-auto text-xl items-center tracking-tight text-white">
                    MyPortfolios
                </div>

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

            </div>
        </nav>
    );
}
