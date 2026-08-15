import { ArticleView } from '@/components/ArticleView';
import { fetchArticle, newsListHref } from '@/lib/cms';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function ViArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticle('vi', slug);
  if (!article) notFound();
  return (
    <ArticleView locale="vi" article={article} listHref={newsListHref('vi')} listLabel="Tin tức" />
  );
}
