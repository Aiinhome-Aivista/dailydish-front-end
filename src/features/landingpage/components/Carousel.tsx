import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CarouselProps {
    children: React.ReactNode[];
    visibleItems?: number; // Number of items visible at once on desktop (default 3)
    autoPlay?: boolean;
    interval?: number;
}

const Carousel: React.FC<CarouselProps> = ({
    children,
    visibleItems = 3,
    autoPlay = true,
    interval = 3000
}) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [isPaused, setIsPaused] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);
    const touchStartX = useRef<number | null>(null);
    const touchEndX = useRef<number | null>(null);

    // Handle resizing to update visible items based on screen size
    useEffect(() => {
        const handleResize = () => {
            setIsMobile(window.innerWidth < 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const itemsToShow = isMobile ? 1 : visibleItems;
    const totalItems = React.Children.count(children);
    const maxIndex = totalItems - itemsToShow;

    const nextSlide = () => {
        // If we are at the end, verify if we should loop
        if (currentIndex < maxIndex) {
            setCurrentIndex((prev) => prev + 1);
        } else {
            setCurrentIndex(0);
        }
    };

    const prevSlide = () => {
        if (currentIndex > 0) {
            setCurrentIndex((prev) => prev - 1);
        } else {
            setCurrentIndex(maxIndex);
        }
    };

    // Auto Play Effect
    useEffect(() => {
        if (!autoPlay || isPaused) return;

        const timer = setInterval(() => {
            nextSlide();
        }, interval);

        return () => clearInterval(timer);
    }, [currentIndex, autoPlay, isPaused, maxIndex, interval]);

    // Touch handlers for swipe support
    const onTouchStart = (e: React.TouchEvent) => {
        setIsPaused(true);
        touchStartX.current = e.targetTouches[0].clientX;
    };

    const onTouchMove = (e: React.TouchEvent) => {
        touchEndX.current = e.targetTouches[0].clientX;
    };

    const onTouchEnd = () => {
        setIsPaused(false);
        if (!touchStartX.current || !touchEndX.current) return;
        const distance = touchStartX.current - touchEndX.current;
        const minSwipeDistance = 50;

        if (distance > minSwipeDistance) {
            nextSlide();
        } else if (distance < -minSwipeDistance) {
            prevSlide();
        }

        touchStartX.current = null;
        touchEndX.current = null;
    };

    return (
        <div
            className="relative group w-full max-w-7xl mx-auto px-4 sm:px-12"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Navigation Buttons (Hidden on mobile if desired, but good for UX) */}
            <button
                onClick={prevSlide}
                className="absolute left-0 top-1/2 -translate-y-1/2 z-10 p-2 text-brand-dark bg-white/80 hover:bg-white rounded-full shadow-lg transition-all focus:outline-none hover:scale-110 disabled:opacity-50 opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Previous slide"
            >
                <ChevronLeft size={24} />
            </button>

            <button
                onClick={nextSlide}
                className="absolute right-0 top-1/2 -translate-y-1/2 z-10 p-2 text-brand-dark bg-white/80 hover:bg-white rounded-full shadow-lg transition-all focus:outline-none hover:scale-110 disabled:opacity-50 opacity-0 group-hover:opacity-100 duration-300"
                aria-label="Next slide"
            >
                <ChevronRight size={24} />
            </button>

            {/* Viewport */}
            <div
                className="overflow-hidden"
                ref={containerRef}
                onTouchStart={onTouchStart}
                onTouchMove={onTouchMove}
                onTouchEnd={onTouchEnd}
            >
                <div
                    className="flex transition-transform duration-500 ease-in-out gap-4 sm:gap-6"
                    style={{
                        transform: `translateX(-${currentIndex * (100 / itemsToShow)}%)`,
                        // We need to account for gap in the width calculation to be perfect,
                        // but a simpler approach for a quick task is adjusting the container or flex basis.
                        // A more robust way with flex gap is often: transform: translateX(calc(-1 * (index * (100% / visible) + index * gap)))
                        // But for simplicity with % width children, let's keep it simple:
                    }}
                >
                    {React.Children.map(children, (child) => (
                        <div
                            className="flex-shrink-0"
                            style={{
                                // Calculate width: (100% - (gap * (visible - 1))) / visible
                                // For simply logic, if we ignore exact pixel gap perfection:
                                width: isMobile ? '100%' : `calc((100% - ${(itemsToShow - 1) * 24}px) / ${itemsToShow})` // assuming 24px gap (6 tailwind units)
                            }}
                        >
                            {child}
                        </div>
                    ))}
                </div>
            </div>

            {/* Pagination dots */}
            <div className="flex justify-center mt-6 gap-2">
                {Array.from({ length: totalItems - itemsToShow + 1 }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-brand-primary w-6' : 'bg-brand-secondary/40 hover:bg-brand-secondary'
                            }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default Carousel;
