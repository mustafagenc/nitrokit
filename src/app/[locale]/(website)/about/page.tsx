import { Metadata } from 'next';
import { Users, Target, Award, Heart, Globe, Zap, Shield, TrendingUp } from 'lucide-react';

import { generatePageMetadata } from '@/lib';
import PageHero from '@/components/shared/page-hero';
import CtaSection from '@/components/shared/cta-section';

export async function generateMetadata(): Promise<Metadata> {
    return await generatePageMetadata({
        params: Promise.resolve({
            title: 'About Us - Your Company Name',
            description:
                'Learn more about our mission, vision, and the team behind our innovative solutions.',
        }),
    });
}

export default async function Page() {
    const ctaButtons = [
        {
            href: '/contact',
            label: 'Contact Us',
            variant: 'primary' as const,
        },
        {
            href: '/projects',
            label: 'View Our Work',
            variant: 'secondary' as const,
        },
    ];
    return (
        <div>
            <div className="w-full px-4 lg:mx-auto lg:w-7xl lg:p-0">
                <PageHero
                    h1="About Our Company"
                    h2="About"
                    p="We're passionate about creating innovative solutions tha t differenceke
                        a differenceke a difference world."
                />
                <div className="flex items-center justify-center space-x-6">
                    <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                            10+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Years Experience
                        </div>
                    </div>
                    <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                            500+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Happy Clients
                        </div>
                    </div>
                    <div className="h-12 w-px bg-gray-300 dark:bg-gray-600"></div>
                    <div className="text-center">
                        <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                            1000+
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                            Projects Completed
                        </div>
                    </div>
                </div>

                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="grid gap-12 lg:grid-cols-2 lg:gap-20">
                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900">
                                        <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Our Mission
                                    </h2>
                                </div>
                                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                    To empower businesses and individuals with cutting-edge
                                    technology solutions that drive innovation, efficiency, and
                                    growth in an ever-evolving digital landscape.
                                </p>
                                <ul className="space-y-3">
                                    <li className="flex items-start space-x-3">
                                        <Zap className="mt-1 h-5 w-5 flex-shrink-0 text-yellow-500" />
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Deliver high-performance solutions that exceed
                                            expectations
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <Shield className="mt-1 h-5 w-5 flex-shrink-0 text-green-500" />
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Ensure security and reliability in every product we
                                            build
                                        </span>
                                    </li>
                                    <li className="flex items-start space-x-3">
                                        <Globe className="mt-1 h-5 w-5 flex-shrink-0 text-blue-500" />
                                        <span className="text-gray-600 dark:text-gray-300">
                                            Create sustainable impact on a global scale
                                        </span>
                                    </li>
                                </ul>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center space-x-3">
                                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 dark:bg-purple-900">
                                        <TrendingUp className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        Our Vision
                                    </h2>
                                </div>
                                <p className="text-lg leading-relaxed text-gray-600 dark:text-gray-300">
                                    To become the leading technology partner for organizations
                                    worldwide, known for our innovation, excellence, and commitment
                                    to creating a better digital future.
                                </p>
                                <div className="rounded-lg bg-gray-50 p-6 dark:bg-gray-800">
                                    <h3 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
                                        2024 Goals
                                    </h3>
                                    <div className="space-y-3">
                                        <div className="flex items-center justify-between">
                                            <span className="text-gray-600 dark:text-gray-300">
                                                Global Expansion
                                            </span>
                                            <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                                                75%
                                            </span>
                                        </div>
                                        <div className="h-2 rounded-full bg-gray-200 dark:bg-gray-700">
                                            <div
                                                className="h-2 rounded-full bg-blue-600"
                                                style={{ width: '75%' }}
                                            ></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                                Our Core Values
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                The principles that guide our decisions and shape our culture every
                                day.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
                            <div className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-600 group-hover:text-white dark:bg-blue-900">
                                    <Heart className="h-6 w-6 text-blue-600 group-hover:text-white dark:text-blue-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    Customer First
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    We put our customers at the center of everything we do, ensuring
                                    their success is our success.
                                </p>
                            </div>

                            <div className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-600 group-hover:text-white dark:bg-green-900">
                                    <Shield className="h-6 w-6 text-green-600 group-hover:text-white dark:text-green-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    Integrity
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    We maintain the highest ethical standards and transparency in
                                    all our business practices.
                                </p>
                            </div>

                            <div className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-purple-100 transition-colors group-hover:bg-purple-600 group-hover:text-white dark:bg-purple-900">
                                    <Zap className="h-6 w-6 text-purple-600 group-hover:text-white dark:text-purple-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    Innovation
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    We constantly push boundaries and embrace new technologies to
                                    stay ahead of the curve.
                                </p>
                            </div>

                            <div className="group rounded-lg bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:bg-gray-800">
                                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-orange-100 transition-colors group-hover:bg-orange-600 group-hover:text-white dark:bg-orange-900">
                                    <Award className="h-6 w-6 text-orange-600 group-hover:text-white dark:text-orange-400" />
                                </div>
                                <h3 className="mb-2 text-xl font-semibold text-gray-900 dark:text-white">
                                    Excellence
                                </h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    We strive for perfection in every project and continuously
                                    improve our processes.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>

                <section className="py-16 lg:py-24">
                    <div className="container mx-auto px-4">
                        <div className="mx-auto mb-16 max-w-3xl text-center">
                            <h2 className="mb-4 text-3xl font-bold text-gray-900 sm:text-4xl dark:text-white">
                                Meet Our Team
                            </h2>
                            <p className="text-lg text-gray-600 dark:text-gray-300">
                                The talented individuals who make our vision a reality.
                            </p>
                        </div>

                        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                            {/* Team Member 1 */}
                            <div className="group text-center">
                                <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-blue-400 to-purple-600">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Users className="h-16 w-16 text-white" />
                                    </div>
                                </div>
                                <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                                    John Smith
                                </h3>
                                <p className="mb-3 text-blue-600 dark:text-blue-400">
                                    CEO & Founder
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Visionary leader with 15+ years of experience in technology and
                                    business strategy.
                                </p>
                            </div>

                            {/* Team Member 2 */}
                            <div className="group text-center">
                                <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-green-400 to-blue-600">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Users className="h-16 w-16 text-white" />
                                    </div>
                                </div>
                                <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                                    Sarah Johnson
                                </h3>
                                <p className="mb-3 text-green-600 dark:text-green-400">CTO</p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Technical expert leading our engineering team with expertise in
                                    cloud architecture and AI.
                                </p>
                            </div>

                            {/* Team Member 3 */}
                            <div className="group text-center">
                                <div className="relative mx-auto mb-6 h-32 w-32 overflow-hidden rounded-full bg-gradient-to-br from-purple-400 to-pink-600">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Users className="h-16 w-16 text-white" />
                                    </div>
                                </div>
                                <h3 className="mb-1 text-xl font-semibold text-gray-900 dark:text-white">
                                    Mike Chen
                                </h3>
                                <p className="mb-3 text-purple-600 dark:text-purple-400">
                                    Design Lead
                                </p>
                                <p className="text-sm text-gray-600 dark:text-gray-300">
                                    Creative director ensuring exceptional user experiences across
                                    all our products.
                                </p>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            <CtaSection
                title="Ready to Work Together?"
                description="Let's discuss how we can help bring your vision to life."
                buttons={ctaButtons}
                variant="gradient"
            />
        </div>
    );
}
