'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Star } from 'lucide-react';

interface Testimonial {
    id: string;
    content: string;
    author: {
        name: string;
        title: string;
        company: string;
        avatar: string;
    };
    rating: number;
}

interface TestimonialsProps {
    title?: string;
    subtitle?: string;
    description?: string;
    testimonials: Testimonial[];
}

export function Testimonials({
    title = 'Testimonials',
    subtitle = 'Binlerce Kullanıcı Tarafından Seviliyor',
    description = "NitroKit'in neden bu kadar sevildiğini keşfedin ve bugün katılarak işiniz için dönüştürücü gücünü deneyimleyin.",
    testimonials,
}: TestimonialsProps) {
    // Testimonials'ı iki gruba böl
    const firstRow = testimonials.slice(0, Math.ceil(testimonials.length / 2));
    const secondRow = testimonials.slice(Math.ceil(testimonials.length / 2));

    const TestimonialCard = ({ testimonial }: { testimonial: Testimonial }) => {
        const initials = testimonial.author.name
            .split(' ')
            .map((n) => n[0])
            .join('')
            .toUpperCase();

        return (
            <div className="border-border/50 mx-1.5 w-[350px] flex-shrink-0 rounded-xl border bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm transition-shadow duration-300 hover:shadow-md dark:from-blue-900/15 dark:to-indigo-900/15">
                {/* Rating Stars */}
                <div className="mb-3 flex items-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Star
                            key={i}
                            className={`h-4 w-4 ${
                                i < testimonial.rating
                                    ? 'fill-yellow-400 text-yellow-400'
                                    : 'text-gray-300'
                            }`}
                        />
                    ))}
                </div>

                {/* Content */}
                <p className="text-muted-foreground mb-4 leading-relaxed font-medium">
                    &quot;{testimonial.content}&quot;
                </p>

                {/* Author */}
                <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                        <AvatarImage
                            src={testimonial.author.avatar}
                            alt={testimonial.author.name}
                        />
                        <AvatarFallback className="bg-primary/10 text-primary font-semibold">
                            {initials}
                        </AvatarFallback>
                    </Avatar>
                    <div>
                        <div className="text-foreground font-semibold">
                            {testimonial.author.name}
                        </div>
                        <div className="text-muted-foreground text-sm">
                            {testimonial.author.title}, {testimonial.author.company}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <section className="relative overflow-hidden py-24">
            {/* Background Pattern */}
            <div className="absolute inset-0">
                {/* Main Gradient Background */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 dark:from-slate-950 dark:via-blue-950/20 dark:to-indigo-950/30"></div>

                {/* Dotted Pattern */}
                <div
                    className="absolute inset-0 opacity-40"
                    style={{
                        backgroundImage:
                            'radial-gradient(circle at 1px 1px, rgb(148 163 184 / 0.3) 1px, transparent 0)',
                        backgroundSize: '24px 24px',
                    }}
                ></div>

                {/* Floating Shapes */}
                <div className="absolute top-20 left-10 h-32 w-32 rounded-full bg-gradient-to-r from-blue-200/30 to-purple-200/30 blur-xl dark:from-blue-800/20 dark:to-purple-800/20"></div>
                <div className="absolute top-32 right-16 h-24 w-24 rounded-full bg-gradient-to-r from-indigo-200/40 to-cyan-200/40 blur-lg dark:from-indigo-800/25 dark:to-cyan-800/25"></div>
                <div className="absolute bottom-20 left-1/4 h-28 w-28 rounded-full bg-gradient-to-r from-purple-200/35 to-pink-200/35 blur-xl dark:from-purple-800/20 dark:to-pink-800/20"></div>
                <div className="absolute right-1/3 bottom-32 h-20 w-20 rounded-full bg-gradient-to-r from-cyan-200/30 to-blue-200/30 blur-lg dark:from-cyan-800/20 dark:to-blue-800/20"></div>

                {/* Geometric Lines */}
                <svg
                    className="absolute top-0 left-0 h-full w-full"
                    viewBox="0 0 1200 800"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <defs>
                        <linearGradient id="line1" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="rgb(59 130 246 / 0.1)" />
                            <stop offset="100%" stopColor="rgb(147 51 234 / 0.1)" />
                        </linearGradient>
                        <linearGradient id="line2" x1="0%" y1="100%" x2="100%" y2="0%">
                            <stop offset="0%" stopColor="rgb(16 185 129 / 0.1)" />
                            <stop offset="100%" stopColor="rgb(59 130 246 / 0.1)" />
                        </linearGradient>
                    </defs>
                    <path
                        d="M0 200 Q300 100 600 150 T1200 100"
                        stroke="url(#line1)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.6"
                    />
                    <path
                        d="M0 600 Q400 500 800 550 T1200 500"
                        stroke="url(#line2)"
                        strokeWidth="2"
                        fill="none"
                        opacity="0.4"
                    />
                </svg>

                {/* Mesh Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent dark:via-black/5"></div>
            </div>

            {/* Content */}
            <div className="relative z-10">
                {/* Header */}
                <div className="container mx-auto mb-16 px-6 lg:px-12">
                    <div className="mb-16 flex flex-col items-center justify-center gap-5 text-center">
                        <div className="text-primary border-primary mb-1.5 border-b-2 py-1 font-semibold">
                            {title}
                        </div>
                        <h2 className="text-foreground text-3xl font-bold md:text-5xl">
                            {subtitle}
                        </h2>
                        <p className="text-muted-foreground mx-auto max-w-2xl text-lg md:text-xl">
                            {description}
                        </p>
                    </div>
                </div>

                {/* Marquee Container */}
                <div className="mx-auto w-full px-6">
                    <div className="relative mx-auto flex w-full flex-col items-center justify-center gap-1.5 overflow-hidden">
                        {/* First Row - Sola Gidiyor (Normal Direction) */}
                        <div className="group flex grow flex-row overflow-hidden p-2 [--gap:1rem]">
                            {/* First set */}
                            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite] flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
                                {firstRow.map((testimonial) => (
                                    <TestimonialCard
                                        key={`first-1-${testimonial.id}`}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </div>
                            {/* Duplicate for seamless loop */}
                            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite] flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
                                {firstRow.map((testimonial) => (
                                    <TestimonialCard
                                        key={`first-2-${testimonial.id}`}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </div>
                            {/* Third set for extra smoothness */}
                            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite] flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
                                {firstRow.map((testimonial) => (
                                    <TestimonialCard
                                        key={`first-3-${testimonial.id}`}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Second Row - Sağa Gidiyor (Reverse Direction) */}
                        <div className="group flex grow flex-row overflow-hidden p-2 [--gap:1rem]">
                            {/* First set */}
                            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite_reverse] flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
                                {secondRow.map((testimonial) => (
                                    <TestimonialCard
                                        key={`second-1-${testimonial.id}`}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </div>
                            {/* Duplicate for seamless loop */}
                            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite_reverse] flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
                                {secondRow.map((testimonial) => (
                                    <TestimonialCard
                                        key={`second-2-${testimonial.id}`}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </div>
                            {/* Third set for extra smoothness */}
                            <div className="flex shrink-0 animate-[marquee_40s_linear_infinite_reverse] flex-row justify-around [gap:var(--gap)] group-hover:[animation-play-state:paused]">
                                {secondRow.map((testimonial) => (
                                    <TestimonialCard
                                        key={`second-3-${testimonial.id}`}
                                        testimonial={testimonial}
                                    />
                                ))}
                            </div>
                        </div>

                        {/* Gradient overlays */}
                        <div className="pointer-events-none absolute inset-y-0 start-0 w-1/12 bg-gradient-to-r from-white dark:from-[#111113]"></div>
                        <div className="pointer-events-none absolute inset-y-0 end-0 w-1/12 bg-gradient-to-l from-white dark:from-[#111113]"></div>
                    </div>
                </div>
            </div>
        </section>
    );
}
