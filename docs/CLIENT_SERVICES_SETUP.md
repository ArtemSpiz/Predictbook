# Client Services Setup — Click-by-Click Guide

Follow every step in order. Whenever you see **💾 SAVE**, copy that value into a
notes file (or password manager) — at the end you send all saved values to your
developer and the rest is done for you.

Keep one text file open called `keys.txt`. You will paste 9 values into it.

---

## What you will collect (your `keys.txt`)

```
DATABASE_URL          = (Part 1)
S3_BUCKET             = (Part 2)
S3_ACCESS_KEY_ID      = (Part 2)
S3_SECRET_ACCESS_KEY  = (Part 2)
S3_ENDPOINT           = (Part 2)
NEXT_PUBLIC_CDN_URL   = (Part 2)
EC2_PUBLIC_IP         = (Part 3)
EC2_SSH_KEY           = (Part 3 — a .pem file)
GA4_ID + GTM_ID       = (Part 5)
```

---

# PART 1 — MongoDB (Database)

1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (email + password, or "Sign up with Google"). Verify your email.
3. After login, if it asks questions, just click **Finish** / **Skip**.
4. Click the green **+ Create** (or **Build a Database**) button.
5. Choose the **Dedicated** plan (NOT the free "M0"). Pick size **M10**.
6. Provider: click **AWS**. Region: pick **Frankfurt (eu-central-1)**.
7. Cluster Name: type `news-portal`. Click **Create Deployment** (bottom).
8. A popup **"Connect to ... / Create a database user"** appears:
   - Username: type `portaladmin`
   - Password: click **Autogenerate Secure Password**, then **Copy** it.
   - 💾 **SAVE** the password somewhere temporarily (you need it in step 12).
   - Click **Create Database User**.
9. Click **Choose a connection method** → **Drivers**.
10. You now see a connection string like:
    `mongodb+srv://portaladmin:<db_password>@news-portal.xxxxx.mongodb.net/...`
    Click the **Copy** icon next to it.
11. Now go to the left menu → **Network Access** → **+ ADD IP ADDRESS**.
    Click **ALLOW ACCESS FROM ANYWHERE** → **Confirm**. (Your developer will
    tighten this later.)
12. Take the string you copied in step 10. Replace `<db_password>` with the
    password from step 8, and add `payload-portal` after `.net/` like this:
    ```
    mongodb+srv://portaladmin:YOURPASSWORD@news-portal.xxxxx.mongodb.net/payload-portal?retryWrites=true&w=majority
    ```
13. 💾 **SAVE** this final string in `keys.txt` as `DATABASE_URL`.

> ⚠️ **Important:** an old password was accidentally leaked in the project's
> example file. Tell your developer: _"reset/delete the old Atlas user
> `artemijspizhav_db_user`."_ The new user above replaces it.

---

# PART 2 — Cloudflare R2 (Photo Storage)

1. Go to: **https://dash.cloudflare.com/sign-up**
2. Sign up (email + password). Verify your email and log in.
3. In the left menu, click **R2 Object Storage**.
4. Click **Purchase R2** / **Enable** — it asks for a card. Add it (storage is
   cheap, and bandwidth is FREE, which is why we use it).
5. At the top of the R2 page you see **Account ID**. Click to copy it.
   - 💾 **SAVE** it — you build the endpoint from it: your endpoint is
     `https://ACCOUNTID.r2.cloudflarestorage.com` (paste your Account ID in place
     of `ACCOUNTID`). Save that full URL as `S3_ENDPOINT`.
6. Click **Create bucket**. Name: type `news-portal-media`. Click **Create bucket**.
   - 💾 **SAVE** `news-portal-media` in `keys.txt` as `S3_BUCKET`.
7. Go back to the R2 main page → click **Manage R2 API Tokens** (top right) →
   **Create API Token**.
8. Permissions: choose **Object Read & Write**. Click **Create API Token**.
9. It now shows two values ONE TIME ONLY:
   - **Access Key ID** → 💾 **SAVE** as `S3_ACCESS_KEY_ID`
   - **Secret Access Key** → 💾 **SAVE** as `S3_SECRET_ACCESS_KEY`
   - (If you close this page you lose the secret and must make a new token.)
10. Open your bucket `news-portal-media` → **Settings** tab → find
    **Public access / R2.dev subdomain** → click **Allow Access** / **Enable**.
    Copy the public URL it gives you (looks like `https://pub-xxxx.r2.dev`).
    - 💾 **SAVE** that URL as `NEXT_PUBLIC_CDN_URL`.

---

# PART 3 — AWS (The Server)

1. Go to: **https://aws.amazon.com/** → click **Create an AWS Account**.
2. Sign up (email, password, card for billing). Complete verification.
3. Log in to the console: **https://console.aws.amazon.com/**
4. Top-right region dropdown → choose **Europe (Frankfurt) eu-central-1**
   (same as your database in Part 1).
5. In the search bar at the top, type **EC2** and click it.
6. Click the orange **Launch instance** button.
7. Fill in:
   - **Name:** type `news-portal`
   - **Application and OS Images:** click **Ubuntu**.
   - **Instance type:** click the dropdown and choose **t3.large**.
8. **Key pair (login):** click **Create new key pair**.
   - Name: `news-portal-key`. Type: **RSA**. Format: **.pem**. Click
     **Create key pair** — a file `news-portal-key.pem` downloads.
   - 💾 **SAVE** that `.pem` file (this is `EC2_SSH_KEY`). Do not lose it.
9. **Network settings:** tick **Allow HTTPS traffic** and **Allow HTTP traffic**.
10. Click **Launch instance** (bottom right).
11. Click **View all instances**. Wait until **Instance state = Running**.
12. Click your instance. Copy the **Public IPv4 address**.
    - 💾 **SAVE** it as `EC2_PUBLIC_IP`.

---

# PART 4 — Point Your Domain at Cloudflare

(Do this once you have a domain name.)

1. In Cloudflare dashboard, click **Add a site** (top).
2. Type your domain (e.g. `yournews.com`) → **Continue** → choose the **Free**
   plan → **Continue**.
3. Cloudflare shows **2 nameservers** (like `bob.ns.cloudflare.com`). Copy both.
4. Go to the website where you bought the domain → find **Nameservers / DNS
   settings** → replace the existing nameservers with Cloudflare's two → save.
5. Back in Cloudflare → **DNS** → **Add record**:
   - Type: **A**, Name: `@`, IPv4 address: paste your `EC2_PUBLIC_IP`,
     Proxy status: **Proxied** (orange cloud ON) → **Save**.
6. Left menu → **SSL/TLS** → set mode to **Full (strict)**.

(That's all for the domain. No values to save here — just tell your developer the
domain name.)

---

# PART 5 — Analytics Codes (for the Admin Panel)

### A) Google Analytics (GA4)

1. Go to: **https://analytics.google.com/**
2. Sign in with your Google account. Click **Start measuring** / **Admin** (gear
   bottom-left).
3. Create **Account** → name it `News Portal` → **Next**.
4. Create **Property** → name `yournews` → set your country/timezone → **Next** →
   **Create**.
5. Choose platform **Web** → enter your site URL `https://yournews.com` →
   **Create stream**.
6. You now see a **Measurement ID** at the top right, format `G-XXXXXXXXXX`.
   - 💾 **SAVE** it as `GA4_ID`.

### B) Google Tag Manager (GTM) — optional

1. Go to: **https://tagmanager.google.com/**
2. Click **Create Account** → name `News Portal` → country → Container name
   `yournews` → platform **Web** → **Create** → accept terms.
3. At the top you see the **Container ID**, format `GTM-XXXXXXX`.
   - 💾 **SAVE** it as `GTM_ID`.

---

# DONE — Send this to your developer

Your `keys.txt` should now contain:

```
DATABASE_URL          = mongodb+srv://portaladmin:...@news-portal.xxxxx.mongodb.net/payload-portal?...
S3_BUCKET             = news-portal-media
S3_ACCESS_KEY_ID      = ...
S3_SECRET_ACCESS_KEY  = ...
S3_ENDPOINT           = https://<accountid>.r2.cloudflarestorage.com
NEXT_PUBLIC_CDN_URL   = https://pub-xxxx.r2.dev
EC2_PUBLIC_IP         = 3.120.xx.xx
EC2_SSH_KEY           = news-portal-key.pem  (attach the file)
GA4_ID                = G-XXXXXXXXXX
GTM_ID                = GTM-XXXXXXX
```

Send `keys.txt` **and** the `.pem` file to your developer **securely** (password
manager or encrypted message — not plain email/chat). They handle the rest.
