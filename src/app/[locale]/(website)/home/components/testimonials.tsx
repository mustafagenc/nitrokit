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
        <section className="overflow-hidden py-24">
            {/* Header */}
            <div className="container mx-auto mb-16 px-6 lg:px-12">
                <div className="mb-16 flex flex-col items-center justify-center gap-5 text-center">
                    <div className="text-primary border-primary mb-1.5 border-b-2 py-1 font-semibold">
                        {title}
                    </div>
                    <h2 className="text-foreground text-3xl font-bold md:text-5xl">{subtitle}</h2>
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
        </section>
    );
}
