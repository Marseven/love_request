-- ============================================
-- Love Request — Schéma Supabase
-- Exécuter dans l'éditeur SQL de Supabase
-- ============================================

CREATE TABLE love_requests (
  id TEXT PRIMARY KEY,
  sender_name TEXT NOT NULL,
  valentine_name TEXT NOT NULL,
  personal_message TEXT NOT NULL,
  date_info TEXT,
  note TEXT,
  theme TEXT DEFAULT 'rose',
  response TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  responded_at TIMESTAMPTZ
);

-- Index pour les requêtes par date
CREATE INDEX idx_love_requests_created_at ON love_requests (created_at DESC);

-- Row Level Security (optionnel mais recommandé)
-- On laisse l'API serverless gérer l'accès via la service key
ALTER TABLE love_requests ENABLE ROW LEVEL SECURITY;

-- Politique : autoriser toutes les opérations via la service key
CREATE POLICY "Service key full access"
  ON love_requests
  FOR ALL
  USING (true)
  WITH CHECK (true);
