import { TaxonomyHub, hubMetadata, hubStaticParams } from "@/components/TaxonomyHub";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 600;
export const dynamicParams = false;
export const generateStaticParams = () => hubStaticParams("situations");
export async function generateMetadata({ params }: Props) {
  return hubMetadata("situations", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <TaxonomyHub group="situations" slug={(await params).slug} />;
}
