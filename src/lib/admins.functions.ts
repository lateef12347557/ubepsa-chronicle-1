import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const SUPER_ADMIN_EMAIL = "ubepsaadmin@gmail.com";

async function assertSuperAdmin(claims: Record<string, unknown>) {
  const email = String((claims as { email?: string }).email ?? "").toLowerCase();
  if (email !== SUPER_ADMIN_EMAIL) {
    throw new Error("Only the primary admin can manage admins.");
  }
}

export const listAdmins = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    await assertSuperAdmin(context.claims as Record<string, unknown>);
    const { data: roles, error } = await supabaseAdmin
      .from("user_roles")
      .select("user_id, created_at")
      .eq("role", "admin");
    if (error) throw new Error(error.message);

    const admins = await Promise.all(
      (roles ?? []).map(async (r) => {
        const { data } = await supabaseAdmin.auth.admin.getUserById(r.user_id);
        return {
          userId: r.user_id,
          email: data.user?.email ?? "(unknown)",
          createdAt: r.created_at as string,
        };
      })
    );
    return { admins, superAdminEmail: SUPER_ADMIN_EMAIL };
  });

export const grantAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) =>
    z.object({ email: z.string().trim().email().max(255) }).parse(input)
  )
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.claims as Record<string, unknown>);
    const target = data.email.toLowerCase();

    // Find user by email (paginated search)
    let userId: string | null = null;
    for (let page = 1; page <= 10 && !userId; page++) {
      const { data: list, error } = await supabaseAdmin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw new Error(error.message);
      const found = list.users.find((u) => u.email?.toLowerCase() === target);
      if (found) userId = found.id;
      if (list.users.length < 200) break;
    }
    if (!userId) throw new Error("No user found with that email. Ask them to sign up first.");

    const { error: insErr } = await supabaseAdmin
      .from("user_roles")
      .insert({ user_id: userId, role: "admin" });
    if (insErr && !insErr.message.includes("duplicate")) throw new Error(insErr.message);

    return { ok: true, userId, email: target };
  });

export const revokeAdmin = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input) => z.object({ userId: z.string().uuid() }).parse(input))
  .handler(async ({ data, context }) => {
    await assertSuperAdmin(context.claims as Record<string, unknown>);

    const { data: target } = await supabaseAdmin.auth.admin.getUserById(data.userId);
    if (target.user?.email?.toLowerCase() === SUPER_ADMIN_EMAIL) {
      throw new Error("The primary admin cannot be revoked.");
    }

    const { error } = await supabaseAdmin
      .from("user_roles")
      .delete()
      .eq("user_id", data.userId)
      .eq("role", "admin");
    if (error) throw new Error(error.message);

    return { ok: true };
  });
