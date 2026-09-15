# Kickoff: Live Sports Desk

Kickoff is a sports news dashboard that brings football updates, transfer news, NFL news, and NBA news into one place. The project uses a React frontend and a Django REST API backend that collects data from SportDB and third-party RSS feeds.

## Problem It Solves

Sports information is spread across league websites, news sites, and social media. Checking several sources makes it difficult to find the most relevant updates quickly and compare coverage in one place.

Kickoff solves this by providing:

- One dashboard for football, transfers, NFL, and NBA news
- A consistent article format with titles, links, publication dates, descriptions, and images
- Football team data from the SportDB API
- A separate backend API that can be reused by the web frontend or another client

## Current Features

- Football data and team information
- Football news from BBC Sport RSS
- Transfer news from BBC Sport RSS
- NFL news from Yahoo Sports RSS
- NBA news from Yahoo Sports RSS
- Responsive React user interface
- Django REST endpoints for frontend integration
- CORS configuration for local and deployed frontend clients

## Technology Stack

### Frontend

- React 19
- TypeScript
- React Router
- Vite
- Tailwind CSS
- Axios

### Backend

- Python
- Django 6
- Django REST Framework
- django-cors-headers
- Requests
- Gunicorn for production serving

## Project Structure

```text
Football Live Website/
├── backend/
│   ├── football/          # API app, views, and URL routes
│   ├── mysite/            # Django project settings and WSGI configuration
│   ├── manage.py
│   ├── requirements.txt
│   └── README.md
├── frontend/
│   ├── api/               # Axios API client
│   ├── app/               # React Router routes and styles
│   ├── public/
│   ├── package.json
│   └── vite.config.ts
└── README.md
```

## Getting Started

### Prerequisites

- Python 3
- Node.js and npm
- A SportDB API key for the football data endpoint

### Clone the repository

```bash
git clone <your-repository-url>
cd "Football Live Website"
```

### Start the backend

From the repository root:

```powershell
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

On macOS or Linux, activate the virtual environment with:

```bash
source .venv/bin/activate
```

The backend runs at `http://127.0.0.1:8000`.

### Start the frontend

In a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend runs at `http://localhost:5173`.

## Environment Variables

### Backend

Create `backend/.env` for local reference, or configure these variables in the hosting provider. Do not commit real secrets.

```env
DJANGO_SECRET_KEY=your-strong-secret-key
DJANGO_DEBUG=False
DJANGO_ALLOWED_HOSTS=localhost,127.0.0.1
CORS_ALLOWED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
CSRF_TRUSTED_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
FOOTBALL_API_KEY=your-sportdb-api-key
```

The backend reads these values from the process environment. If using Render, add them under the service's **Environment** settings. The `.env` file is not automatically loaded by Django.

### Frontend

Create `frontend/.env` for local development:

```env
VITE_API_BASE_URL=http://127.0.0.1:8000/api/
```

For Vercel, add this environment variable in the project settings and set it to the deployed backend URL:

```env
VITE_API_BASE_URL=https://your-backend.onrender.com/api/
```

After changing a Vercel environment variable, redeploy the frontend.

## API Endpoints

The backend base URL is `http://127.0.0.1:8000/api/` locally.

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/football/` | Football team data from SportDB |
| GET | `/api/football-news/` | Football news from BBC Sport |
| GET | `/api/transfer-news/` | Transfer news from BBC Sport |
| GET | `/api/nfl-news/` | NFL news from Yahoo Sports |
| GET | `/api/nba-news/` | NBA news from Yahoo Sports |

Example request:

```bash
curl http://127.0.0.1:8000/api/football-news/
```

News responses contain article objects with fields such as `title`, `link`, `published_at`, `description`, and `image`.

## Deployment

### Backend on Render

Use these service settings:

- Root directory: `backend`
- Build command: `pip install -r requirements.txt`
- Start command: `gunicorn mysite.wsgi:application --bind 0.0.0.0:$PORT`

Add the backend environment variables listed above, including the production frontend URL in `CORS_ALLOWED_ORIGINS` and `CSRF_TRUSTED_ORIGINS`.

### Frontend on Vercel

- Root directory: `frontend`
- Build command: `npm run build`
- Environment variable: `VITE_API_BASE_URL`

The Vercel frontend must point to the deployed Render API, not the local `127.0.0.1` URL.

## Testing and Checks

Run the Django configuration check with:

```bash
cd backend
python manage.py check
```

Run the frontend type check with:

```bash
cd frontend
npm run typecheck
```

## Known Limitations

- News is fetched from external RSS sources at request time, so an unavailable or changed source can make an endpoint return an error.
- The current football endpoint is tied to the configured SportDB request and is not yet a complete live-score system.
- The project currently has limited automated test coverage.
- SQLite is suitable for development but is not ideal for a larger production workload.

## Future Improvements

- Add live scores, fixtures, league tables, and match details
- Add team and competition search
- Add article categories, filtering, and sorting by date
- Cache external API and RSS responses to improve speed and reduce rate limits
- Add scheduled background refreshes instead of fetching every feed on demand
- Add user accounts, saved teams, and personalised news feeds
- Add automated backend and frontend tests
- Add better error states, loading states, and accessibility improvements
- Move production data from SQLite to PostgreSQL
- Add monitoring, logging, and rate limiting for the public API
- Add Docker and CI/CD workflows for repeatable deployments

## Security Notes

- Never commit `DJANGO_SECRET_KEY` or `FOOTBALL_API_KEY` to the repository.
- Rotate any API key that has been exposed in source code or public commits.
- Set `DJANGO_DEBUG=False` in production.
- Restrict `DJANGO_ALLOWED_HOSTS`, `CORS_ALLOWED_ORIGINS`, and `CSRF_TRUSTED_ORIGINS` to the domains actually used by the deployed services.
