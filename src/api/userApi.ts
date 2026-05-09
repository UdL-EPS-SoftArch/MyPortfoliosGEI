import { getHal, mergeHal, mergeHalArray, postHal } from "./halClient";
import type { AuthProvider } from "@/lib/authProvider";
import { User } from "@/types/user";

function getResourceUsername(user: User) {
    if (user.username) return user.username;
    if (user.uri) return decodeURIComponent(user.uri.split("/").filter(Boolean).pop() ?? "");

    const selfHref = user.link?.("self")?.href;
    if (selfHref) return decodeURIComponent(selfHref.split("/").filter(Boolean).pop() ?? "");

    return "";
}

function normalizeUser(user: User): User {
    const username = getResourceUsername(user);
    return {
        ...user,
        username,
    };
}

export class UsersService {
    constructor(private authProvider: AuthProvider) {
    }

    async getUsers(): Promise<User[]> {
        const resource = await getHal('/users', this.authProvider);
        const embedded = resource.embeddedArray('users') || [];
        return mergeHalArray<User>(embedded).map(normalizeUser);
    }

    async getAdmins(): Promise<User[]> {
        const resource = await getHal('/admins', this.authProvider);
        const embedded = resource.embeddedArray('admins') || [];
        return mergeHalArray<User>(embedded).map(normalizeUser);
    }

    async getUserById(id: string): Promise<User> {
        const resource = await getHal(`/users/${id}`, this.authProvider);
        return normalizeUser(mergeHal<User>(resource));
    }

    async getCurrentUser(): Promise<User|null> {
        if (!await this.authProvider.getAuth()) {
            return null;
        }
        const resource = await getHal('/identity', this.authProvider);
        return normalizeUser(mergeHal<User>(resource));
    }

    async createUser(user: User): Promise<User> {
        const resource = await postHal('/users', user, this.authProvider);
        return normalizeUser(mergeHal<User>(resource));
    }
}
