import requests
import xml.etree.ElementTree as ET
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.conf import settings


def fetch_rss_articles(rss_url, error_message):
    try:
        response = requests.get(rss_url, timeout=15)
        response.raise_for_status()
    except requests.RequestException:
        return Response(
            {"detail": error_message},
            status=502,
        )

    try:
        root = ET.fromstring(response.content)
    except ET.ParseError:
        return Response(
            {"detail": "News feed returned invalid XML."},
            status=502,
        )

    items = root.findall(".//item")
    articles = []

    for item in items[:12]:
        media = item.find("{http://search.yahoo.com/mrss/}thumbnail")
        articles.append(
            {
                "title": item.findtext("title", default=""),
                "link": item.findtext("link", default=""),
                "published_at": item.findtext("pubDate", default=""),
                "description": item.findtext("description", default=""),
                "image": media.attrib.get("url", "") if media is not None else "",
            }
        )

    return Response(articles)


@api_view(["GET"])
def premier_league_teams(request):
    url = "https://api.sportdb.dev/api/flashscore/football/france:77"

    headers = {
        "X-API-Key": settings.FOOTBALL_API_KEY
    }

    response = requests.get(url, headers=headers, timeout=15)

    return Response(response.json())


@api_view(["GET"])
def football_news(request):
    rss_url = "https://feeds.bbci.co.uk/sport/football/rss.xml"
    return fetch_rss_articles(rss_url, "Failed to fetch football news.")


@api_view(["GET"])
def nfl_news(request):
    rss_url = "https://sports.yahoo.com/nfl/rss/"
    return fetch_rss_articles(rss_url, "Failed to fetch NFL news.")


@api_view(["GET"])
def nba_news(request):
    rss_url = "https://sports.yahoo.com/nba/rss/"
    return fetch_rss_articles(rss_url, "Failed to fetch NBA news.")


@api_view(["GET"])
def transfer_news(request):
    rss_url = "https://feeds.bbci.co.uk/sport/football/transfers/rss.xml"
    return fetch_rss_articles(rss_url, "Failed to fetch transfer news.")