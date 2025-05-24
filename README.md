<div align="center">
  <a href="https://nitrokit.vercel.app">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/ekipisi-dark.svg">
      <img alt="Nitrokit Logo" src="https://raw.githubusercontent.com/mustafagenc/nitrokit/refs/heads/main/public/logo/ekipisi.svg" height="128">
    </picture>
  </a>
  <h1>Nitrokit Next.js Boilerplate</h1>
  <p>🚀 A modern, production-ready Next.js boilerplate with TypeScript, internationalization, and automated translation tools</p>
</div>

[![Netlify Status](https://api.netlify.com/api/v1/badges/835fe888-01af-45d0-bff1-de2238cc4122/deploy-status)](https://app.netlify.com/projects/enitrokit/deploys) [![codecov](https://codecov.io/gh/mustafagenc/nitrokit/graph/badge.svg?token=LGtgTehbnm)](https://codecov.io/gh/mustafagenc/nitrokit) [![CodeFactor Grade](https://img.shields.io/codefactor/grade/github/mustafagenc/nitrokit?style=flat)](https://www.codefactor.io/repository/github/mustafagenc/nitrokit) [![Crowdin](https://badges.crowdin.net/nitrokit/localized.svg)](https://crowdin.com/project/nitrokit) [![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## ✨ Features

- 🚀 **Next.js 15** with App Router
- 📘 **TypeScript** for type safety
- 🎨 **TailwindCSS** for styling
- 🌍 **Internationalization (i18n)** with 30+ languages
- 🤖 **AI-powered translation** using Gemini API
- 📧 **Email integration** with Resend
- ✅ **Form validation** with Zod
- 🧪 **Testing** with Jest
- 📖 **Storybook** for component development
- 🔍 **ESLint & Prettier** for code quality
- 🐺 **Husky** for git hooks
- ☁️ **Vercel** deployment ready

## 🪄 Tech Stack

| Category        | Technology                                    |
| --------------- | --------------------------------------------- |
| **Framework**   | [Next.js 15](https://nextjs.org/)             |
| **Language**    | [TypeScript](https://www.typescriptlang.org/) |
| **Styling**     | [TailwindCSS](https://tailwindcss.com/)       |
| **Deployment**  | [Vercel](https://vercel.com/)                 |
| **Email**       | [Resend](https://resend.com/)                 |
| **Validation**  | [Zod](https://zod.dev/)                       |
| **Testing**     | [Jest](https://jestjs.io/)                    |
| **Components**  | [Storybook](https://storybook.js.org/)        |
| **Translation** | [Google Gemini AI](https://ai.google.dev/)    |

## 🚀 Quick Start

```bash
# Clone the repository
git clone https://github.com/mustafagenc/nitrokit.git

# Navigate to project directory
cd nitrokit

# Install dependencies
yarn install

# Start development server
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) to see your application.

## 📁 Project Structure

```
nitrokit/
├── app/                 # Next.js app directory
│   ├── [locale]/       # Internationalized routes
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── ui/            # UI components
│   └── layout/        # Layout components
├── lib/               # Utility functions
├── messages/          # Translation files
│   ├── source.json    # Source translations
│   ├── en.json        # English translations
│   ├── tr.json        # Turkish translations
│   └── ...            # Other languages
├── shell/             # Shell scripts
│   └── sync_translations_gemini.sh
├── public/            # Static assets
└── stories/           # Storybook stories
```

## 🌍 Internationalization

Nitrokit supports 30+ languages with automated translation capabilities:

### Supported Languages

<details>
<summary>View all supported languages</summary>

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
2. Run the translation script:

```bash
# Set your Gemini API key
export GEMINI_API_KEY="your-api-key"

# Run translation script
cd shell
./sync_translations_gemini.sh
```

For detailed translation setup, see our [Translation Guide](./shell/README.md).

## 🎮 Available Scripts

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

## 🔧 Configuration

### Environment Variables

Create `.env.local` file in the root directory:

```bash
# Required for translations
GEMINI_API_KEY=your-gemini-api-key

# Email configuration (optional)
RESEND_API_KEY=your-resend-api-key

# Database (if using)
DATABASE_URL=your-database-url
```

### Translation Configuration

```bash
# In shell/sync_translations_gemini.sh
GEMINI_MODEL="gemini-1.5-flash"  # or "gemini-1.5-pro"
TRANSLATION_DELAY=1              # seconds between requests
```

## 🧪 Testing

```bash
# Run all tests
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test --watch
```

## 📖 Storybook

```bash
# Start Storybook development server
yarn storybook

# Build Storybook for production
yarn build-storybook
```

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to [Vercel](https://vercel.com)
3. Set environment variables in Vercel dashboard
4. Deploy automatically on every push

### Manual Deployment

```bash
# Build the application
yarn build

# Start production server
yarn start
```

## 🔧 Development Tools

### Code Quality

- **ESLint**: Linting with Next.js recommended rules
- **Prettier**: Code formatting
- **Husky**: Git hooks for pre-commit checks
- **TypeScript**: Static type checking

### Testing & Documentation

- **Jest**: Unit and integration testing
- **Storybook**: Component documentation and testing
- **Codecov**: Test coverage reporting

## 🌟 Key Features Explained

### 🤖 AI-Powered Translation

Nitrokit includes a powerful translation automation system:

- Automatically detects new translation keys
- Translates to 30+ languages using Google Gemini AI
- Maintains consistent formatting with Prettier
- Configurable models and rate limiting

### 🎨 Component Library

- Reusable UI components built with TailwindCSS
- Documented in Storybook
- TypeScript definitions included
- Responsive and accessible design

### 📧 Email Integration

- Pre-configured with Resend
- Type-safe email templates
- Easy to customize and extend

## 🤝 Contributing

We welcome contributions! Please read our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes
4. Run tests: `yarn test`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js Team](https://nextjs.org/) for the amazing framework
- [Vercel](https://vercel.com/) for hosting and deployment
- [Google](https://ai.google.dev/) for Gemini AI translation services
- [TailwindCSS](https://tailwindcss.com/) for the utility-first CSS framework

## 💬 Support

- 📧 Email: [Contact Form](https://mustafagenc.info/contact)
- 🐛 Issues: [GitHub Issues](https://github.com/mustafagenc/nitrokit/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/mustafagenc/nitrokit/discussions)

---

<div align="center">
  <p>Made with ❤️ by <a href="https://mustafagenc.info">Mustafa Genç</a></p>
  <p>⭐ Star this repository if you find it helpful!</p>
</div>
