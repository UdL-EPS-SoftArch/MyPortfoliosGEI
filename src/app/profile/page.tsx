import { redirect } from "next/navigation";
import { serverAuthProvider } from "@/lib/authProvider";
import { UsersService } from "@/api/userApi";
import { RecordService } from "@/api/recordApi";
import { Record } from "@/types/record";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
    const userService = new UsersService(serverAuthProvider);
    const user = await userService.getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    let records: Record[] = [];
    try {
        const recordService = new RecordService(serverAuthProvider);
        records = await recordService.getRecordsByOwnedBy(user!);
    } catch (error) {
        console.log(error);
    }

    return <ProfileClient user={user!} records={records} />;
}