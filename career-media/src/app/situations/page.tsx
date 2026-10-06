import { TaxonomyIndex } from "@/components/TaxonomyHub";
import { pageMetadata } from "@/lib/seo";

export const revalidate = 600;
export const metadata = pageMetadata({ title: "今の状況から探す", description: "フリーター、派遣、接客・販売の経験、第二新卒、初めての転職など、今の状況から記事を探せます。", path: "/situations" });

export default function Page() {
  return <TaxonomyIndex group="situations" />;
}
