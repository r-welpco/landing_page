# Pre-launch landing

Next.js 16 app for the Welpco pre-launch phase. Single landing page with video hero, Customer/Welper copy, and email signup. Form submissions are stored in PostgreSQL (Drizzle ORM) and a confirmation email is sent via SMTP (e.g. MailHog locally).

## Run locally

1. From monorepo root: `pnpm install`, then `pnpm --filter @welpco/pre-launch-landing dev` (or `pnpm dev:prelaunch` if configured).
2. Set `DATABASE_URL` (PostgreSQL). Create the table with `pnpm db:push` from this app directory.
3. Start MailHog: `docker-compose up -d` (SMTP :1025, Web UI :8025).
4. Open [http://localhost:8082](http://localhost:8082).

## Database

PostgreSQL with [Drizzle ORM](https://orm.drizzle.team/). Table: `pre_launch_signups` (email, segment, interested_customer, interested_welper, comment, created_at).

- **Push schema** (create/update tables): `pnpm db:push`
- **Generate migrations**: `pnpm db:generate`
- **Run migrations**: `pnpm db:migrate`

If `DATABASE_URL` is not set, the app still runs but form submissions are not persisted (only the confirmation email is sent).

## Video asset

Use the same hero video as the main web app. Place `hero-background.mp4` in `apps/pre-launch-landing/public/` (same file as `apps/web/public/hero-background.mp4` if present there).

## Env

See `.env.example`. `DATABASE_URL` is required for storing signups; SMTP defaults work with MailHog (localhost:1025). Set `PUBLIC_APP_URL` in production so the confirmation email shows the green logo (absolute image URL).
