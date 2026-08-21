CREATE TABLE IF NOT EXISTS comment_likes (
  comment_id INTEGER NOT NULL,
  visitor_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  PRIMARY KEY (comment_id, visitor_id),
  FOREIGN KEY (comment_id) REFERENCES comments (id) ON DELETE CASCADE
);

CREATE INDEX IF NOT EXISTS comment_likes_by_comment_idx
ON comment_likes (comment_id);
