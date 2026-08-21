CREATE TABLE IF NOT EXISTS post_likes (
  post_path TEXT NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (post_path, visitor_id)
);

CREATE INDEX IF NOT EXISTS post_likes_by_path_idx
ON post_likes (post_path);
