# Next.js + Strapi Starter

Starter monorepo prêt à l'emploi : frontend **Next.js 15** (App Router, TypeScript, Tailwind CSS) + CMS **Strapi 5** (TypeScript, SQLite en local).

## Structure

```
.
├── frontend/   # Application Next.js (Vercel)
└── backend/    # API Strapi (Strapi Cloud)
```

## Prérequis

- Node.js 20+ (recommandé : dernière LTS)
- npm

## Démarrage rapide

1. **Backend Strapi**

   ```bash
   cd backend
   npm run develop
   ```

   L'admin est disponible sur http://localhost:1337/admin (créez votre premier utilisateur admin au premier démarrage).

2. **Frontend Next.js**

   ```bash
   cd frontend
   npm run dev
   ```

   L'application est disponible sur http://localhost:3000.

## Variables d'environnement

- `frontend/.env.local.example` : configuration du frontend
- `backend/.env.example` : configuration du backend

Copiez les fichiers `.env.example` en `.env` / `.env.local` et ajustez les valeurs.

## Déploiement en conteneurs (Docker + Nginx)

La stack complète tourne en conteneurs sur un réseau Docker interne, derrière un reverse proxy **Nginx** :

- `/` → frontend Next.js (`frontend:3000`)
- `/api`, `/admin`, `/uploads`, `/documentation` → backend Strapi (`backend:1337`)

### Prérequis

- Docker + Docker Compose v2

### Lancement

```bash
cp backend/.env.example backend/.env   # puis générez de vraies clés
docker compose up -d --build
```

L'application est disponible sur http://localhost (port 80) :

- Frontend : http://localhost
- Admin Strapi : http://localhost/admin
- API : http://localhost/api/articles

### Configuration

- `STRAPI_PUBLIC_URL` (défaut : `http://localhost`) : URL publique exposée par Nginx, embarquée dans le bundle client Next.js.
- Les appels serveur-vers-serveur du frontend utilisent l'URL interne `http://backend:1337` (réseau Docker), configurable via `STRAPI_INTERNAL_URL`.
- Secrets Strapi (`APP_KEYS`, `JWT_SECRET`, …) : à définir dans `backend/.env` ou l'environnement du compose.
- Les uploads et la base SQLite sont persistés dans les volumes `strapi_uploads` et `strapi_data`.

### Fichiers

- `backend/Dockerfile` — image Strapi multi-stage (Node 22 alpine)
- `frontend/Dockerfile` — image Next.js en mode standalone
- `nginx/default.conf` — reverse proxy Nginx
- `docker-compose.yml` — orchestration des 3 services sur le réseau `app-network`

## Déploiement

### Frontend → Vercel

1. Importez le repo dans Vercel.
2. Définissez le **Root Directory** sur `frontend`.
3. Ajoutez la variable d'environnement `NEXT_PUBLIC_STRAPI_URL` (URL de votre API Strapi Cloud, ex. `https://votre-projet.strapiapp.com`).

### Backend → Strapi Cloud

1. Créez un projet sur [Strapi Cloud](https://cloud.strapi.io) et reliez ce repo.
2. Strapi Cloud gère la base de données et les variables d'environnement de production.

## Scripts utiles

| Commande | Description |
| --- | --- |
| `npm run dev` (frontend) | Serveur de développement Next.js |
| `npm run build` (frontend) | Build de production |
| `npm run develop` (backend) | Strapi en mode développement |
| `npm run build` (backend) | Build Strapi de production |
| `npm run strapi` (backend) | Strapi de production |

## Ressources

- [Documentation Next.js](https://nextjs.org/docs)
- [Documentation Strapi](https://docs.strapi.io)
- [Documentation Vercel](https://vercel.com/docs)
- [Documentation Strapi Cloud](https://docs.strapi.io/cloud)
