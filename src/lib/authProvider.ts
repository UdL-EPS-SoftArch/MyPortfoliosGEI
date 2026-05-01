
export type AuthProvider = {
    getAuth(): Promise<string | null>;
};

export const serverAuthProvider: AuthProvider = {
    async getAuth() {
        const { cookies } = await import("next/headers");
        const cookieStore = await cookies();
        return cookieStore.get("MYAPP_AUTH")?.value ?? null;
    },
};

export function clientAuthProvider(): AuthProvider {
    return {
        async getAuth() {
            const cookie = document.cookie.match(/MYAPP_AUTH=([^;]+)/)?.[1];
            if (cookie) return decodeURIComponent(cookie);

            return localStorage.getItem("MYAPP_AUTH") ?? null;
        },
    };
}
