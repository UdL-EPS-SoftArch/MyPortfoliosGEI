"use client";
import { createContext, useContext, useState, useMemo } from "react";
import {User} from "@/types/user";
import { AuthProvider as IAuthProvider, clientAuthProvider } from "@/lib/authProvider";

type AuthContextType = {
    user: User | null;
    setUser: (u: User | null) => void;
    authProvider: IAuthProvider;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children, }: Readonly<{ children: React.ReactNode; }>) {
    const [user, setUser] = useState<User | null>(null);
    const authProvider = useMemo(() => clientAuthProvider(), []);

    return (
        <AuthContext.Provider value={{ user, setUser, authProvider }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error("useAuth must be inside AuthProvider");
    return ctx;
}
