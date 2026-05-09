import { PortfolioService } from "@/api/portfolioApi";
import { serverAuthProvider } from "@/lib/authProvider";
import EditPortfolioForm from "./edit-form";

export default async function EditPortfolioPage(props: { params: Promise<{ id: string }> }) {
    const service = new PortfolioService(serverAuthProvider);
    const { id } = await props.params;
    const portfolio = await service.getPortfolioById(id);

    return (
        <EditPortfolioForm
            id={id}
            initialValues={{
                name: portfolio.name,
                description: portfolio.description ?? "",
                visibility: portfolio.visibility ?? "PUBLIC",
            }}
        />
    );
}
