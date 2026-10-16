CREATE TABLE IF NOT EXISTS app_state (
  id INTEGER PRIMARY KEY CHECK (id=1),
  payload TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS votes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  round_index INTEGER NOT NULL CHECK (round_index BETWEEN 0 AND 5),
  voter_digest TEXT NOT NULL,
  choice TEXT NOT NULL CHECK (choice IN ('A','B','C')),
  created_at INTEGER NOT NULL DEFAULT (unixepoch()),
  UNIQUE(round_index,voter_digest)
);
CREATE INDEX IF NOT EXISTS votes_round_choice ON votes(round_index, choice);
