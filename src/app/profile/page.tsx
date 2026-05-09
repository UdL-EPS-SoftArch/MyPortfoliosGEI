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

    const serializableUser = {
        uri: user.uri,
        username: user.username,
        email: user.email,
        authorities: user.authorities,
    };

    let records: Array<{ uri: string; name: string; description?: string; created?: string; modified?: string }> = [];
    try {
        const recordService = new RecordService(serverAuthProvider);
        const fetchedRecords = await recordService.getRecordsByOwnedBy(user!);
        records = fetchedRecords.map((record) => ({
            uri: record.uri,
            name: record.name,
            description: record.description,
            created: record.created?.toString(),
            modified: record.modified?.toString(),
        }));
    } catch (error) {
        console.log(error);
    }

    return <ProfileClient user={serializableUser} records={records} />;
}