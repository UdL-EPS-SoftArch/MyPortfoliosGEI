import type { UserEntity } from "@/types/user";

export function isAdminUser(user?: Pick<UserEntity, "role" | "roles" | "authorities"> | null) {
    const role = user?.role?.toUpperCase();
    if (role === "ADMIN" || role === "SUPERADMIN" || role === "ROLE_ADMIN" || role === "ROLE_SUPERADMIN") {
        return true;
    }

    const values = [
        ...(user?.authorities?.map((authority) => authority.authority) ?? []),
        ...(typeof user?.roles === "string"
            ? user.roles.split(",")
            : user?.roles?.map((authority) => typeof authority === "string" ? authority : authority.authority) ?? []),
    ];

    return values.some((value) => {
        const normalized = value.toUpperCase();
        return normalized === "ADMIN"
            || normalized === "SUPERADMIN"
            || normalized === "ROLE_ADMIN"
            || normalized === "ROLE_SUPERADMIN";
    });
}
