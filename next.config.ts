import { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const nextConfig: NextConfig = {
    trailingSlash: true,
    experimental: {
        optimizeCss: {
            optimizeCss: true,
        },
    },
    serverExternalPackages: [
        'nodemailer',
        '@sendgrid/mail',
        '@sendgrid/helpers',
        'resend',
        '@aws-sdk/client-ses',
        'postmark',
    ],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: '*',
                port: '',
                pathname: '/**',
            },
        ],
    },
    async rewrites() {
        return [
            {
                source: '/storybook/:path*',
                destination: '/storybook-static/:path*',
            },
        ];
    },
    webpack: (config, { isServer, webpack }) => {
        if (!isServer) {
            config.resolve.fallback = {
                ...config.resolve.fallback,
                child_process: false,
                fs: false,
                path: false,
                crypto: require.resolve('crypto-browserify'),
                buffer: require.resolve('buffer'),
                stream: require.resolve('stream-browserify'),
                'stream/promises': false,
                os: false,
                net: false,
                tls: false,
                dns: false,
                module: false,
                perf_hooks: false,
                util: false,
                url: false,
                zlib: false,
                http: false,
                https: false,
                assert: false,
                constants: false,
                vm: false,
                querystring: false,
            };

            config.plugins.push(
                new webpack.ProvidePlugin({
                    Buffer: ['buffer', 'Buffer'],
                    process: 'process/browser',
                })
            );

            config.externals = config.externals || [];
            config.externals.push({
                '@sendgrid/mail': 'commonjs @sendgrid/mail',
                '@sendgrid/helpers': 'commonjs @sendgrid/helpers',
                nodemailer: 'commonjs nodemailer',
                resend: 'commonjs resend',
                '@aws-sdk/client-ses': 'commonjs @aws-sdk/client-ses',
                postmark: 'commonjs postmark',
            });
        }

        return config;
    },
    async headers() {
        return [
            {
                source: '/(.*)',
                headers: [
                    {
                        key: 'X-Content-Type-Options',
                        value: 'nosniff',
                    },
                    {
                        key: 'X-Frame-Options',
                        value: 'DENY',
                    },
                    {
                        key: 'Referrer-Policy',
                        value: 'strict-origin-when-cross-origin',
                    },
                ],
            },
            {
                source: '/sw.js',
                headers: [
                    {
                        key: 'Content-Type',
                        value: 'application/javascript; charset=utf-8',
                    },
                    {
                        key: 'Cache-Control',
                        value: 'no-cache, no-store, must-revalidate',
                    },
                    {
                        key: 'Content-Security-Policy',
                        value: "default-src 'self'; script-src 'self'",
                    },
                ],
            },
        ];
    },
};

const withNextIntl = createNextIntlPlugin('./src/lib/i18n/request.ts');
export default withNextIntl(nextConfig);
