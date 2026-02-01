import ViewMessage from "@/components/pages/message/ViewMessage";

export default async function MessagePage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = await params;
    return <ViewMessage messageId={id} />;
}
