import { TaxonomyIndex } from "@/components/TaxonomyHub";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 600;
export const metadata = pageMetadata({ title: "悩みから探す", description: "給料、休み、正社員、面接、やりたい仕事が分からないなど、今の悩みから記事を探せます。", path: "/concerns" });

export default function Page() {
  return <TaxonomyIndex group="concerns" />;
}
