export const testimonials = [
    {
        id: '1',
        content: 'NitroKit ile projemi 3 hafta yerine 3 günde tamamladım. İnanılmaz hızlandırma!',
        author: {
            name: 'Ayşe Kaya',
            title: 'Full Stack Developer',
            company: 'TechStart',
            avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b619?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '2',
        content:
            'En kapsamlı Next.js boilerplate. Authentication, dashboard, admin paneli her şey hazır.',
        author: {
            name: 'Mehmet Özkan',
            title: 'Senior Developer',
            company: 'DevStudio',
            avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '3',
        content: 'TypeScript, Tailwind, Prisma entegrasyonu mükemmel. Kod kalitesi çok yüksek.',
        author: {
            name: 'Zeynep Demir',
            title: 'Frontend Developer',
            company: 'PixelCraft',
            avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '4',
        content: 'Multi-language desteği ve modern UI componentleri ile zahmetsiz geliştirme.',
        author: {
            name: 'Can Yılmaz',
            title: 'Tech Lead',
            company: 'WebFlow',
            avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '5',
        content: 'E-ticaret sitemi NitroKit ile kurduktan sonra geliştirme sürecim %80 hızlandı.',
        author: {
            name: 'Selin Arslan',
            title: 'E-commerce Developer',
            company: 'ShopTech',
            avatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '6',
        content:
            "Dashboard tasarımları ve admin paneli template'leri harika. Hemen kullanıma hazır.",
        author: {
            name: 'Burak Kocaman',
            title: 'Product Manager',
            company: 'StartupCo',
            avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '7',
        content:
            'Authentication sistemi ve user management özellikleri çok gelişmiş. Güvenlik öncelikli.',
        author: {
            name: 'Deniz Şahin',
            title: 'Backend Developer',
            company: 'SecureApp',
            avatar: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '8',
        content: 'Responsive tasarım ve dark mode desteği kusursuz. Mobile-first yaklaşım harika.',
        author: {
            name: 'Emre Çelik',
            title: 'UI/UX Developer',
            company: 'DesignLab',
            avatar: 'https://images.unsplash.com/photo-1519345182560-3f2917c472ef?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '9',
        content: 'Ticket sistemi ve admin filtreleri profesyonel projelerde kullanmaya uygun.',
        author: {
            name: 'Fatma Özdemir',
            title: 'Project Manager',
            company: 'AgileTeam',
            avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
    {
        id: '10',
        content: 'Next.js 14 App Router ile modern geliştirme standartları. Performans mükemmel.',
        author: {
            name: 'Oğuz Kaan',
            title: 'Full Stack Engineer',
            company: 'TechFlow',
            avatar: 'https://images.unsplash.com/photo-1463453091185-61582044d556?w=100&h=100&fit=crop&crop=face',
        },
        rating: 5,
    },
];

export const faqData = [
    {
        id: '1',
        question: 'NitroKit nedir ve ne işe yarar?',
        shortAnswer:
            "NitroKit, Next.js tabanlı modern web uygulamdetailedAnsweraları geliştirmek için hazırlanmış kapsamlı bir starter kit'tir.",
        category: 'Genel',
        tags: ['starter-kit', 'next.js', 'typescript'],
        isPopular: true,
        hasDetailPage: true,
    },
    {
        id: '2',
        question: 'Hangi teknolojiler kullanılıyor?',
        shortAnswer:
            'Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, NextAuth.js ve daha birçok modern teknoloji.',
        category: 'Teknik',
        tags: ['teknoloji', 'stack', 'framework'],
        isPopular: true,
        hasDetailPage: true,
    },
    {
        id: '3',
        question: 'Ücretsiz mi yoksa ücretli mi?',
        shortAnswer:
            "NitroKit'in temel sürümü tamamen ücretsizdir ve MIT lisansı ile sunulmaktadır.",
        category: 'Fiyatlandırma',
        tags: ['fiyat', 'ücretsiz', 'premium'],
        isPopular: true,
        hasDetailPage: true,
    },
    {
        id: '4',
        question: 'Nasıl kurulum yaparım?',
        shortAnswer:
            "GitHub repository'sini clone edin, bağımlılıkları yükleyin ve environment değişkenlerini ayarlayın.",
        category: 'Kurulum',
        tags: ['kurulum', 'setup', 'başlangıç'],
        hasDetailPage: true,
    },
    {
        id: '5',
        question: 'Veritabanı desteği var mı?',
        shortAnswer: 'Prisma ORM kullanarak PostgreSQL, MySQL, SQLite ve MongoDB desteği sunar.',
        category: 'Veritabanı',
        tags: ['prisma', 'database', 'postgresql', 'mysql'],
        hasDetailPage: true,
    },
    {
        id: '6',
        question: 'Authentication sistemi nasıl çalışıyor?',
        shortAnswer:
            "NextAuth.js kullanarak OAuth provider'ları ve geleneksel email/password girişini destekler.",
        category: 'Authentication',
        tags: ['auth', 'login', 'oauth', 'nextauth'],
        hasDetailPage: true,
    },
    {
        id: '7',
        question: 'Responsive tasarım var mı?',
        shortAnswer:
            'Tüm componentler mobile-first yaklaşımı ile tasarlanmış ve her ekran boyutunda mükemmel görünüm sağlar.',
        category: 'UI/UX',
        tags: ['responsive', 'mobile', 'tailwind'],
        hasDetailPage: false,
    },
    {
        id: '8',
        question: 'Dark mode desteği var mı?',
        shortAnswer: 'next-themes paketi kullanılarak tam dark mode desteği mevcuttur.',
        category: 'UI/UX',
        tags: ['dark-mode', 'theme', 'ui'],
        hasDetailPage: false,
    },
    {
        id: '9',
        question: 'Multi-language (i18n) desteği var mı?',
        shortAnswer:
            'next-intl paketi kullanılarak çoklu dil desteği mevcuttur. Türkçe ve İngilizce hazır olarak gelir.',
        category: 'Özellikler',
        tags: ['i18n', 'multi-language', 'türkçe', 'ingilizce'],
        hasDetailPage: true,
    },
    {
        id: '10',
        question: "Production'a nasıl deploy ederim?",
        shortAnswer: 'Vercel, Netlify, Railway gibi platformlarda kolayca deploy edilebilir.',
        category: 'Deployment',
        tags: ['deploy', 'vercel', 'production', 'docker'],
        hasDetailPage: true,
    },
    {
        id: '11',
        question: "Component library'si var mı?",
        shortAnswer:
            "shadcn/ui tabanlı kapsamlı component library'si ile 50+ hazır component bulunur.",
        category: 'UI/UX',
        tags: ['components', 'shadcn', 'ui-library'],
        hasDetailPage: false,
    },
    {
        id: '12',
        question: 'API routes nasıl çalışıyor?',
        shortAnswer:
            "Next.js App Router'ın route handlers'ı kullanılır. RESTful API endpoints hazır olarak gelir.",
        category: 'API',
        tags: ['api', 'routes', 'backend', 'endpoints'],
        hasDetailPage: true,
    },
    {
        id: '13',
        question: 'Form yönetimi nasıl yapılıyor?',
        shortAnswer: 'React Hook Form ve Zod validation ile modern form yönetimi sağlanır.',
        category: 'Teknik',
        tags: ['form', 'validation', 'react-hook-form', 'zod'],
        hasDetailPage: false,
    },
    {
        id: '14',
        question: 'SEO optimizasyonu nasıl?',
        shortAnswer: 'Next.js metadata API ile kapsamlı SEO desteği ve otomatik optimizasyon.',
        category: 'SEO',
        tags: ['seo', 'metadata', 'optimization'],
        hasDetailPage: true,
    },
    {
        id: '15',
        question: 'Performans optimizasyonu var mı?',
        shortAnswer:
            'Image optimization, code splitting, lazy loading gibi performans özelliklerini içerir.',
        category: 'Performance',
        tags: ['performance', 'optimization', 'speed'],
        hasDetailPage: false,
    },
    {
        id: '16',
        question: 'Testing desteği var mı?',
        shortAnswer: 'Jest, React Testing Library ve Playwright ile kapsamlı test altyapısı.',
        category: 'Testing',
        tags: ['testing', 'jest', 'playwright'],
        hasDetailPage: true,
    },
    {
        id: '17',
        question: 'Error handling nasıl yapılıyor?',
        shortAnswer: "Global error boundary'ler ve error sayfaları ile profesyonel hata yönetimi.",
        category: 'Teknik',
        tags: ['error-handling', 'boundary', 'debugging'],
        hasDetailPage: false,
    },
    {
        id: '18',
        question: 'Admin paneli var mı?',
        shortAnswer:
            "Kapsamlı admin dashboard'u kullanıcı, rol ve content yönetimi ile birlikte gelir.",
        category: 'Admin',
        tags: ['admin', 'dashboard', 'management'],
        hasDetailPage: true,
    },
    {
        id: '19',
        question: 'E-ticaret özellikleri var mı?',
        shortAnswer:
            'Ürün yönetimi, sepet, ödeme entegrasyonu ve sipariş takibi özellikleri bulunur.',
        category: 'E-ticaret',
        tags: ['ecommerce', 'payment', 'cart', 'products'],
        hasDetailPage: true,
    },
    {
        id: '20',
        question: 'Güvenlik önlemleri neler?',
        shortAnswer: 'CSRF koruması, rate limiting, input validation ve güvenli authentication.',
        category: 'Güvenlik',
        tags: ['security', 'csrf', 'validation'],
        hasDetailPage: true,
    },
];

export const faqDetailData = [
    {
        id: '1',
        question: 'NitroKit nedir ve ne işe yarar?',
        shortAnswer:
            "NitroKit, Next.js tabanlı modern web uygulamaları geliştirmek için hazırlanmış kapsamlı bir starter kit'tir.",
        category: 'Genel',
        tags: ['starter-kit', 'next.js', 'typescript'],
        isPopular: true,
        lastUpdated: '15 Aralık 2024',
        readTime: 5,
        viewCount: 1247,
        likes: 89,
        commentCount: 12,
        detailedAnswer: `# NitroKit Nedir?

NitroKit, modern web uygulaması geliştirme sürecini hızlandırmak için tasarlanmış kapsamlı bir Next.js starter kitidir.

## Temel Amaç

NitroKitin ana amacı, geliştiricilerin tekrarlayan görevlerle uğraşmak yerine, iş mantığına odaklanmalarını sağlamaktır.

## Temel Özellikler

- Next.js 14 App Router: En güncel Next.js özelliklerini kullanır
- TypeScript: Tip güvenliği ve daha iyi geliştirici deneyimi
- Tailwind CSS: Utility-first CSS framework
- Component Library: shadcn/ui tabanlı hazır componentler
- Authentication: NextAuth.js ile güvenli kimlik doğrulama
- Database: Prisma ORM ile veritabanı yönetimi

## Kimler İçin Uygun?

**Bireysel Geliştiriciler için:**
- Freelance projelerde hızlı başlangıç
- Portfolyo projelerinde profesyonel görünüm
- Kişisel blog ve websiteler

**Startuplar için:**
- MVP geliştirme süreci
- Hızlı prototipleme
- Yatırımcı sunumları için demo

## Avantajları

**Zaman Tasarrufu:**
- Yüzde 70e varan geliştirme süresi azalması
- Hazır component library
- Önceden yapılandırılmış tools

**Kod Kalitesi:**
- Industry best practices
- Type-safe development
- Automated testing setup`,
        relatedFAQs: [
            {
                id: '2',
                question: 'Hangi teknolojiler kullanılıyor?',
                shortAnswer:
                    'Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, NextAuth.js ve daha birçok modern teknoloji.',
                category: 'Teknik',
                readTime: 5,
                viewCount: 892,
            },
        ],
    },
    {
        id: '2',
        question: 'Hangi teknolojiler kullanılıyor?',
        shortAnswer:
            'Next.js 14, TypeScript, Tailwind CSS, Prisma ORM, NextAuth.js ve daha birçok modern teknoloji.',
        category: 'Teknik',
        tags: ['teknoloji', 'stack', 'framework'],
        isPopular: true,
        lastUpdated: '12 Aralık 2024',
        readTime: 8,
        viewCount: 892,
        likes: 67,
        commentCount: 8,
        detailedAnswer: `# Teknoloji Stack Detayları

NitroKit, modern web geliştirme için en güncel ve performanslı teknolojileri kullanır.

## Frontend Teknolojileri

**Next.js 14 (App Router)**
- Server Components desteği
- Nested layouts
- Route groups
- Built-in SEO optimization

**React 18**
- Concurrent features
- Suspense boundaries
- Server-side rendering
- Client-side hydration

**TypeScript 5.0+**
- Advanced type inference
- Template literal types
- Conditional types
- Utility types

**Tailwind CSS 3.4**
- JIT compiler
- Custom design system
- Responsive utilities
- Dark mode support

## Backend ve Database

**Prisma ORM**
- Type-safe database client
- Auto-generated types
- Migration system
- Query optimization

**Database Options:**
- PostgreSQL (Recommended)
- MySQL/MariaDB
- SQLite (Development)
- MongoDB (Document store)

**NextAuth.js v5**
- OAuth providers (Google, GitHub, Discord)
- Email/password authentication
- Magic link login
- JWT and session handling

## Development Tools

**Code Quality:**
- ESLint with custom rules
- Prettier configuration
- Husky git hooks
- Commitlint

**Build Tools:**
- Webpack 5 optimization
- SWC compiler
- Bundle analyzer
- Tree shaking`,
        relatedFAQs: [
            {
                id: '1',
                question: 'NitroKit nedir ve ne işe yarar?',
                shortAnswer:
                    'NitroKit, Next.js tabanlı modern web uygulamaları geliştirmek için hazırlanmış kapsamlı bir starter kitidir.',
                category: 'Genel',
                readTime: 5,
                viewCount: 1247,
            },
        ],
    },
    {
        id: '3',
        question: 'Ücretsiz mi yoksa ücretli mi?',
        shortAnswer:
            'NitroKitin temel sürümü tamamen ücretsizdir ve MIT lisansı ile sunulmaktadır.',
        category: 'Fiyatlandırma',
        tags: ['fiyat', 'ücretsiz', 'premium'],
        isPopular: true,
        lastUpdated: '10 Aralık 2024',
        readTime: 6,
        viewCount: 2156,
        likes: 143,
        commentCount: 27,
        detailedAnswer: `# NitroKit Fiyatlandırma Modeli

NitroKit, açık kaynak felsefesi ile geliştirilmiş ve farklı ihtiyaçlara yönelik esnek bir fiyatlandırma modeli sunar.

## Ücretsiz Sürüm (MIT License)

**Temel Özellikler:**
- Tam kaynak kodu erişimi
- Ticari kullanım hakkı
- Sınırsız proje kullanımı
- Community desteği
- GitHub repository erişimi

**Dahil Olan Özellikler:**
- Next.js 14 starter template
- Authentication sistemi
- Basic UI components
- Database integration
- Deployment guides

## Premium Sürüm (49 dolar/proje)

**Gelişmiş Özellikler:**
- Advanced dashboard templates
- E-commerce modules
- Advanced authentication
- Premium UI components
- Email notifications

**Bonus İçerikler:**
- Video tutorials
- 1-on-1 setup support
- Priority issue resolution
- Custom component requests

## Enterprise Sürüm (299 dolar/yıl)

**Kurumsal Özellikler:**
- Multi-tenant architecture
- Advanced security features
- Custom integrations
- White-label options

**Destek Hizmetleri:**
- Dedicated support channel
- Custom development
- Training sessions
- Code reviews`,
        relatedFAQs: [
            {
                id: '1',
                question: 'NitroKit nedir ve ne işe yarar?',
                shortAnswer:
                    'NitroKit, Next.js tabanlı modern web uygulamaları geliştirmek için hazırlanmış kapsamlı bir starter kitidir.',
                category: 'Genel',
                readTime: 5,
                viewCount: 1247,
            },
        ],
    },
];
