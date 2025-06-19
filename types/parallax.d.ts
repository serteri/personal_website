declare module 'react-scroll-parallax' {
    export interface ParallaxProps {
        children?: ReactNode;
        className?: string;
        translateX?: [number, number];
        translateY?: [number, number];
        scale?: [number, number];
        rotate?: [number, number];
        opacity?: [number, number];
        easing?: string;
        startScroll?: number;
        endScroll?: number;
        speed?: number;
    }
}