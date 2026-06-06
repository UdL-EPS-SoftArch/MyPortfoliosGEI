import { redirect } from "next/navigation";
import { serverAuthProvider } from "@/lib/authProvider";
import { UsersService } from "@/api/userApi";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const userService = new UsersService(serverAuthProvider);
    const user = await userService.getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    const serializableUser = {
        uri: user.uri,
        username: user.username,
        email: user.email,
        name: user.name,
        location: user.location,
        twitter: user.twitter,
        instagram: user.instagram,
        authorities: user.authorities,
    };

    return <ProfileClient user={serializableUser} />;
}
