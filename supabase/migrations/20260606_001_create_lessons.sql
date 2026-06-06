-- Migration 001: create lessons table
-- Iterazione 2 — Database e lezioni

CREATE TABLE IF NOT EXISTS lessons (
  id          uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  day_of_week text        NOT NULL,
  time        text        NOT NULL,
  course_name text        NOT NULL,
  max_seats   integer     NOT NULL DEFAULT 12,
  is_active   boolean     NOT NULL DEFAULT true,
  notes       text,
  created_at  timestamptz NOT NULL DEFAULT now()
);

-- Insert the 8 weekly lesson slots
INSERT INTO lessons (day_of_week, time, course_name, max_seats, is_active, notes) VALUES
  ('Lunedì',    '18:00', 'Mix',     12, true,  NULL),
  ('Lunedì',    '19:00', 'Pilates', 12, true,  NULL),
  ('Martedì',   '10:00', 'Pilates', 12, true,  NULL),
  ('Mercoledì', '18:00', 'Pilates', 12, true,  NULL),
  ('Mercoledì', '19:00', 'Mix',     12, true,  NULL),
  ('Giovedì',   '10:00', 'Pilates', 12, true,  NULL),
  ('Giovedì',   '18:00', 'Mix',     12, false, 'da concordare'),
  ('Giovedì',   '19:00', 'Pilates', 12, true,  NULL)
ON CONFLICT DO NOTHING;
