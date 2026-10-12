import type { Core } from '@strapi/strapi';

const DEMO_ARTICLES = [
  {
    title: 'Bienvenue dans votre starter Next.js + Strapi',
    slug: 'bienvenue-dans-votre-starter-nextjs-strapi',
    excerpt:
      'Cet article de démonstration a été créé automatiquement au premier démarrage du backend.',
    content:
      '## Félicitations 🎉\n\nVotre stack **Next.js 15 + Strapi 5** est opérationnelle.\n\n### Ce que vous pouvez faire maintenant\n\n- Créer vos propres types de contenus dans l\'admin Strapi\n- Activer les permissions publiques (Settings → Users & Permissions → Roles → Public)\n- Personnaliser le frontend Next.js\n\nSupprimez librement cet article de démonstration depuis l\'admin.',
  },
  {
    title: 'Comment consommer l’API Strapi depuis Next.js',
    slug: 'consommer-l-api-strapi-depuis-nextjs',
    excerpt:
      'Fetch côté serveur, revalidation ISR et gestion des URLs selon l’environnement.',
    content:
      '## Appels serveur\n\nLa page d\'accueil utilise `fetch` avec `next: { revalidate: 60 }` pour rafraîchir les données toutes les 60 secondes.\n\n## Endpoints utiles\n\n- `GET /api/articles` : liste des articles\n- `GET /api/articles/:documentId` : un article\n- `GET /api/articles?filters[slug][$eq]=mon-slug` : filtre par slug\n- `populate=cover` : charger les relations et médias',
  },
  {
    title: 'Déployer sur Vercel + Strapi Cloud',
    slug: 'deployer-sur-vercel-strapi-cloud',
    excerpt:
      'Frontend sur Vercel, CMS sur Strapi Cloud : la checklist complète.',
    content:
      '## Frontend → Vercel\n\n1. Importer le repo, Root Directory = `frontend`\n2. Variable : `NEXT_PUBLIC_STRAPI_URL` = URL Strapi Cloud\n\n## Backend → Strapi Cloud\n\n1. Créer un projet sur cloud.strapi.io relié au repo\n2. La base et les secrets sont gérés par la plateforme',
  },
];

export default {
  /**
   * An asynchronous register function that runs before
   * your application is initialized.
   *
   * This gives you an opportunity to extend code.
   */
  register(/* { strapi }: { strapi: Core.Strapi } */) {},

  /**
   * An asynchronous bootstrap function that runs before
   * your application gets started.
   *
   * This gives you an opportunity to set up your data model,
   * run jobs, or perform some special logic.
   */
  bootstrap({ strapi }: { strapi: Core.Strapi }) {
    const seedDemoArticles = async () => {
      const existing = await strapi
        .documents('api::article.article')
        .count({});
      if (existing > 0) return;

      for (const article of DEMO_ARTICLES) {
        await strapi.documents('api::article.article').create({
          data: { ...article, publishedAt: new Date() },
        });
      }

      strapi.log.info(`Seeded ${DEMO_ARTICLES.length} demo articles`);
    };

    seedDemoArticles().catch((error) => {
      strapi.log.error('Failed to seed demo articles:', error);
    });
  },
};
