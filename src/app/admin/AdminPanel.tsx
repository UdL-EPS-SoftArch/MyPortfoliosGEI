"use client";

import { useMemo, useState } from "react";
import type { Dispatch, ReactNode, SetStateAction } from "react";
import { AlertCircle, Eye, EyeOff, FileText, FolderKanban, ImageIcon, Save, ShieldCheck, Trash2 } from "lucide-react";
import { AssetService } from "@/api/assetApi";
import { PortfolioService } from "@/api/portfolioApi";
import { ProjectService } from "@/api/projectApi";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { clientAuthProvider } from "@/lib/authProvider";
import type { Asset, AssetEntity } from "@/types/asset";
import type { Portfolio, PortfolioEntity } from "@/types/portfolio";
import type { Project, ProjectEntity } from "@/types/project";
import type { UserEntity } from "@/types/user";

type AdminPanelProps = {
    currentUser: UserEntity;
    initialAssets: AssetEntity[];
    initialPortfolios: PortfolioEntity[];
    initialProjects: ProjectEntity[];
    loadErrors: string[];
};

type Draft = {
    name: string;
    description: string;
    visibility?: string;
    flagged?: boolean;
};

type DraftMap = {
    [uri: string]: Draft;
};

type Tab = "reports" | "portfolios" | "projects" | "assets";

const visibilityOptions = ["PUBLIC", "PRIVATE", "RESTRICTED"];
const fieldClassName = "border-white/20 bg-black/20 text-white placeholder:text-gray-400 focus-visible:ring-white/30";
const textareaClassName = `${fieldClassName} min-h-20`;

function isDemoItem(uri: string) {
    return uri.startsWith("demo:");
}

function buildDrafts(items: Array<AssetEntity | PortfolioEntity | ProjectEntity>) {
    return Object.fromEntries(items.map((item) => [item.uri, {
        name: item.name ?? "",
        description: item.description ?? "",
        visibility: "visibility" in item ? item.visibility ?? "PRIVATE" : undefined,
        flagged: "flagged" in item ? item.flagged ?? false : undefined,
    }]));
}

function toAssetEntity(asset: Asset): AssetEntity {
    return {
        uri: asset.uri,
        id: asset.id,
        name: asset.name,
        description: asset.description,
    };
}

function toPortfolioEntity(portfolio: Portfolio): PortfolioEntity {
    return {
        uri: portfolio.uri,
        id: portfolio.id,
        name: portfolio.name,
        description: portfolio.description,
        visibility: portfolio.visibility,
    };
}

function toProjectEntity(project: Project): ProjectEntity {
    return {
        uri: project.uri,
        id: project.id,
        name: project.name,
        description: project.description,
        flagged: project.flagged,
        visibility: project.visibility,
    };
}

export default function AdminPanel({
    currentUser,
    initialAssets,
    initialPortfolios,
    initialProjects,
    loadErrors,
}: AdminPanelProps) {
    const [activeTab, setActiveTab] = useState<Tab>("reports");
    const [assets, setAssets] = useState(initialAssets);
    const [portfolios, setPortfolios] = useState(initialPortfolios);
    const [projects, setProjects] = useState(initialProjects);
    const [assetDrafts, setAssetDrafts] = useState<DraftMap>(() => buildDrafts(initialAssets));
    const [portfolioDrafts, setPortfolioDrafts] = useState<DraftMap>(() => buildDrafts(initialPortfolios));
    const [projectDrafts, setProjectDrafts] = useState<DraftMap>(() => buildDrafts(initialProjects));
    const [status, setStatus] = useState<string | null>(null);
    const [busyItem, setBusyItem] = useState<string | null>(null);

    const reports = useMemo(() => projects.filter((project) => project.flagged), [projects]);
    const stats = useMemo(() => ({
        flagged: reports.length,
        publicItems: [...portfolios, ...projects].filter((item) => item.visibility === "PUBLIC").length,
        privateItems: [...portfolios, ...projects].filter((item) => item.visibility === "PRIVATE").length,
        assets: assets.length,
    }), [assets.length, portfolios, projects, reports.length]);

    function updateDraft(setDrafts: Dispatch<SetStateAction<DraftMap>>, uri: string, updates: Partial<Draft>) {
        setDrafts((drafts) => ({
            ...drafts,
            [uri]: { ...drafts[uri], ...updates },
        }));
    }

    async function savePortfolio(portfolio: PortfolioEntity) {
        const draft = portfolioDrafts[portfolio.uri];
        await runAction(portfolio.uri, "Portfolio updated", "Could not update portfolio", async () => {
            if (isDemoItem(portfolio.uri)) {
                setPortfolios((items) => items.map((item) => item.uri === portfolio.uri ? { ...item, ...draft } : item));
                return;
            }

            const service = new PortfolioService(clientAuthProvider());
            const updated = await service.updatePortfolio(portfolio, {
                name: draft.name,
                description: draft.description,
                visibility: draft.visibility,
            });
            setPortfolios((items) => items.map((item) => item.uri === portfolio.uri ? toPortfolioEntity(updated) : item));
        });
    }

    async function deletePortfolio(portfolio: PortfolioEntity) {
        if (!window.confirm(`Delete ${portfolio.name}?`)) return;
        await runAction(portfolio.uri, "Portfolio deleted", "Could not delete portfolio", async () => {
            if (isDemoItem(portfolio.uri)) {
                setPortfolios((items) => items.filter((item) => item.uri !== portfolio.uri));
                return;
            }

            const service = new PortfolioService(clientAuthProvider());
            await service.deletePortfolio(portfolio);
            setPortfolios((items) => items.filter((item) => item.uri !== portfolio.uri));
        });
    }

    async function saveProject(project: ProjectEntity) {
        const draft = projectDrafts[project.uri];
        await runAction(project.uri, "Project updated", "Could not update project", async () => {
            if (isDemoItem(project.uri)) {
                setProjects((items) => items.map((item) => item.uri === project.uri ? { ...item, ...draft } : item));
                return;
            }

            const service = new ProjectService(clientAuthProvider());
            const updated = await service.updateProject(project, {
                name: draft.name,
                description: draft.description,
                visibility: draft.visibility,
                flagged: draft.flagged,
            });
            setProjects((items) => items.map((item) => item.uri === project.uri ? toProjectEntity(updated) : item));
        });
    }

    async function deleteProject(project: ProjectEntity) {
        if (!window.confirm(`Delete ${project.name}?`)) return;
        await runAction(project.uri, "Project deleted", "Could not delete project", async () => {
            if (isDemoItem(project.uri)) {
                setProjects((items) => items.filter((item) => item.uri !== project.uri));
                return;
            }

            const service = new ProjectService(clientAuthProvider());
            await service.deleteProject(project);
            setProjects((items) => items.filter((item) => item.uri !== project.uri));
        });
    }

    async function saveAsset(asset: AssetEntity) {
        const draft = assetDrafts[asset.uri];
        await runAction(asset.uri, "Asset updated", "Could not update asset", async () => {
            if (isDemoItem(asset.uri)) {
                setAssets((items) => items.map((item) => item.uri === asset.uri ? { ...item, ...draft } : item));
                return;
            }

            const service = new AssetService(clientAuthProvider());
            const updated = await service.updateAsset(asset, {
                name: draft.name,
                description: draft.description,
            });
            setAssets((items) => items.map((item) => item.uri === asset.uri ? toAssetEntity(updated) : item));
        });
    }

    async function deleteAsset(asset: AssetEntity) {
        if (!window.confirm(`Delete ${asset.name}?`)) return;
        await runAction(asset.uri, "Asset deleted", "Could not delete asset", async () => {
            if (isDemoItem(asset.uri)) {
                setAssets((items) => items.filter((item) => item.uri !== asset.uri));
                return;
            }

            const service = new AssetService(clientAuthProvider());
            await service.deleteAsset(asset);
            setAssets((items) => items.filter((item) => item.uri !== asset.uri));
        });
    }

    async function resolveReport(project: ProjectEntity) {
        updateDraft(setProjectDrafts, project.uri, { flagged: false });
        await runAction(project.uri, "Report resolved", "Could not resolve report", async () => {
            if (isDemoItem(project.uri)) {
                setProjects((items) => items.map((item) => item.uri === project.uri ? { ...item, flagged: false } : item));
                return;
            }

            const service = new ProjectService(clientAuthProvider());
            const updated = await service.updateProject(project, { flagged: false });
            setProjects((items) => items.map((item) => item.uri === project.uri ? toProjectEntity(updated) : item));
        });
    }

    async function runAction(uri: string, success: string, failure: string, action: () => Promise<void>) {
        setBusyItem(uri);
        setStatus(null);

        try {
            await action();
            setStatus(success);
        } catch (error) {
            setStatus(error instanceof Error ? error.message : failure);
        } finally {
            setBusyItem(null);
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-black via-slate-900 to-blue-950 pt-28 text-white">
            <main className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-6 pb-16 sm:px-10">
                <header className="flex flex-col gap-5 border-b border-white/15 pb-8 lg:flex-row lg:items-end lg:justify-between">
                    <div className="space-y-3">
                        <div className="inline-flex items-center gap-2 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-sm text-gray-300 backdrop-blur-md">
                            <ShieldCheck className="h-4 w-4 text-emerald-600" />
                            {currentUser.username}
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold tracking-tight text-white">Admin panel</h1>
                            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-300">
                                Manage reported projects, portfolios, project visibility, and uploaded assets.
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm sm:grid-cols-4">
                        <Stat label="Reports" value={stats.flagged} />
                        <Stat label="Public" value={stats.publicItems} />
                        <Stat label="Private" value={stats.privateItems} />
                        <Stat label="Assets" value={stats.assets} />
                    </div>
                </header>

                {loadErrors.length > 0 && (
                    <div className="flex items-start gap-3 rounded-md border border-amber-300/30 bg-amber-300/10 px-4 py-3 text-sm text-amber-100 backdrop-blur-md">
                        <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-amber-300" />
                        <span>{loadErrors.join(" ")}</span>
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-3">
                    <TabButton active={activeTab === "reports"} onClick={() => setActiveTab("reports")} icon={<FileText className="h-4 w-4" />} label="Reports" />
                    <TabButton active={activeTab === "portfolios"} onClick={() => setActiveTab("portfolios")} icon={<FolderKanban className="h-4 w-4" />} label="Portfolios" />
                    <TabButton active={activeTab === "projects"} onClick={() => setActiveTab("projects")} icon={<FolderKanban className="h-4 w-4" />} label="Projects" />
                    <TabButton active={activeTab === "assets"} onClick={() => setActiveTab("assets")} icon={<ImageIcon className="h-4 w-4" />} label="Assets" />
                    {status && (
                        <span className="ml-auto rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-gray-200 backdrop-blur-md">
                            {status}
                        </span>
                    )}
                </div>

                {activeTab === "reports" && (
                    <section className="overflow-hidden rounded-md border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md">
                        <TableHeader columns="md:grid-cols-[1fr_1.2fr_160px_150px]" labels={["Project", "Description", "Visibility", "Actions"]} />
                        {reports.length === 0 ? (
                            <EmptyState label="No flagged projects" />
                        ) : reports.map((project) => {
                            const draft = projectDrafts[project.uri];
                            return (
                                <div key={project.uri} className="grid gap-4 border-b border-white/10 px-5 py-4 last:border-b-0 md:grid-cols-[1fr_1.2fr_160px_150px] md:items-start">
                                    <Input value={draft.name} onChange={(event) => updateDraft(setProjectDrafts, project.uri, { name: event.target.value })} className={fieldClassName} />
                                    <Textarea value={draft.description} onChange={(event) => updateDraft(setProjectDrafts, project.uri, { description: event.target.value })} className={textareaClassName} />
                                    <VisibilitySelect value={draft.visibility ?? "PRIVATE"} onChange={(visibility) => updateDraft(setProjectDrafts, project.uri, { visibility })} />
                                    <div className="flex gap-2">
                                        <Button type="button" variant="outline" disabled={busyItem === project.uri} onClick={() => resolveReport(project)} className="border-white/20 bg-white text-black hover:bg-gray-200">
                                            Resolve
                                        </Button>
                                        <IconButton busy={busyItem === project.uri} onClick={() => saveProject(project)} label="Save" icon={<Save className="h-4 w-4" />} />
                                    </div>
                                </div>
                            );
                        })}
                    </section>
                )}

                {activeTab === "portfolios" && (
                    <EditableCollection
                        items={portfolios}
                        drafts={portfolioDrafts}
                        columns="md:grid-cols-[1fr_1.2fr_180px_120px]"
                        labels={["Portfolio", "Description", "Visibility", "Actions"]}
                        onDraftChange={(uri, updates) => updateDraft(setPortfolioDrafts, uri, updates)}
                        onSave={savePortfolio}
                        onDelete={deletePortfolio}
                        busyItem={busyItem}
                        emptyLabel="No portfolios found"
                        hasVisibility
                    />
                )}

                {activeTab === "projects" && (
                    <EditableCollection
                        items={projects}
                        drafts={projectDrafts}
                        columns="md:grid-cols-[1fr_1.1fr_150px_130px_120px]"
                        labels={["Project", "Description", "Visibility", "Reported", "Actions"]}
                        onDraftChange={(uri, updates) => updateDraft(setProjectDrafts, uri, updates)}
                        onSave={saveProject}
                        onDelete={deleteProject}
                        busyItem={busyItem}
                        emptyLabel="No projects found"
                        hasFlagged
                        hasVisibility
                    />
                )}

                {activeTab === "assets" && (
                    <EditableCollection
                        items={assets}
                        drafts={assetDrafts}
                        columns="md:grid-cols-[1fr_1.4fr_120px]"
                        labels={["Asset", "Description", "Actions"]}
                        onDraftChange={(uri, updates) => updateDraft(setAssetDrafts, uri, updates)}
                        onSave={saveAsset}
                        onDelete={deleteAsset}
                        busyItem={busyItem}
                        emptyLabel="No assets found"
                    />
                )}
            </main>
        </div>
    );
}

function EditableCollection<TItem extends AssetEntity | PortfolioEntity | ProjectEntity>({
    items,
    drafts,
    columns,
    labels,
    onDraftChange,
    onSave,
    onDelete,
    busyItem,
    emptyLabel,
    hasFlagged = false,
    hasVisibility = false,
}: {
    items: TItem[];
    drafts: DraftMap;
    columns: string;
    labels: string[];
    onDraftChange: (uri: string, updates: Partial<Draft>) => void;
    onSave: (item: TItem) => void;
    onDelete: (item: TItem) => void;
    busyItem: string | null;
    emptyLabel: string;
    hasFlagged?: boolean;
    hasVisibility?: boolean;
}) {
    return (
        <section className="overflow-hidden rounded-md border border-white/15 bg-white/10 shadow-2xl backdrop-blur-md">
            <TableHeader columns={columns} labels={labels} />
            {items.length === 0 ? (
                <EmptyState label={emptyLabel} />
            ) : items.map((item) => {
                const draft = drafts[item.uri];
                return (
                    <div key={item.uri} className={`grid gap-4 border-b border-white/10 px-5 py-4 last:border-b-0 ${columns} md:items-start`}>
                        <Input value={draft.name} onChange={(event) => onDraftChange(item.uri, { name: event.target.value })} className={fieldClassName} />
                        <Textarea value={draft.description} onChange={(event) => onDraftChange(item.uri, { description: event.target.value })} className={textareaClassName} />
                        {hasVisibility && (
                            <VisibilitySelect value={draft.visibility ?? "PRIVATE"} onChange={(visibility) => onDraftChange(item.uri, { visibility })} />
                        )}
                        {hasFlagged && (
                            <label className="flex h-9 items-center gap-2 text-sm text-gray-200">
                                <input
                                    type="checkbox"
                                    checked={draft.flagged ?? false}
                                    onChange={(event) => onDraftChange(item.uri, { flagged: event.target.checked })}
                                    className="h-4 w-4 rounded border-white/30 bg-black/20 accent-blue-500"
                                />
                                Reported
                            </label>
                        )}
                        <RowActions
                            busy={busyItem === item.uri}
                            onSave={() => onSave(item)}
                            onDelete={() => onDelete(item)}
                        />
                    </div>
                );
            })}
        </section>
    );
}

function TableHeader({ columns, labels }: { columns: string; labels: string[] }) {
    return (
        <div className={`hidden gap-4 border-b border-white/15 bg-white/10 px-5 py-3 text-sm font-medium text-gray-300 md:grid ${columns}`}>
            {labels.map((label) => <span key={label}>{label}</span>)}
        </div>
    );
}

function VisibilitySelect({ value, onChange }: { value: string; onChange: (value: string) => void }) {
    const isPublic = value === "PUBLIC";

    return (
        <label className="flex items-center gap-2">
            {isPublic ? <Eye className="h-4 w-4 text-emerald-400" /> : <EyeOff className="h-4 w-4 text-gray-400" />}
            <select
                value={value}
                onChange={(event) => onChange(event.target.value)}
                className="h-9 w-full rounded-md border border-white/20 bg-black/20 px-3 text-sm text-white shadow-xs outline-none transition focus:border-white/40 focus:ring-2 focus:ring-white/20"
            >
                {visibilityOptions.map((option) => (
                    <option key={option} value={option}>{option}</option>
                ))}
            </select>
        </label>
    );
}

function RowActions({ busy, onSave, onDelete }: { busy: boolean; onSave: () => void; onDelete: () => void }) {
    return (
        <div className="flex gap-2">
            <IconButton busy={busy} onClick={onSave} label="Save" icon={<Save className="h-4 w-4" />} />
            <IconButton busy={busy} onClick={onDelete} label="Delete" icon={<Trash2 className="h-4 w-4" />} className="text-red-300 hover:text-red-200" />
        </div>
    );
}

function IconButton({
    busy,
    onClick,
    label,
    icon,
    className,
}: {
    busy: boolean;
    onClick: () => void;
    label: string;
    icon: ReactNode;
    className?: string;
}) {
    return (
        <Button type="button" size="icon" variant="outline" disabled={busy} onClick={onClick} title={label} className={`border-white/20 bg-white/10 hover:bg-white/20 ${className ?? "text-white"}`}>
            {icon}
        </Button>
    );
}

function TabButton({ active, onClick, icon, label }: { active: boolean; onClick: () => void; icon: ReactNode; label: string }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition ${active ? "bg-white text-black shadow-lg" : "border border-white/20 bg-white/10 text-gray-200 hover:bg-white/20"}`}
        >
            {icon}
            {label}
        </button>
    );
}

function Stat({ label, value }: { label: string; value: number }) {
    return (
        <div className="rounded-md border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
            <div className="text-lg font-semibold text-white">{value}</div>
            <div className="text-gray-300">{label}</div>
        </div>
    );
}

function EmptyState({ label }: { label: string }) {
    return (
        <div className="px-5 py-10 text-center text-sm text-gray-300">
            {label}
        </div>
    );
}
