import { Badge } from "@/components/ui/badge";
import { Visibility } from "@/types/portfolio";

const VISIBILITY_BADGE_STYLES: Record<Visibility, string> = {
    PUBLIC: "border-emerald-400/40 bg-emerald-500/20 text-emerald-100",
    UNLISTED: "border-amber-400/40 bg-amber-500/20 text-amber-100",
    RESTRICTED: "border-sky-400/40 bg-sky-500/20 text-sky-100",
    PRIVATE: "border-rose-400/40 bg-rose-500/20 text-rose-100",
};

export const VISIBILITY_LABELS: Record<Visibility, string> = {
    PUBLIC: "Publico",
    UNLISTED: "No listado",
    RESTRICTED: "Restringido",
    PRIVATE: "Privado",
};

export const VISIBILITY_ORDER: Visibility[] = ["PUBLIC", "UNLISTED", "RESTRICTED", "PRIVATE"];

type Props = {
    visibility?: Visibility;
};

export default function VisibilityBadge({ visibility }: Props) {
    if (!visibility) return null;
    return (
        <Badge variant="outline" className={VISIBILITY_BADGE_STYLES[visibility]}>
            {VISIBILITY_LABELS[visibility]}
        </Badge>
    );
}
