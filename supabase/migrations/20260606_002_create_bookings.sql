-- Migration 002: create bookings table
-- Iterazione 2 — Database e prenotazioni

CREATE TABLE IF NOT EXISTS bookings (
  id                  uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  lesson_id           uuid        NOT NULL REFERENCES lessons(id) ON DELETE RESTRICT,
  first_name          text        NOT NULL,
  last_name           text        NOT NULL,
  email               text        NOT NULL,
  phone               text        NOT NULL,
  status              text        NOT NULL DEFAULT 'confirmed' CHECK (status IN ('confirmed', 'cancelled')),
  cancel_token        text        NOT NULL UNIQUE DEFAULT encode(gen_random_bytes(32), 'hex'),
  created_at          timestamptz NOT NULL DEFAULT now(),
  cancelled_at        timestamptz,
  cancellation_source text        CHECK (cancellation_source IN ('user', 'admin'))
);

-- Index: fast lookup confirmed bookings per lesson (for seat counting)
CREATE INDEX IF NOT EXISTS idx_bookings_lesson_status
  ON bookings (lesson_id, status);

-- Index: fast cancel-token lookup
CREATE INDEX IF NOT EXISTS idx_bookings_cancel_token
  ON bookings (cancel_token);

-- Index: fast email lookup
CREATE INDEX IF NOT EXISTS idx_bookings_email
  ON bookings (email);
