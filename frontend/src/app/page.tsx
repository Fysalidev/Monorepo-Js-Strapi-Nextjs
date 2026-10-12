import { Suspense } from 'react';
import { connection } from 'next/server';

const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL ?? 'http://localhost:1337';

type Article = {
  id: number;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string | null;
};

async function getArticles(): Promise<Article[]> {
  await connection();
  const res = await fetch(
    `${STRAPI_URL}/api/articles?sort=publishedAt:desc&pagination[pageSize]=10`,
    { next: { revalidate: 60 } }
  );
  if (!res.ok) return [];
  const data = await res.json();
  return data.data ?? [];
}

async function ArticlesList() {
  const articles = await getArticles();

  if (articles.length === 0) {
    return (
      <p className="mt-6 text-gray-400">
        Aucun article pour le moment. Créez-en un dans l&apos;admin Strapi :
        http://localhost:1337/admin
      </p>
    );
  }

  return (
    <ul className="mt-8 space-y-6">
      {articles.map((article) => (
        <li key={article.id} className="rounded-lg border p-6">
          <h2 className="text-xl font-semibold">{article.title}</h2>
          {article.excerpt && (
            <p className="mt-2 text-gray-600">{article.excerpt}</p>
          )}
        </li>
      ))}
    </ul>
  );
}

export default function HomePage() {
  return (
    <main className="mx-auto max-w-3xl px-6 py-12">
      <h1 className="text-3xl font-bold">Articles</h1>
      <p className="mt-2 text-gray-500">
        Données servies par Strapi ({STRAPI_URL}).
      </p>
      <Suspense fallback={<p className="mt-6 text-gray-400">Chargement…</p>}>
        <ArticlesList />
      </Suspense>
    </main>
  );
}
