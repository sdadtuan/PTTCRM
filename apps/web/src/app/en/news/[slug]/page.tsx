import { ArticleView } from '@/components/ArticleView';
import { fetchArticle, newsListHref } from '@/lib/cms';
import { notFound } from 'next/navigation';

type Props = { params: Promise<{ slug: string }> };

export default async function EnArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = await fetchArticle('en', slug);
  if (!article) notFound();
  return (
    <ArticleView locale="en" article={article} listHref={newsListHref('en')} listLabel="News" />
  );
}
