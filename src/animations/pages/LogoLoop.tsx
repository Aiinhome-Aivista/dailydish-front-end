import React, { type ReactNode } from 'react';
import { motion } from 'framer-motion';

interface LogoLoopProps {
    items: (string | ReactNode)[];
    direction?: 'left' | 'right' | 'up' | 'down';
    speed?: number;
    width?: string | number;
    height?: string | number;
    logoHeight?: string | number;
    gap?: number;
    fadeOut?: boolean;
    fadeOutColor?: string;
    scaleOnHover?: boolean;
    ariaLabel?: string;
    enableMarquee?: boolean;
    renderItem?: (item: string | ReactNode, index: number) => ReactNode;
}

const LogoLoop: React.FC<LogoLoopProps> = ({
    items,
    direction = 'left',
    speed = 50,
    width = '100%',
    height = 'auto',
    logoHeight = 40,
    gap = 40,
    fadeOut = false,
    fadeOutColor = 'white',
    scaleOnHover = true,
    ariaLabel = 'Logo Loop',
    enableMarquee = false,
    renderItem,
}) => {
    const isHorizontal = direction === 'left' || direction === 'right';
    const multiplier = direction === 'left' || direction === 'up' ? -1 : 1;

    const containerStyle: React.CSSProperties = {
        width,
        height,
        overflow: enableMarquee ? 'hidden' : 'visible',
        position: 'relative',
        display: 'flex',
        flexDirection: isHorizontal ? 'row' : 'column',
        justifyContent: 'center',
        alignItems: 'center',
        ...(fadeOut && enableMarquee && {
            WebkitMaskImage: isHorizontal
                ? `linear-gradient(to right, transparent, black 10%, black 90%, transparent)`
                : `linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
            maskImage: isHorizontal
                ? `linear-gradient(to right, transparent, black 10%, black 90%, transparent)`
                : `linear-gradient(to bottom, transparent, black 10%, black 90%, transparent)`,
        }),
        backgroundColor: (fadeOut && enableMarquee) ? fadeOutColor : 'transparent',
    };

    const totalSize = items.length * (Number(logoHeight) + gap);
    const animateValue = multiplier * totalSize;
    const duration = totalSize / speed;

    return (
        <div style={containerStyle} aria-label={ariaLabel}>
            <motion.div
                className="flex items-center justify-center"
                style={{
                    display: 'flex',
                    flexDirection: isHorizontal ? 'row' : 'column',
                    gap: `${gap}px`,
                }}
                animate={enableMarquee ? {
                    [isHorizontal ? 'x' : 'y']: [0, animateValue],
                } : {}}
                transition={enableMarquee ? {
                    [isHorizontal ? 'x' : 'y']: {
                        repeat: Infinity,
                        repeatType: 'loop',
                        duration: duration,
                        ease: 'linear',
                    },
                } : {}}
            >
                {items.map((item, index) => (
                    <motion.div
                        key={index}
                        style={{
                            height: logoHeight,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}
                        whileHover={scaleOnHover ? { scale: 1.1 } : {}}
                    >
                        {renderItem ? (
                            renderItem(item, index)
                        ) : typeof item === 'string' ? (
                            <img src={item} alt="" style={{ height: '100%', width: 'auto' }} />
                        ) : (
                            item
                        )}
                    </motion.div>
                ))}
            </motion.div>
        </div>
    );
};

export default LogoLoop;
