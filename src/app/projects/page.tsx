import { serverAuthProvider } from "@/lib/authProvider";
import { ProjectService } from "@/api/projectApi";
import { UsersService } from "@/api/userApi";
import ProjectWorkspace from "@/app/projects/components/project-workspace";
import { ProjectCard } from "@/app/projects/components/project-card";

type Props = {
    searchParams?: Promise<{ q?: string | string[] }>;
};


export default async function ProjectsPage({ searchParams }: Props) {
    const params = await searchParams;
    const queryParam = Array.isArray(params?.q) ? params?.q[0] : params?.q;
    const searchQuery = queryParam?.trim() || "";

    const service = new ProjectService(serverAuthProvider);
    const userService = new UsersService(serverAuthProvider);

    const [projects, currentUser] = await Promise.all([
        service.getProjects(),
        userService.getCurrentUser().catch(() => null),
    ]);

    const ownProjects = currentUser?.uri
        ? projects.filter((p) => p.creator === currentUser.uri)
        : [];

    const othersProjects = projects.filter((p) => !ownProjects.includes(p));
    const baseProjects = searchQuery ? projects : othersProjects.length ? othersProjects : projects;

    const visibleProjects = searchQuery
        ? baseProjects.filter((p) => {
              const haystack = `${p.name} ${p.description ?? ""}`.toLowerCase();
              return haystack.includes(searchQuery.toLowerCase());
          })
        : baseProjects;

    return (
        <ProjectWorkspace
            ownProjects={ownProjects}
            searchQuery={searchQuery}
            canManageProjects={Boolean(currentUser)}
        >
            <section className="mx-auto w-full max-w-5xl">
                <div className="mb-8">
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-gray-400">
                        {searchQuery ? "Search results" : "Discover"}
                    </p>
                    <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                        {searchQuery ? `Projects for "${searchQuery}"` : "Projects"}
                    </h1>
                    <p className="mt-3 max-w-2xl text-base leading-7 text-gray-300">
                        {searchQuery
                            ? "Projects matching your search."
                            : "Explore projects from the community or pick one of yours from the sidebar."}
                    </p>
                </div>

                {visibleProjects.length === 0 ? (
                    <div className="rounded-md border border-white/15 bg-white/10 p-8 text-gray-300 backdrop-blur-md">
                        No projects to show.
                    </div>
                ) : (
                    <div className="grid gap-5 lg:grid-cols-2">
                        {visibleProjects.map((project) => (
                            <ProjectCard key={project.uri || project.name} project={project} />
                        ))}
                    </div>
                )}
            </section>
        </ProjectWorkspace>
    );
}
