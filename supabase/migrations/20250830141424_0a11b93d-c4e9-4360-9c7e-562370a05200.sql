-- Grant admin role to the existing user
INSERT INTO public.user_roles (user_id, role, created_by)
VALUES (
  '1efe6d87-4dc4-4908-a864-2d68c2ff1d3e',
  'admin',
  '1efe6d87-4dc4-4908-a864-2d68c2ff1d3e'
)
ON CONFLICT (user_id, role) DO NOTHING;