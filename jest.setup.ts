// jest.setup.ts
import '@testing-library/jest-dom';

// ResizeObserver mock
global.ResizeObserver = jest.fn().mockImplementation(() => ({
    observe: jest.fn(),
    unobserve: jest.fn(),
    disconnect: jest.fn(),
}));

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
        matches: false,
        media: query,
        onchange: null,
        addListener: jest.fn(),
        removeListener: jest.fn(),
        addEventListener: jest.fn(),
        removeEventListener: jest.fn(),
        dispatchEvent: jest.fn(),
    })),
});

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter() {
        return {
            push: jest.fn(),
            replace: jest.fn(),
            prefetch: jest.fn(),
            back: jest.fn(),
            pathname: '/',
            query: {},
        };
    },
    useSearchParams() {
        return new URLSearchParams();
    },
    usePathname() {
        return '/';
    },
}));

// Mock next-intl
jest.mock('next-intl', () => ({
    useTranslations: () => (key: string) => key,
    useLocale: () => 'en',
}));

// NextAuth Mock - Bu kısmı ekleyin
jest.mock('next-auth', () => ({
    __esModule: true,
    default: jest.fn(() => ({
        handlers: {
            GET: jest.fn(),
            POST: jest.fn(),
        },
    })),
    getServerSession: jest.fn(),
}));

// NextAuth Providers Mock
jest.mock('next-auth/providers/google', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
}));

jest.mock('next-auth/providers/github', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
}));

jest.mock('next-auth/providers/facebook', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
}));

jest.mock('next-auth/providers/instagram', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
}));

jest.mock('next-auth/providers/credentials', () => ({
    __esModule: true,
    default: jest.fn(() => ({})),
}));

// Auth Library Mock
jest.mock('@/lib/auth', () => ({
    __esModule: true,
    auth: jest.fn(() => Promise.resolve(null)),
    signIn: jest.fn(),
    signOut: jest.fn(),
    handlers: {
        GET: jest.fn(),
        POST: jest.fn(),
    },
}));

jest.mock('@/lib/auth/server', () => ({
    getSession: jest.fn(() => Promise.resolve(null)),
    getUserById: jest.fn(() => Promise.resolve(null)),
}));

// Prisma Mock
jest.mock('@/lib/prisma', () => ({
    prisma: {
        user: {
            findUnique: jest.fn(),
            findFirst: jest.fn(),
            create: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        },
        // Diğer modeller...
    },
}));

// BCrypt Mock
jest.mock('bcryptjs', () => ({
    hash: jest.fn(() => Promise.resolve('hashedPassword')),
    compare: jest.fn(() => Promise.resolve(true)),
}));
