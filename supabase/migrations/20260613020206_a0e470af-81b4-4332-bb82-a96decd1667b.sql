
CREATE OR REPLACE FUNCTION public.list_admins()
RETURNS TABLE(user_id uuid, email text, created_at timestamptz)
LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (SELECT lower(email) FROM auth.users WHERE id = auth.uid()) <> 'ubepsaadmin@gmail.com' THEN
    RAISE EXCEPTION 'Only the primary admin can manage admins.';
  END IF;
  RETURN QUERY
    SELECT ur.user_id, u.email::text, ur.created_at
    FROM public.user_roles ur
    JOIN auth.users u ON u.id = ur.user_id
    WHERE ur.role = 'admin'
    ORDER BY ur.created_at ASC;
END; $$;

CREATE OR REPLACE FUNCTION public.grant_admin_by_email(_email text)
RETURNS uuid LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid;
BEGIN
  IF (SELECT lower(email) FROM auth.users WHERE id = auth.uid()) <> 'ubepsaadmin@gmail.com' THEN
    RAISE EXCEPTION 'Only the primary admin can manage admins.';
  END IF;
  SELECT id INTO _uid FROM auth.users WHERE lower(email) = lower(_email) LIMIT 1;
  IF _uid IS NULL THEN
    RAISE EXCEPTION 'No user found with that email. Ask them to sign up first.';
  END IF;
  INSERT INTO public.user_roles(user_id, role) VALUES (_uid, 'admin')
    ON CONFLICT (user_id, role) DO NOTHING;
  RETURN _uid;
END; $$;

CREATE OR REPLACE FUNCTION public.revoke_admin(_user_id uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  IF (SELECT lower(email) FROM auth.users WHERE id = auth.uid()) <> 'ubepsaadmin@gmail.com' THEN
    RAISE EXCEPTION 'Only the primary admin can manage admins.';
  END IF;
  IF (SELECT lower(email) FROM auth.users WHERE id = _user_id) = 'ubepsaadmin@gmail.com' THEN
    RAISE EXCEPTION 'The primary admin cannot be revoked.';
  END IF;
  DELETE FROM public.user_roles WHERE user_id = _user_id AND role = 'admin';
END; $$;

GRANT EXECUTE ON FUNCTION public.list_admins() TO authenticated;
GRANT EXECUTE ON FUNCTION public.grant_admin_by_email(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.revoke_admin(uuid) TO authenticated;
