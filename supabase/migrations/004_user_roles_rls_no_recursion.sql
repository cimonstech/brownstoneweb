-- Fix infinite recursion in user_roles RLS: use SECURITY DEFINER helper
-- so the policy does not query user_roles (which would re-trigger the policy).
-- Also restrict admins from modifying their own role rows.

CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.roles r
    JOIN public.user_roles ur ON ur.role_id = r.id
    WHERE ur.user_id = auth.uid() AND r.name = 'admin'
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE SET search_path = public;

-- Drop the old policy that caused recursion (it queried user_roles inside the policy)
DROP POLICY IF EXISTS "Admins can manage user_roles" ON public.user_roles;

-- Admins can manage other users' roles only (not their own)
CREATE POLICY "Admins can manage other user_roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.is_admin() AND user_id != auth.uid())
  WITH CHECK (public.is_admin() AND user_id != auth.uid());
