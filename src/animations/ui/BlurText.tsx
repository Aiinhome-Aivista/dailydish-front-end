import React, { useRef, useEffect, useState } from 'react';
import { motion, useInView, type Variants } from 'framer-motion';

interface BlurTextProps {
    text?: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
    threshold?: number;
    rootMargin?: string;
    animationFrom?: any;
    animationTo?: any;
    easing?: string | number[];
    onAnimationComplete?: () => void;
    start?: boolean;
    as?: React.ElementType;
    itemClassName?: string;
    initialDelay?: number;
}

const BlurText: React.FC<BlurTextProps> = ({
    text = '',
    delay = 0.1,
    initialDelay = 0,
    className = '',
    itemClassName = '',
    animateBy = 'words',
    direction = 'top',
    threshold = 0.1,
    rootMargin = '0px',
    animationFrom,
    animationTo,
    easing = [0.22, 1, 0.36, 1],
    onAnimationComplete,
    start = true,
    as: Component = 'p',
}) => {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const ref = useRef<any>(null);
    const isInView = useInView(ref, { once: true, amount: threshold, margin: rootMargin as any });
    const [shouldAnimate, setShouldAnimate] = useState(false);

    const actualDelay = delay >= 10 ? delay / 1000 : delay;
    const actualInitialDelay = initialDelay >= 10 ? initialDelay / 1000 : initialDelay;

    useEffect(() => {
        if (start || isInView) {
            setShouldAnimate(true);
        }
    }, [start, isInView]);

    const defaultFrom = animationFrom || {
        filter: 'blur(10px)',
        opacity: 0,
        y: direction === 'top' ? -50 : 50,
    };

    const defaultTo = animationTo || {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
    };

    const containerVariants: Variants = {
        hidden: {},
        visible: {
            transition: {
                staggerChildren: actualDelay,
                delayChildren: actualInitialDelay,
            },
        },
    };

    const itemVariants: Variants = {
        hidden: defaultFrom,
        visible: {
            ...defaultTo,
            transition: {
                duration: 0.8,
                ease: easing,
            },
        },
    };

    const MotionComponent = React.useMemo(() => motion.create(Component), [Component]);

    return (
        <MotionComponent
            ref={ref}
            variants={containerVariants}
            initial="hidden"
            animate={shouldAnimate ? "visible" : "hidden"}
            onAnimationComplete={onAnimationComplete}
            className={`blur-text ${className} flex flex-wrap justify-center overflow-visible`}
        >
            {elements.map((item, index) => (
                <motion.span
                    key={index}
                    variants={itemVariants}
                    className={`inline-block whitespace-pre will-change-[transform,filter,opacity] ${itemClassName}`}
                >
                    {item === ' ' ? '\u00A0' : item}
                    {animateBy === 'words' && index < elements.length - 1 && '\u00A0'}
                </motion.span>
            ))}
        </MotionComponent>
    );
};

export default BlurText;
