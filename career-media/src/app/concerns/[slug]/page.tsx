import { TaxonomyHub, hubMetadata, hubStaticParams } from "@/components/TaxonomyHub";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 600;
export const dynamicParams = false;
export const generateStaticParams = () => hubStaticParams("concerns");
export async function generateMetadata({ params }: Props) {
  return hubMetadata("concerns", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <TaxonomyHub group="concerns" slug={(await params).slug} />;
}
