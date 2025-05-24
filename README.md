<div align="center">
  <a href="https://nitrokit.vercel.app">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/ekipisi-dark.svg">
      <img alt="Nitrokit Logo" src="https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/ekipisi.svg" height="128">
    </picture>
  </a>
  <h1>Nitrokit Next.js Boilerplate</h1>
  <p>🚀 A modern, production-ready Next.js boilerplate with TypeScript, internationalization, automated translation tools, and comprehensive development automation</p>
</div>

[![Netlify Status](https://api.netlify.com/api/v1/badges/835fe888-01af-45d0-bff1-de2238cc4122/deploy-status)](https://app.netlify.com/projects/enitrokit/deploys) [![codecov](https://codecov.io/gh/mustafagenc/nitrokit/graph/badge.svg?token=LGtgTehbnm)](https://codecov.io/gh/mustafagenc/nitrokit) [![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/mustafagenc/nitrokit?style=flat)](https://www.codefactor.io/repository/github/mustafagenc/nitrokit) [![Crowdin](https://badges.crowdin.net/nitrokit/localized.svg)](https://crowdin.com/project/nitrokit) [![License: Apache-2.0](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

## ✨ Features

- 🚀 **Next.js 15** with App Router and Turbopack
- 📘 **TypeScript** for type safety
- 🎨 **TailwindCSS 4** for modern styling
- 🌍 **Internationalization (i18n)** with 30+ languages
- 🤖 **AI-powered translation** using Gemini API
- 📦 **Automated dependency management** with security scanning
- 🛠️ **One-click development setup** with intelligent automation
- 🗃️ **Prisma** for database management
- 📧 **Email integration** with Resend
- ✅ **Form validation** with Zod
- 🧪 **Testing** with Jest and coverage reports
- 📖 **Storybook** for component development
- 🔍 **ESLint & Prettier** for code quality
- 🐺 **Husky** for git hooks
- ☁️ **Vercel** deployment ready
- 🏷️ **GitHub automation** with label management
- 🔧 **Comprehensive shell scripts** for all development tasks

## 🪄 Tech Stack

| Category        | Technology                                    |
| --------------- | --------------------------------------------- |
| **Framework**   | [Next.js 15](https://nextjs.org/)             |
| **Language**    | [TypeScript](https://www.typescriptlang.org/) |
| **Styling**     | [TailwindCSS 4](https://tailwindcss.com/)     |
| **Database**    | [Prisma](https://prisma.io/)                  |
| **Deployment**  | [Vercel](https://vercel.com/)                 |
| **Email**       | [Resend](https://resend.com/)                 |
| **Validation**  | [Zod](https://zod.dev/)                       |
| **Testing**     | [Jest](https://jestjs.io/)                    |
| **Components**  | [Storybook](https://storybook.js.org/)        |
| **Translation** | [Google Gemini AI](https://ai.google.dev/)    |
| **Automation**  | Custom shell scripts with auto-installation   |

## 🚀 Quick Start

### Automatic Setup (Recommended)

```bash
# Clone the repository
git clone https://github.com/mustafagenc/nitrokit.git

# Navigate to project directory
cd nitrokit

# One-click development setup
./shell/dev-setup.sh
```

The setup script automatically handles:

- 📦 Package manager detection (yarn/pnpm/npm)
- 🗃️ Database setup and Prisma optimization
- 🔧 Environment configuration
- ✅ Health checks and validation

### Manual Setup

```bash
# Install dependencies
yarn install

# Set up database (if using Prisma)
yarn db:generate
yarn db:push

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
nitrokit/
├── app/                     # Next.js app directory
│   ├── [locale]/           # Internationalized routes
│   └── globals.css         # Global styles
├── components/             # React components
│   ├── ui/                # UI components
│   └── layout/            # Layout components
├── lib/                   # Utility functions
├── messages/              # Translation files
│   ├── source.json        # Source translations
│   ├── en.json            # English translations
│   ├── tr.json            # Turkish translations
│   └── ...                # Other languages (30+ supported)
├── prisma/                # Database schema and migrations
│   ├── schema.prisma      # Database schema
│   ├── migrations/        # Migration files
│   └── seed.ts            # Database seeding
├── shell/                 # 🛠️ Automation scripts
│   ├── README.md          # Comprehensive script documentation
│   ├── dev-setup.sh       # 🛠️ One-click development setup
│   ├── dependency_updater.sh  # 📦 Automated package management
│   ├── sync_translations.sh   # 🔄 Basic translation sync
│   ├── sync_translations_gemini.sh  # 🌍 AI-powered translation
│   └── labels.sh          # 🏷️ GitHub label management
├── public/                # Static assets
├── stories/               # Storybook stories
└── .dependency/           # Automated dependency backups
```

## 🔧 Development Automation

Nitrokit includes comprehensive automation scripts for streamlined development:

### 🛠️ Development Setup (`./shell/dev-setup.sh`)

One-click development environment setup with intelligent automation:

```bash
./shell/dev-setup.sh
```

**Features:**

- 🎯 Automatic project structure detection
- 📦 Package manager detection (yarn > pnpm > npm)
- 🗃️ Prisma database setup with optimized client generation
- 🔧 Environment file creation from templates
- ✅ Comprehensive health checks

### 📦 Dependency Management (`./shell/dependency_updater.sh`)

Automated package updates with security scanning and backup support:

```bash
# Preview updates
./shell/dependency_updater.sh --dry-run

# Safe updates with backup
./shell/dependency_updater.sh

# Major version updates
./shell/dependency_updater.sh --update-mode major
```

**Features:**

- 🔍 Multi-package manager support (npm, yarn, pnpm, cargo, go, pip, composer)
- 🛡️ Security vulnerability scanning
- 💾 Automatic backup system with rollback capability
- 🎯 Multiple update strategies (safe, patch, minor, major)

### 🌍 Translation Automation

#### AI-Powered Translation (`./shell/sync_translations_gemini.sh`)

```bash
export GEMINI_API_KEY="your-api-key"
./shell/sync_translations_gemini.sh
```

#### Basic Translation Sync (`./shell/sync_translations.sh`)

```bash
./shell/sync_translations.sh --dry-run  # Preview changes
./shell/sync_translations.sh            # Apply changes
```

### 🏷️ GitHub Management (`./shell/labels.sh`)

Automated GitHub repository label management:

```bash
./shell/labels.sh --dry-run    # Preview label changes
./shell/labels.sh              # Apply labels
```

For detailed documentation on all automation scripts, see the [Shell Scripts Guide](./shell/README.md).

## 🌍 Internationalization

Nitrokit supports 30+ languages with automated translation capabilities:

### Supported Languages

<details>
<summary>View all supported languages (30+ languages)</summary>

| Code | Language   | Code | Language   | Code | Language    |
| ---- | ---------- | ---- | ---------- | ---- | ----------- |
| `en` | English    | `es` | Spanish    | `fr` | French      |
| `de` | German     | `it` | Italian    | `pt` | Portuguese  |
| `ru` | Russian    | `ja` | Japanese   | `ko` | Korean      |
| `zh` | Chinese    | `ar` | Arabic     | `hi` | Hindi       |
| `tr` | Turkish    | `nl` | Dutch      | `sv` | Swedish     |
| `no` | Norwegian  | `da` | Danish     | `fi` | Finnish     |
| `pl` | Polish     | `cs` | Czech      | `hu` | Hungarian   |
| `ro` | Romanian   | `bg` | Bulgarian  | `hr` | Croatian    |
| `sk` | Slovak     | `sl` | Slovenian  | `et` | Estonian    |
| `lv` | Latvian    | `lt` | Lithuanian | `uk` | Ukrainian   |
| `he` | Hebrew     | `th` | Thai       | `vi` | Vietnamese  |
| `id` | Indonesian | `ms` | Malay      | `az` | Azerbaijani |
| `bs` | Bosnian    | `ur` | Urdu       | `uz` | Uzbek       |

</details>

### Adding New Translations

1. Add new keys to `messages/source.json`
2. Run the automated translation:

```bash
# AI-powered translation (recommended)
export GEMINI_API_KEY="your-api-key"
./shell/sync_translations_gemini.sh

# Or basic synchronization
./shell/sync_translations.sh
```

## 🎮 Available Scripts

### Development Scripts

| Script                 | Description                             |
| ---------------------- | --------------------------------------- |
| `yarn dev`             | Start development server with Turbopack |
| `yarn build`           | Build production application            |
| `yarn start`           | Start production server                 |
| `yarn lint`            | Run ESLint                              |
| `yarn lint:fix`        | Fix ESLint issues                       |
| `yarn format:check`    | Check code formatting                   |
| `yarn format:write`    | Format code with Prettier               |
| `yarn test`            | Run tests                               |
| `yarn test:coverage`   | Run tests with coverage                 |
| `yarn storybook`       | Start Storybook                         |
| `yarn build-storybook` | Build Storybook                         |

### Database Scripts

| Script             | Description                     |
| ------------------ | ------------------------------- |
| `yarn db:generate` | Generate Prisma client          |
| `yarn db:push`     | Push schema changes to database |
| `yarn db:migrate`  | Run database migrations         |
| `yarn db:studio`   | Open Prisma Studio              |
| `yarn db:seed`     | Seed database with test data    |

### Automation Scripts

| Script                                | Description                            |
| ------------------------------------- | -------------------------------------- |
| `./shell/dev-setup.sh`                | Complete development environment setup |
| `./shell/dependency_updater.sh`       | Automated dependency management        |
| `./shell/sync_translations.sh`        | Basic translation synchronization      |
| `./shell/sync_translations_gemini.sh` | AI-powered translation automation      |
| `./shell/labels.sh`                   | GitHub label management                |

## 🔧 Configuration

### Environment Variables

Create `.env.local` file in the root directory:

```bash
# Required for AI translations
GEMINI_API_KEY=your-gemini-api-key

# Database configuration
DATABASE_URL=your-database-url

# Email configuration (optional)
RESEND_API_KEY=your-resend-api-key

# Development optimizations
PRISMA_GENERATE_SKIP_DOWNLOAD=true
PRISMA_CLI_QUERY_ENGINE_TYPE=library
```

### Translation Configuration

The translation system supports multiple configuration methods:

```bash
# Environment variables
export GEMINI_API_KEY="your-api-key"
export GEMINI_MODEL="gemini-1.5-flash"

# Command line parameters
./shell/sync_translations_gemini.sh --api-key "your-key" --model "gemini-1.5-pro"

# .env file configuration
GEMINI_API_KEY=your-api-key
GEMINI_MODEL=gemini-1.5-flash
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test --watch

# Run Storybook tests
yarn storybook
```

## 📖 Component Development

### Storybook

```bash
# Start Storybook development server
yarn storybook

# Build Storybook for production
yarn build-storybook
```

### Creating New Components

1. Create component in `components/` directory
2. Add TypeScript definitions
3. Create Storybook story in `stories/`
4. Add tests in `__tests__/`
5. Document usage and props

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard:
    - `GEMINI_API_KEY` (for translations)
    - `DATABASE_URL` (if using database)
    - `RESEND_API_KEY` (for email)
4. Deploy automatically on every push

### Manual Deployment

```bash
# Build the application
yarn build

# Start production server
yarn start
```

### Deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Translations updated
- [ ] Tests passing
- [ ] Build successful
- [ ] Performance optimized

## 🔧 Development Tools

### Code Quality

- **ESLint**: Linting with Next.js recommended rules
- **Prettier**: Code formatting with consistent style
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Static type checking
- **Automated dependency updates**: Security scanning and updates

### Testing & Documentation

- **Jest**: Unit and integration testing with coverage
- **Storybook**: Component documentation and visual testing
- **Codecov**: Test coverage reporting and tracking
- **Automated backup system**: Dependency rollback capability

### Development Automation

- **One-click setup**: Complete development environment in seconds
- **Multi-package manager support**: Works with yarn, pnpm, npm
- **Prisma optimization**: Production-ready database client generation
- **GitHub integration**: Automated label management and workflows

## 🌟 Key Features Explained

### 🤖 AI-Powered Translation System

Nitrokit includes a sophisticated translation automation system:

- **Automatic key detection**: Scans source files for new translation keys
- **30+ language support**: Translates to all major world languages
- **Gemini AI integration**: Uses Google's advanced language models
- **Rate limiting**: Respects API limits with configurable delays
- **Formatting preservation**: Maintains code style with Prettier integration
- **Flexible configuration**: Environment variables, CLI parameters, or .env files

### 🛠️ Development Automation

Comprehensive automation tools for streamlined development:

- **Intelligent setup**: Auto-detects project structure and requirements
- **Package manager agnostic**: Works with any Node.js package manager
- **Database optimization**: Prisma setup with production-optimized configuration
- **Security scanning**: Automated vulnerability detection and reporting
- **Backup system**: Automatic rollback capability for dependency updates

### 🎨 Component Library

- **Reusable UI components**: Built with TailwindCSS and TypeScript
- **Storybook integration**: Interactive component documentation
- **Accessibility focused**: WCAG compliant components
- **Responsive design**: Mobile-first approach
- **Theme support**: Dark/light mode with system preference detection

### 📧 Email Integration

- **Resend integration**: Modern email API with excellent deliverability
- **Type-safe templates**: TypeScript-defined email templates
- **React Email support**: JSX-based email composition
- **Easy customization**: Template system for branded emails

### 🗃️ Database Management

- **Prisma ORM**: Type-safe database access with migration system
- **Multiple database support**: PostgreSQL, MySQL, SQLite, MongoDB
- **Automated setup**: Schema generation and client optimization
- **Development tools**: Prisma Studio for database visualization

## 🔄 Development Workflow

### For New Contributors

```bash
# 1. Clone and setup
git clone https://github.com/mustafagenc/nitrokit.git
cd nitrokit

# 2. One-click setup
./shell/dev-setup.sh

# 3. Start development
yarn dev
```

### Daily Development

```bash
# Update dependencies (weekly)
./shell/dependency_updater.sh --dry-run  # Preview updates
./shell/dependency_updater.sh            # Apply updates

# Sync translations (after adding new keys)
./shell/sync_translations_gemini.sh

# Run tests before committing
yarn test
yarn lint
```

### Repository Maintenance

```bash
# Update GitHub labels (once)
./shell/labels.sh

# Clean old dependency backups (monthly)
./shell/dependency_updater.sh --clean-backups

# Update all translations (when needed)
./shell/sync_translations_gemini.sh --force
```

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup for Contributors

1. **Fork the repository**
2. **Clone your fork**: `git clone https://github.com/your-username/nitrokit.git`
3. **Run setup script**: `./shell/dev-setup.sh`
4. **Create feature branch**: `git checkout -b feature/amazing-feature`
5. **Make your changes**
6. **Run tests**: `yarn test && yarn lint`
7. **Update translations**: `./shell/sync_translations.sh` (if needed)
8. **Commit changes**: `git commit -m 'Add amazing feature'`
9. **Push to branch**: `git push origin feature/amazing-feature`
10. **Open Pull Request**

### Contribution Guidelines

- 📝 **Documentation**: Update README and comments
- 🧪 **Testing**: Add tests for new features
- 🌍 **Translations**: Update translation keys if adding UI text
- 🔧 **Scripts**: Follow automation script conventions
- 📦 **Dependencies**: Use the dependency updater for package changes

## 🔄 Migration from Other Boilerplates

### From Create Next App

1. Copy your components to `components/`
2. Move pages to `app/` directory (App Router)
3. Update imports and configurations
4. Run `./shell/dev-setup.sh` for automatic setup
5. Add translations using the automation scripts

### From Other TypeScript Boilerplates

1. Copy TypeScript configurations
2. Update package.json scripts
3. Migrate components to TailwindCSS
4. Set up internationalization
5. Configure automation scripts

## 📊 Performance & Analytics

### Built-in Optimizations

- **Turbopack**: Faster development builds
- **App Router**: Improved performance and SEO
- **TypeScript**: Compile-time optimizations
- **TailwindCSS**: CSS purging and optimization
- **Prisma**: Optimized database queries

### Monitoring & Analytics

- **Codecov**: Test coverage tracking
- **Vercel Analytics**: Performance monitoring
- **CodeFactor**: Code quality metrics
- **Dependency tracking**: Automated security updates

## 📝 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing React framework
- [Vercel](https://vercel.com/) for hosting, deployment, and development tools
- [Google](https://ai.google.dev/) for Gemini AI translation services
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework
- [Prisma](https://prisma.io/) for the next-generation database toolkit
- [TypeScript](https://www.typescriptlang.org/) for static type checking
- Open source community for inspiration and contributions

## 💬 Support & Community

- 📧 **Email**: [Contact Form](https://mustafagenc.info/contact)
- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/mustafagenc/nitrokit/issues)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/mustafagenc/nitrokit/discussions)
- 🔧 **Feature Requests**: [GitHub Issues](https://github.com/mustafagenc/nitrokit/issues/new?template=feature_request.md)
- 📖 **Documentation**: [Project Wiki](https://github.com/mustafagenc/nitrokit/wiki)
- 🌍 **Translation Help**: [Crowdin Project](https://crowdin.com/project/nitrokit)

### Getting Help

1. **Check the documentation**: Start with this README and [Shell Scripts Guide](./shell/README.md)
2. **Search existing issues**: Someone might have already asked your question
3. **Use the automation scripts**: Many common tasks are automated
4. **Ask in discussions**: For general questions and feature ideas
5. **Open an issue**: For bugs or specific problems

---

<div align="center">
  <p>Made with ❤️ by <a href="https://mustafagenc.info">Mustafa Genç</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
  <p>🚀 Ready to build something amazing? <a href="#-quick-start">Get started now!</a></p>
</div>
