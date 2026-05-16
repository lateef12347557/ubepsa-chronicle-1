import { supabase } from "@/integrations/supabase/client";

const SUPER_ADMIN_EMAIL = "ubepsaadmin@gmail.com";

export async function listAdmins() {
  const { data: roles, error } = await supabase
    .from("user_roles")
    .select("user_id, created_at")
    .eq("role", "admin");
  if (error) throw new Error(error.message);

  const admins = (roles ?? []).map((r) => ({
    userId: r.user_id,
    email: "(see dashboard)",
    createdAt: r.created_at as string,
  }));

  return { admins, superAdminEmail: SUPER_ADMIN_EMAIL };
}

export async function grantAdmin({ data }: { data: { email: string } }) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated.");
  if (user.email?.toLowerCase() !== SUPER_ADMIN_EMAIL) {
    throw new Error("Only the primary admin can grant admin access.");
  }

  const target = data.email.toLowerCase();
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id")
    .eq("email", target)
    .single();
  if (error || !profile) throw new Error("No user found with that email.");

  const { error: insErr } = await supabase
    .from("user_roles")
    .insert({ user_id: profile.id, role: "admin" });
  if (insErr && !insErr.message.includes("duplicate")) throw new Error(insErr.message);

  return { ok: true, email: target };
}

export async function revokeAdmin({ data }: { data: { userId: string } }) {
  const { data: { user }, error: userError } = await supabase.auth.getUser();
  if (userError || !user) throw new Error("Not authenticated.");
  if (user.email?.toLowerCase() !== SUPER_ADMIN_EMAIL) {
    throw new Error("Only the primary admin can revoke admin access.");
  }

  const { error } = await supabase
    .from("user_roles")
    .delete()
    .eq("user_id", data.userId)
    .eq("role", "admin");
  if (error) throw new Error(error.message);

  return { ok: true };
}
