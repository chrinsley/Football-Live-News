# Sports News API

Django REST backend that serves football data and sports news for a React frontend.

## Features

- Football league/team data from SportDB
- Football, NFL, NBA, and transfer news via RSS feeds
- CORS enabled for a Vite/React frontend (`http://localhost:5173`)
- JSON responses ready for frontend pages

## Tech stack

- Python 3
- Django 6
- Django REST Framework
- django-cors-headers
- requests

## Setup

1. Clone the repo:

```bash
git clone <your-repo-url>
cd backend(football api)
```

2. Create and activate a virtual environment:

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS / Linux
source .venv/bin/activate
```

3. Install dependencies:

```bash
pip install Django djangorestframework django-cors-headers requests
```

4. Set your SportDB API key in `mysite/settings.py`:

```python
FOOTBALL_API_KEY = "your-api-key-here"
```

5. Run migrations and start the server:

```bash
python manage.py migrate
python manage.py runserver
```

API base URL: `http://127.0.0.1:8000/api/`

## API endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/football/` | Football league/team data |
| `GET` | `/api/football-news/` | Football news (BBC Sport RSS) |
| `GET` | `/api/nfl-news/` | NFL news (Yahoo Sports RSS) |
| `GET` | `/api/nba-news/` | NBA news (Yahoo Sports RSS) |
| `GET` | `/api/transfer-news/` | Transfer news (BBC Sport RSS) |

### Example requests

```bash
curl http://127.0.0.1:8000/api/football/
curl http://127.0.0.1:8000/api/football-news/
curl http://127.0.0.1:8000/api/nfl-news/
curl http://127.0.0.1:8000/api/nba-news/
curl http://127.0.0.1:8000/api/transfer-news/
```

### News response shape

News endpoints return an array of articles:

```json
[
  {
    "title": "Article title",
    "link": "https://example.com/article",
    "published_at": "Fri, 08 May 2026 12:00:00 GMT",
    "description": "Short summary...",
    "image": "https://example.com/image.jpg"
  }
]
```

## Project structure

```
backend(football api)/
├── football/          # App with API views and routes
│   ├── urls.py
│   └── views.py
├── mysite/            # Django project settings
│   ├── settings.py
│   └── urls.py
├── manage.py
└── README.md
```

## Frontend integration

This backend is designed to work with a React frontend using React Router. Point your frontend fetches to:

- Football page: `/api/football/` and `/api/football-news/`
- NFL page: `/api/nfl-news/`
- NBA page: `/api/nba-news/`
- Transfers page: `/api/transfer-news/`

CORS is configured for `http://localhost:5173` in `mysite/settings.py`. Update `CORS_ALLOWED_ORIGINS` if your frontend runs on a different origin.

## Notes

- News feeds are fetched live from third-party RSS sources. If a source is down or blocked, the related endpoint returns `502`.
- Keep `FOOTBALL_API_KEY` and `SECRET_KEY` out of public commits when possible (use environment variables for production).
