import { TaxonomyHub, hubMetadata, hubStaticParams } from "@/components/TaxonomyHub";

type Props = { params: Promise<{ slug: string }> };

export const revalidate = 600;
export const dynamicParams = false;
export const generateStaticParams = () => hubStaticParams("roles");
export async function generateMetadata({ params }: Props) {
  return hubMetadata("roles", (await params).slug);
}
export default async function Page({ params }: Props) {
  return <TaxonomyHub group="roles" slug={(await params).slug} />;
}
