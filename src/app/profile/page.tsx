import { redirect } from "next/navigation";
import { UsersService } from "@/api/userApi";
import { serverAuthProvider } from "@/lib/authProvider";

export default async function ProfilePage() {
    const service = new UsersService(serverAuthProvider);
    const currentUser = await service.getCurrentUser();

    if (!currentUser) {
        redirect("/login");
    }

    redirect(`/users/${currentUser.username}`);
}
