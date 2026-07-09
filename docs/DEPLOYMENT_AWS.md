# Deployment — AWS EC2 + Cloudflare R2

Production runbook for the developer. Architecture:

```
Visitors → Cloudflare (CDN + WAF + TLS) → EC2 (Docker: Caddy → app) → MongoDB Atlas
                                          media served directly from Cloudflare R2
```

The client provides the credentials collected in
[`CLIENT_SERVICES_SETUP.md`](./CLIENT_SERVICES_SETUP.md). This document is what
you do with them.

## What the code migration already did

- `starter.config.ts` reads `STORAGE_PROVIDER` (defaults to `local` for dev).
- `src/starter/adapters/storage.ts`: the `s3` provider works with R2
  (`S3_REGION=auto`, `S3_ENDPOINT` = R2 endpoint). When `NEXT_PUBLIC_CDN_URL` is
  set, media gets `disablePayloadAccessControl` + a direct CDN URL, so images are
  served straight from R2/Cloudflare instead of through the Node process.
- `.env.example`: leaked Atlas string removed; R2/AWS vars documented.
- `.dockerignore`, `docker-compose.prod.yml`, `Caddyfile`: production Docker stack.

## Environment variables (production `.env`)

```
PAYLOAD_SECRET=<openssl rand -base64 32>
DATABASE_URL=mongodb+srv://<user>:<pass>@<cluster>.mongodb.net/payload-portal?retryWrites=true&w=majority
NEXT_PUBLIC_SERVER_URL=https://your-domain.com

STORAGE_PROVIDER=s3
S3_BUCKET=news-portal-media
S3_REGION=auto
S3_ACCESS_KEY_ID=<R2 access key>
S3_SECRET_ACCESS_KEY=<R2 secret key>
S3_ENDPOINT=https://<account_id>.r2.cloudflarestorage.com
NEXT_PUBLIC_CDN_URL=https://media.your-domain.com   # or the pub-*.r2.dev URL
```

## Step-by-step

### 1. Prepare R2 for browser-loaded images (CORS)

In Cloudflare R2 → bucket → **Settings → CORS policy**, allow `GET` from your
site origin so `next/image` can load images:

```json
[{ "AllowedOrigins": ["https://your-domain.com"], "AllowedMethods": ["GET"], "AllowedHeaders": ["*"] }]
```

### 2. Get a Cloudflare Origin Certificate

Cloudflare dashboard → **SSL/TLS → Origin Server → Create Certificate** (covers
`your-domain.com` and `*.your-domain.com`, 15-year validity). Save the certificate
as `certs/origin.pem` and the private key as `certs/origin.key` on the server.
Set SSL/TLS mode to **Full (strict)**.

### 3. Provision the EC2 host

SSH in with the client's `.pem` key, then install Docker:

```bash
sudo apt-get update && sudo apt-get install -y docker.io docker-compose-plugin
sudo usermod -aG docker $USER   # re-login after this
```

Confirm the EC2 **security group** allows inbound 80 and 443, and that the
instance's public IP is added to **Atlas → Network Access**.

### 4. Deploy

```bash
git clone <repo> && cd <repo>
cp .env.example .env      # then fill in the real values above
mkdir -p certs            # place origin.pem / origin.key here
DOMAIN=your-domain.com docker compose -f docker-compose.prod.yml up -d --build
```

### 5. Point DNS at the origin

Cloudflare → **DNS**: `A @ → <EC2 public IP>`, proxy **on** (orange cloud).
Cloudflare now serves cached pages/images from its edge and forwards misses to
Caddy on the EC2 box.

### 6. Verify

```bash
docker compose -f docker-compose.prod.yml logs -f app     # app started, DB connected
curl -I https://your-domain.com                           # 200, cf-cache-status header
```

- Log in at `https://your-domain.com/admin`, upload an image, confirm its URL is
  on `NEXT_PUBLIC_CDN_URL` (served from R2, not `/api/media`).
- Enter GA4/GTM IDs in **Site Settings → Analytics** (see the client guide).

## Migrating existing media (only if there is old content)

The dev seed ships 3 sample images in `public/media`; real uploads made while on
`local` storage must be copied into R2 once:

```bash
# with rclone configured for the R2 bucket, or aws-cli pointed at S3_ENDPOINT
aws s3 sync ./public/media s3://news-portal-media/ --endpoint-url $S3_ENDPOINT
```

Existing DB records already store the filenames, so URLs resolve once the files
are in the bucket.

## Notes

- **Rotate the leaked Atlas credential** (`artemijspizhav_db_user`) — it was
  committed to git history. Create a fresh DB user and delete the old one.
- Scaling: because Cloudflare absorbs cached traffic, start with one EC2 instance
  and scale the instance size up before adding horizontal replicas.
- `docker-compose.yml` (Postgres) and `docker-compose.sqlite.yml` are for local
  dev only — do not use them in production.
