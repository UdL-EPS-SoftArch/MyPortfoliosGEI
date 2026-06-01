import { serverAuthProvider } from "@/lib/authProvider";
import { ProjectService } from "@/api/projectApi";
import { UsersService } from "@/api/userApi";
import ProjectWorkspace from "@/app/projects/components/project-workspace";
import CreateProjectForm from "./create-form";

export default async function CreateProjectPage() {
    const userService = new UsersService(serverAuthProvider);
    const service = new ProjectService(serverAuthProvider);

    const currentUser = await userService.getCurrentUser().catch(() => null);
    const allProjects = await service.getProjects().catch(() => []);
    const ownProjects = currentUser?.uri
        ? allProjects.filter((p) => p.creator === currentUser.uri)
        : [];

    return (
        <ProjectWorkspace ownProjects={ownProjects} canManageProjects={Boolean(currentUser)}>
            <div className="mx-auto w-full max-w-2xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">Projects</p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white">New project</h1>
                    <p className="mt-3 text-base leading-7 text-gray-300">
                        Fill in the details below to create a new project.
                    </p>
                </div>
                <div className="rounded-md border border-white/15 bg-white/10 p-6 backdrop-blur-md sm:p-8">
                    <CreateProjectForm />
                </div>
            </div>
        </ProjectWorkspace>
    );
}
