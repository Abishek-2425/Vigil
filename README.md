# Vigil

Open-source uptime monitoring for developers and indie makers

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white) ![Vercel](https://img.shields.io/badge/Vercel-000000?style=for-the-badge&logo=vercel&logoColor=white)

---

## What is Vigil

Vigil is an open-source, lightweight uptime monitoring platform built specifically for developers and indie makers. It allows you to monitor websites, web applications, and API endpoints in real-time, receiving instant email alerts the second a service becomes unreachable. With custom dashboards and secure serverless infrastructure, Vigil simplifies status tracking and reliability assurance.

---

## Features

- **Real-Time Uptime Monitoring**: Periodically pings user-defined URLs to verify availability, record HTTP status codes, and measure server response times.
- **Developer Dashboard**: View all your monitors at a glance with live status indicators, current average response times, custom names, and exact uptime percentages.
- **Instant Email Alerts**: Automatically notifies you via Gmail integration (Nodemailer) if a site goes down, and sends a recovery email once it is back online.
- **Incident Tracking**: Records history of downtime incidents in a Supabase database, tracking when monitors went down and when they successfully recovered.
- **Secure Authentication**: Built-in user authentication powered by Supabase Auth with custom Row Level Security (RLS) policies protecting user data.
- **Smart Free Tier Limitation**: Includes a built-in limit of up to 3 monitors per user, making it ideal for indie projects and personal portfolios.

---

## Tech Stack

- **Next.js 16 (App Router)** - Core React framework for fast, server-rendered pages and API endpoints.
- **TypeScript** - Static typing for robust developer experience and type safety.
- **Supabase** - PostgreSQL database with built-in Auth, Row Level Security (RLS), and database client-side/server-side libraries.
- **Tailwind CSS v4** - Dynamic and high-performance utility-first styling.
- **Nodemailer** - SMTP-based email alerts via Gmail App Passwords.
- **Vitest** - Modern test runner for fast, isolated testing.
- **Vercel** - Deployment target supporting serverless functions and configured cron jobs.

---

## Getting Started

### Prerequisites

Ensure you have the following installed and set up locally:
- **Node.js** (v18.0.0 or higher)
- **npm** or another package manager (yarn, pnpm, bun)
- A **Supabase** account and project (for database setup and auth)
- A **Gmail** account with an **App Password** generated (for SMTP email alerts)

### Local Setup

1. **Clone the repository:**
   ```bash
   git clone https://github.com/Abishek-2425/vigil.git
   cd vigil
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Configure Environment Variables:**
   Create a `.env.local` file in the root directory of the project and populate it with your local credentials (refer to the **Environment Variables** section below).

4. **Prepare the Database:**
   Follow the instructions under the **Database Setup** section below to create the schema and configure RLS policies.

5. **Run the Development Server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to inspect the application.

6. **Run Test Suites:**
   Verify configuration and code correctness by running the tests:
   ```bash
   npm run test
   ```

---

## Environment Variables

The project utilizes the following environment variables inside your `.env.local` file:

| Variable | Description |
| :--- | :--- |
| `NEXT_PUBLIC_SUPABASE_URL` | The public API URL of your Supabase project (e.g., `https://your-project.supabase.co`). |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | The client-side anonymous public API key for your Supabase project. |
| `SUPABASE_SERVICE_ROLE_KEY` | The private service role key for Supabase, used on server-side API endpoints to bypass RLS. |
| `CRON_SECRET` | A secret token string of your choice, used to authenticate scheduled requests to `/api/cron`. |
| `GMAIL_USER` | The Gmail address that will act as the sender for all system uptime and recovery email alerts. |
| `GMAIL_APP_PASSWORD` | The secure 16-character Gmail App Password generated from your Google Account settings for SMTP. |

---

## Database Setup

Vigil uses a Supabase PostgreSQL database to store monitors, performance checks, and incidents. All database security is enforced at the database level using Row Level Security (RLS) policies.

To set up the database tables, relations, and RLS policies:
1. Go to your Supabase project dashboard.
2. Open the **SQL Editor**.
3. Copy the entire contents of the [schema.sql](file:///d:/PROJECTS/vigil/schema.sql) file in this repository.
4. Paste it into the editor and click **Run**.

The schema script will automatically:
- Enable the necessary `uuid-ossp` database extension.
- Create the tables: `monitors`, `checks`, and `incidents`.
- Configure strict Row Level Security (RLS) policies so users can only access their own monitors, checks, and incidents.
- Create optimized query indexes (`idx_monitors_user_id`, `idx_checks_monitor_checked_at`, `idx_incidents_monitor_resolved`).

---

## How It Works

- **Scheduled Cron Trigger**: A scheduled cron job (configured via `vercel.json` to run every 5 minutes) triggers a GET request to `/api/cron`.
- **Endpoint Authorization**: The endpoint authenticates incoming requests by checking for a `Bearer ${CRON_SECRET}` header to prevent unauthorized triggers.
- **Parallel Ping Execution**: Active monitors are fetched from the database, and their target URLs are pinged in parallel using `AbortSignal.timeout(10000)` to ensure checks finish within 10 seconds.
- **Incident Detection & Tracking**: For each check, the system compares the result with the monitor's previous status:
  - **Down Incident**: If the previous status was *up* and the new status is *down*, a new record is inserted into the `incidents` table and a "down" alert email is sent to the user.
  - **Recovery Incident**: If the previous status was *down* and the new status is *up*, the open incident is resolved, updating `is_resolved` to true with the resolution timestamp, and a recovery email is sent.
- **Nodemailer SMTP Delivery**: Alerts are dispatched using Nodemailer via Gmail's SMTP service securely authenticated by a Gmail App Password.

---

## Contributing

We welcome contributions of all kinds! Whether you want to fix bugs, add new features, or improve the documentation, please feel free to fork the repository, make your changes, and open a Pull Request. If you have questions or suggestions, feel free to open an issue to discuss it.

---

## License

This project is licensed under the MIT License.

