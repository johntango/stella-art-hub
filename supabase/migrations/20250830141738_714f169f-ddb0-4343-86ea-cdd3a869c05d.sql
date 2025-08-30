-- Update check_rate_limit function to accept text instead of inet
CREATE OR REPLACE FUNCTION public.check_rate_limit(ip text, max_attempts integer DEFAULT 5, window_minutes integer DEFAULT 15)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT (
    SELECT COUNT(*)
    FROM public.admin_login_attempts
    WHERE ip_address::text = ip
      AND attempted_at > now() - interval '1 minute' * window_minutes
      AND success = false
  ) < max_attempts;
$$;