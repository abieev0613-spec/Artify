# Artify — Supabase + GitHub Pages (no Node.js backend)

1. Open `supabase-config.js` and enter your Supabase Project URL and Publishable key (`sb_publishable_...`). Never put a secret/service-role key in this file.
2. In Supabase Dashboard → SQL Editor, run all of `supabase_schema.sql`.
3. In Supabase → Authentication → URL Configuration, set Site URL to your GitHub Pages URL (for example `https://USERNAME.github.io/REPOSITORY/`) and add that URL plus `https://USERNAME.github.io/REPOSITORY/login.html` to Redirect URLs.
4. In Supabase → Authentication → Providers → Email, keep Email provider enabled and Confirm email enabled. Configure SMTP in Supabase for reliable production email delivery; the default email service is rate-limited.
5. Upload the contents of this folder (not the containing folder) to your GitHub repository. In Settings → Pages, deploy from the main branch and root folder.
6. Open the published site and test Create Account → confirm email → Login.

This build uses Supabase Auth and a per-user JSONB data row protected by RLS. Each signed-in user's profile, custom art requests and orders are isolated by `auth.uid()`. Product catalogue data remains in the static frontend. Some admin-only/server-only operations from the original Node server are intentionally not exposed in this public browser build.
