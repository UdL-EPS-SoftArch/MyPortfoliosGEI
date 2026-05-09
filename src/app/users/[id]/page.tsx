import Link from "next/link";
import {UsersService} from "@/api/userApi";
import {serverAuthProvider} from "@/lib/authProvider";
import {Record} from "@/types/record";
import {RecordService} from "@/api/recordApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings } from "lucide-react";

function canManageProfile(currentUsername?: string, profileUsername?: string) {
    return currentUsername && profileUsername && currentUsername === profileUsername;
}

export default async function UsersPage(props: { params: Promise<{ id: string }> }) {
    const userService = new UsersService(serverAuthProvider)
    const recordService = new RecordService(serverAuthProvider)
    const user = await userService.getUserById((await props.params).id);
    const currentUser = await userService.getCurrentUser();
    const canManage = canManageProfile(currentUser?.username, user.username);
    let records: Record[] = [];
    try {
        records = await recordService.getRecordsByOwnedBy(user);
    } catch (error) {
        console.log(error);
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
            <main
                className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
                <div className="flex flex-col items-center w-full gap-6 text-center sm:items-start sm:text-left">
                    <div className="space-y-4 w-full">
                        <div className="flex w-full flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                            <h1 className="text-2xl font-semibold">{user.username}</h1>
                            {canManage && (
                                <Button asChild variant="outline">
                                    <Link href="/admin">
                                        <Settings className="h-4 w-4" />
                                        Admin panel
                                    </Link>
                                </Button>
                            )}
                        </div>

                        {user.email && (
                            <p className="text-gray-700">
                                <strong>Email:</strong> {user.email}
                            </p>
                        )}

                        <h2 className="text-xl font-semibold mt-8">Records</h2>

                        <div className="space-y-3 w-full">
                            {records.map((record, i) => (
                                <Card key={i} className="w-full">
                                    <CardHeader>
                                        <CardTitle><Link href={record.uri} className="hover:underline">
                                            {record.name}
                                        </Link></CardTitle>
                                    </CardHeader>
                                    {record.description && (
                                        <CardContent className="space-y-2 text-sm text-gray-500">
                                            <p>{record.description}</p>
                                        </CardContent>
                                    )}
                                </Card>
                            ))}
                        </div>

                    </div>
                </div>
            </main>
        </div>
    );
}
