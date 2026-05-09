
export type AuthProvider = {
    getAuth(): Promise<string | null>;
};

export function getUsernameFromAuthorization(authorization?: string | null) {
    const match = authorization?.match(/^Basic\s+(.+)$/i);
    if (!match) return null;

    const decoded = typeof window === "undefined"
        ? Buffer.from(match[1], "base64").toString("utf-8")
        : atob(match[1]);
    const separatorIndex = decoded.indexOf(":");
    return separatorIndex === -1 ? decoded : decoded.slice(0, separatorIndex);
}

export const serverAuthProvider: AuthProvider = {
    async getAuth() {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        const cookie = cookieStore.get("MYPORTFOLIOS_AUTH")?.value;
        return cookie ? decodeURIComponent(cookie) : null;
    },
};

export function clientAuthProvider(): AuthProvider {
    return {
        async getAuth() {
            const cookie = document.cookie.match(/MYPORTFOLIOS_AUTH=([^;]+)/)?.[1];
            if (cookie) return decodeURIComponent(cookie);

            return localStorage.getItem("MYPORTFOLIOS_AUTH") ?? null;
        },
    };
}
