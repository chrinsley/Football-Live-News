from django.urls import path
from .views import (
    premier_league_teams,
    football_news,
    nfl_news,
    nba_news,
    transfer_news,
)

urlpatterns = [
    path("football/", premier_league_teams),
    path("football-news/", football_news),
    path("nfl-news/", nfl_news),
    path("nba-news/", nba_news),
    path("transfer-news/", transfer_news),
]