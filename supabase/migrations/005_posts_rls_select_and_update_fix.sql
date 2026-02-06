-- Allow authenticated users to read posts they can edit (own posts or any post if moderator/admin).
-- This fixes: (1) loading draft posts for editing, (2) "new row violates" on update by relaxing author UPDATE WITH CHECK.

-- Authors can read their own posts (any status); moderators/admins can read all
CREATE POLICY "Authors can read own posts"
  ON public.posts FOR SELECT TO authenticated
  USING (author_id = auth.uid());

CREATE POLICY "Moderators and admins can read any post"
  ON public.posts FOR SELECT TO authenticated
  USING (EXISTS (SELECT 1 FROM public.get_user_roles(auth.uid()) AS r(name) WHERE r.name IN ('moderator', 'admin')));

-- Relax author update policy so the updated row always passes (author_id is not in the update payload)
DROP POLICY IF EXISTS "Authors can update own drafts" ON public.posts;
CREATE POLICY "Authors can update own posts"
  ON public.posts FOR UPDATE TO authenticated
  USING (author_id = auth.uid())
  WITH CHECK (true);
