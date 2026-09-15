import { useEffect, useState } from "react";
import { instance } from "../../api/api";

type Article = {
  title: string;
  link: string;
  published_at: string;
  description: string;
  image: string;
};

type Competition = {
  id: string;
  name: string;
  slug: string;
  link: string;
};

type FeedState = {
  articles: Article[];
  error: string;
};

const EMPTY_FEED: FeedState = {
  articles: [],
  error: "",
};

// ---------- Helpers ----------

function formatDate(date: string) {
  if (!date) {
    return "Latest";
  }

  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

async function loadFeed(url: string): Promise<FeedState> {
  try {
    const response = await instance.get<Article[]>(url);
    return { articles: response.data, error: "" };
  } catch {
    return { articles: [], error: "This feed is unavailable right now." };
  }
}

async function loadCompetitions(): Promise<Competition[]> {
  try {
    const response = await instance.get<Competition[]>("football/");
    return response.data;
  } catch {
    return [];
  }
}



function NewsCard({ article }: { article: Article }) {
  return (
    <a className="news-card" href={article.link} target="_blank" rel="noreferrer">
      {article.image ? (
        <img src={article.image} alt="" />
      ) : (
        <div className="news-card-image image-placeholder">SPORT</div>
      )}

      <div className="news-card-content">
        <span className="article-date">{formatDate(article.published_at)}</span>
        <h3>{article.title}</h3>
        <p>{article.description}</p>
        <span className="read-link">
          Read story <span aria-hidden="true">→</span>
        </span>
      </div>
    </a>
  );
}

function NewsSection({
  id,
  title,
  accent,
  feed,
}: {
  id: string;
  title: string;
  accent: string;
  feed: FeedState;
}) {
  let content;

  if (feed.error) {
    content = <div className="message error-message">{feed.error}</div>;
  } else if (feed.articles.length === 0) {
    content = <div className="message">Loading stories...</div>;
  } else {
    content = (
      <div className="news-grid">
        {feed.articles.slice(0, 6).map((article, index) => (
          <NewsCard key={`${article.link}-${index}`} article={article} />
        ))}
      </div>
    );
  }

  return (
    <section className="content-section" id={id}>
      <div className="section-heading">
        <div>
          <span className={`section-kicker ${accent}`}>The latest</span>
          <h2>{title}</h2>
        </div>
        <span className="story-count">{feed.articles.length} stories</span>
      </div>

      {content}
    </section>
  );
}



export function Welcome() {
  const [football, setFootball] = useState<Competition[]>([]);
  const [footballNews, setFootballNews] = useState<FeedState>(EMPTY_FEED);
  const [transferNews, setTransferNews] = useState<FeedState>(EMPTY_FEED);
  const [nflNews, setNflNews] = useState<FeedState>(EMPTY_FEED);
  const [nbaNews, setNbaNews] = useState<FeedState>(EMPTY_FEED);

  useEffect(() => {
    loadCompetitions().then(setFootball);

    loadFeed("football-news/").then(setFootballNews);
    loadFeed("transfer-news/").then(setTransferNews);
    loadFeed("nfl-news/").then(setNflNews);
    loadFeed("nba-news/").then(setNbaNews);
  }, []);

  return (
    <div className="app-shell">
      <header className="site-header">
        <a className="brand" href="#top" aria-label="Kickoff home">
          <span className="brand-mark">K</span>
          <span>
            kickoff<span className="brand-dot">.</span>
          </span>
        </a>

        <nav className="main-nav" aria-label="Main navigation">
          <a href="#football">Football</a>
          <a href="#news">News</a>
          <a href="#transfers">Transfers</a>
          <a href="#american-sports">NFL / NBA</a>
        </nav>

        <div className="live-badge">
          <span /> Live sports desk
        </div>
      </header>

      <main id="top">
        <section className="hero">
          <div className="hero-copy">
            <span className="eyebrow">Saturday, 12 September 2026</span>
            <h1>
              Stay close
              <br />
              to the <em>game.</em>
            </h1>
            <p>The stories, leagues, and moves shaping sport today. Curated from the feeds that matter.</p>
            <a className="primary-button" href="#news">
              Explore the news <span aria-hidden="true">↓</span>
            </a>
          </div>

          <div className="hero-stat">
            <span className="stat-label">Your sports pulse</span>
            <strong>05</strong>
            <span>
              live data feeds
              <br />
              updated today
            </span>
          </div>
        </section>

        <section className="content-section league-section" id="football">
          <div className="section-heading">
            <div>
              <span className="section-kicker green">From the data desk</span>
              <h2>Football leagues</h2>
            </div>
            <span className="story-count">{football.length} competitions</span>
          </div>

          {football.length === 0 ? (
            <div className="message">Loading competitions...</div>
          ) : (
            <div className="league-list">
              {football.map((competition) => (
                <a
                  href={`https://www.flashscore.com${competition.link}`}
                  target="_blank"
                  rel="noreferrer"
                  key={competition.id}
                >
                  <span className="league-icon">⚽</span>
                  <span>{competition.name}</span>
                  <span className="arrow" aria-hidden="true">↗</span>
                </a>
              ))}
            </div>
          )}
        </section>

        <div id="news">
          <NewsSection id="football-news" title="Football news" accent="red" feed={footballNews} />
        </div>

        <NewsSection id="transfers" title="Transfer watch" accent="yellow" feed={transferNews} />

        <div id="american-sports" className="sports-columns">
          <NewsSection id="nfl" title="NFL" accent="blue" feed={nflNews} />
          <NewsSection id="nba" title="NBA" accent="orange" feed={nbaNews} />
        </div>
      </main>

      <footer className="site-footer">
        <span className="brand">
          <span className="brand-mark">K</span> kickoff<span className="brand-dot">.</span>
        </span>
        <span>Live sport, clearly told.</span>
      </footer>
    </div>
  );
}