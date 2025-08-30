-- Add unique constraint on email for attendee table to fix upsert operations
ALTER TABLE public.attendee ADD CONSTRAINT attendee_email_unique UNIQUE (email);