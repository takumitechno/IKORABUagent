import { ArticleCatalogue, catalogueMetadata, type CatalogueSearchParams } from "@/components/ArticleCatalogue";

type Props = { searchParams: CatalogueSearchParams };
export const generateMetadata = catalogueMetadata;
export default function ArticlesPage(props: Props) { return <ArticleCatalogue {...props} />; }
