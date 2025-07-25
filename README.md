# Cloud Storage - A Next.js Web Application

![Cloud Storage](./public/storage.png)

A modern, full-featured cloud storage web application built with Next.js, Prisma, and S3-compatible object storage. It provides a clean user interface for managing files and folders, secure authentication, and a flexible architecture.

## ✨ Features

-   **📁 File & Folder Management**: Upload, download, delete, and organize files and folders.
-   **🔒 Secure Authentication**: Standard email/password registration and login, plus Google OAuth.
-   **💾 S3 Integration**: Uses any S3-compatible object storage for robust and scalable file storage.
-   **👤 User Accounts**: Each user has their own dedicated storage space.
-   **💳 Tiered Pricing & Promocodes**: Built-in support for different storage plans and promotional codes.
-   **🔗 Sharable Links**: Generate unique links to share files with others.
-   **📱 Responsive Design**: A clean and modern UI that works on all devices.
-   **⚡ Built with Performance in Mind**: Leverages Next.js and Turbopack for a fast user experience.

## 🛠️ Tech Stack

-   **Framework**: [Next.js](https://nextjs.org/)
-   **Language**: [TypeScript](https://www.typescriptlang.org/)
-   **ORM**: [Prisma](https://www.prisma.io/)
-   **Database**: PostgreSQL (recommended), but any Prisma-supported database will work.
-   **Authentication**: [NextAuth.js](https://next-auth.js.org/)
-   **File Storage**: AWS S3 or any S3-compatible service (e.g., MinIO, Cloudflare R2).
-   **Styling**: [Tailwind CSS](https://tailwindcss.com/) & [Material UI](https://mui.com/)
-   **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/)
-   **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 🚀 Getting Started

Follow these instructions to get the project up and running on your local machine for development and testing purposes.

### Prerequisites

-   [Node.js](https://nodejs.org/en/) (v20.x or later recommended)
-   [npm](https://www.npmjs.com/) or another package manager (yarn, pnpm)
-   A running PostgreSQL database (or other DB of your choice)
-   Access to an S3-compatible object storage bucket

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/your-username/cloud-storage.git
    cd cloud-storage
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Set up environment variables:**
    Create a `.env` file in the root of the project by copying the example file:
    ```bash
    cp .env.example .env
    ```
    Now, open `.env` and fill in the required values.

    ```env
    # Prisma - Database Connection
    # Example for PostgreSQL
    DATABASE_URL="postgresql://USER:PASSWORD@HOST:PORT/DATABASE?schema=public"

    # NextAuth.js - Authentication
    # Generate a secret with: openssl rand -base64 32
    NEXTAUTH_SECRET=
    NEXTAUTH_URL=http://localhost:3000
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=

    # Custom JWT Tokens
    JWT_SECRET= # Can be the same as NEXTAUTH_SECRET

    # AWS S3 - Object Storage
    S3_BUCKET_NAME=
    S3_ACCESS_KEY=
    S3_SECRET_KEY=
    # Optional: Specify region and endpoint if not using AWS S3
    # S3_REGION=
    # S3_ENDPOINT=
    ```

4.  **Apply database migrations:**
    This will sync your database schema with the Prisma schema definition.
    ```bash
    npx prisma migrate dev
    ```

5.  **Run the development server:**
    The application uses Turbopack for a faster development experience.
    ```bash
    npm run dev
    ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📂 Project Structure

The project follows a feature-sliced design approach to keep the codebase organized and scalable.

```
/
├── prisma/           # Prisma schema and migrations
├── public/           # Static assets (images, fonts)
└── src/
    ├── app/          # Next.js App Router: pages, routes, layouts
    ├── entities/     # Business entities (e.g., File, User models and state)
    ├── features/     # (Not used, but for future) Pieces of business logic (e.g., BuySubscription)
    ├── pages/        # (Not used, legacy) Next.js Pages Router
    ├── shared/       # Reusable code, libs, UI components, config
    └── widgets/      # Compositional UI blocks (e.g., Header, StorageGrid)
```