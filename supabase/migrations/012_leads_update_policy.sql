-- Allow admins and moderators to update leads (e.g. set contact_id when adding to contacts).
CREATE POLICY "Admins and moderators can update leads"
  ON public.leads FOR UPDATE TO authenticated
  USING (public.is_admin_or_moderator())
  WITH CHECK (public.is_admin_or_moderator());
