<div align="center">
  <a href="https://nitrokit.vercel.app">
    <img alt="Nitrokit Logo" src="https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/nitrokit/nitrokit-emblem.svg" height="250">
  </a>

# Nitrokit

🚀 Modern Next.js boilerplate with TypeScript, authentication, and development automation

<a href="https://app.netlify.com/projects/enitrokit/deploys"><img src="https://api.netlify.com/api/v1/badges/835fe888-01af-45d0-bff1-de2238cc4122/deploy-status" alt="Netlify Status"></a> <a href="https://codecov.io/gh/mustafagenc/nitrokit"><img src="https://codecov.io/gh/mustafagenc/nitrokit/graph/badge.svg?token=LGtgTehbnm" alt="codecov"></a> <a href="https://www.codefactor.io/repository/github/mustafagenc/nitrokit"><img src="https://img.shields.io/codefactor/grade/github/mustafagenc/nitrokit?style=flat" alt="CodeFactor Grade"></a> <a href="https://crowdin.com/project/nitrokit"><img src="https://badges.crowdin.net/nitrokit/localized.svg" alt="Crowdin"></a> <a href="https://opensource.org/licenses/Apache-2.0"><img src="https://img.shields.io/badge/License-Apache%202.0-blue.svg" alt="License: Apache-2.0"></a>

</div>

## ✨ Features

- 🚀 **Next.js 15** with App Router
- 📘 **TypeScript** for type safety
- 🎨 **TailwindCSS** for styling
- 🌍 **Internationalization** with next-intl
- 🔐 **Multi-provider authentication** (Google, GitHub, GitLab, Facebook)
- 🗃️ **Database** with Prisma
- 📧 **Email** with Resend
- 📊 **Analytics** (Google Analytics, Yandex Metrica)
- 🛠️ **Development automation** scripts
- 🧪 **Testing** with Vitest
- 📖 **Storybook** for components

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/mustafagenc/nitrokit.git
cd nitrokit

# Install dependencies
yarn install

# Setup environment
cp .env.example .env.local

# Setup development environment
./scripts/dev_setup.sh

# Start development
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to view your app.

## 📁 Project Structure

```
src/
├── app/                    # Next.js app router
│   ├── [locale]/          # Internationalized routes
│   └── dashboard/         # Protected dashboard
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   └── dashboard/        # Dashboard components
├── lib/                  # Utilities and configurations
├── messages/             # Translation files
└── prisma/              # Database schema

scripts/                     # Development scripts
├── dependency_updater.sh  # Update dependencies
├── dev_setup.sh          # Development setup
└── generate_release_notes.sh # Release notes
```

## 🔧 Environment Setup

Create `.env.local` with the following variables:

### Analytics & SEO

```bash
GOOGLE_SITE_VERIFICATION="your-google-verification"
GOOGLE_ANALYTICS="GA-XXXXXXXXX"
YANDEX_VERIFICATION="your-yandex-verification"
YANDEX_METRICA="your-metrica-id"
```

### Email (Resend)

```bash
RESEND_API_KEY="re_your-api-key"
RESEND_AUDIENCE_ID="your-audience-id"
RESEND_FROM_EMAIL="noreply@yourdomain.com"
```

### Database (Prisma)

```bash
DATABASE_URL="prisma+postgres://accelerate.prisma-data.net/?api_key=xyz"
```

### Authentication (NextAuth.js)

```bash
AUTH_TRUST_HOST=true
AUTH_SECRET="your-secret-key"

# Google OAuth
AUTH_GOOGLE_ID="your-google-client-id"
AUTH_GOOGLE_SECRET="your-google-client-secret"

# GitHub OAuth
AUTH_GITHUB_ID="your-github-client-id"
AUTH_GITHUB_SECRET="your-github-client-secret"

# GitLab OAuth
AUTH_GITLAB_ID="your-gitlab-application-id"
AUTH_GITLAB_SECRET="your-gitlab-secret"

# Facebook OAuth
AUTH_FACEBOOK_ID="your-facebook-app-id"
AUTH_FACEBOOK_SECRET="your-facebook-app-secret"
```

## 🔐 Authentication Setup

Nitrokit supports multiple OAuth providers. Configure them in your respective platforms:

### Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create OAuth 2.0 credentials
3. Add authorized redirect URIs: `http://localhost:3000/api/auth/callback/google`

### GitHub OAuth

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create new OAuth App
3. Authorization callback URL: `http://localhost:3000/api/auth/callback/github`

### GitLab OAuth

1. Go to GitLab Applications settings
2. Create new application
3. Redirect URI: `http://localhost:3000/api/auth/callback/gitlab`

### Facebook OAuth

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create new app and add Facebook Login
3. Valid OAuth Redirect URIs: `http://localhost:3000/api/auth/callback/facebook`

## 🛠️ Development Scripts

### Available Automation Scripts

```bash
# Development environment setup
./scripts/dev_setup.sh

# Update all dependencies
./scripts/dependency_updater.sh

# Generate release notes
./scripts/generate_release_notes.sh
```

### Package Scripts

```bash
yarn dev              # Start development server
yarn build            # Build for production
yarn start            # Start production server
yarn test             # Run tests
yarn lint             # Run ESLint
yarn storybook        # Start Storybook
```

### Database Management

```bash
yarn db:generate      # Generate Prisma client
yarn db:push          # Push schema to database
yarn db:studio        # Open Prisma Studio
yarn db:migrate       # Run migrations
```

## 🌍 Internationalization

Nitrokit uses next-intl for internationalization. Add translations in the `messages/` directory:

```
messages/
├── en.json           # English (default)
├── tr.json           # Turkish
├── de.json           # German
└── ...               # Other languages
```

### Usage in Components

```typescript
import { useTranslations } from 'next-intl';

export function MyComponent() {
  const t = useTranslations('navigation');

  return <h1>{t('title')}</h1>;
}
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push to GitHub
2. Import to [Vercel](https://vercel.com)
3. Set environment variables from `.env.local`
4. Deploy

### Environment Variables for Production

Make sure to set all environment variables in your deployment platform:

- Authentication secrets
- Database URL
- API keys (Resend, analytics)
- OAuth credentials

## 📊 Analytics & Integrations

### Google Analytics

- Automatically integrated when `GOOGLE_ANALYTICS` is set
- Page views and events tracked

### Yandex Metrica

- Russian market analytics
- Set `YANDEX_METRICA` environment variable

## 🧪 Testing

```bash
# Run tests
yarn test

# Run with coverage
yarn test:coverage

# Watch mode
yarn test --watch
```

## 📖 Component Development

Build and document components with Storybook:

```bash
yarn storybook
```

Access at [http://localhost:6006](http://localhost:6006)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/name`
3. Commit changes: `git commit -m 'Add feature'`
4. Push branch: `git push origin feature/name`
5. Open Pull Request

## 📝 License

Licensed under the Apache License 2.0 - see [LICENSE](LICENSE) file.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://mustafagenc.info">Mustafa Genç</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
