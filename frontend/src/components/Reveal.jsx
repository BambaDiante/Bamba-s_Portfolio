import { useEffect, useRef, useState } from 'react';

const DIRECTIONS = {
    up: 'translateY(28px)',
    down: 'translateY(-28px)',
    left: 'translateX(-32px)',
    right: 'translateX(32px)',
    zoom: 'scale(0.94)',
    none: 'none'
};

/**
 * Enveloppe n'importe quel bloc pour lui ajouter un effet d'apparition
 * au defilement (fade + mouvement), via IntersectionObserver.
 * Aucun CSS externe requis : tout est gere en inline style.
 *
 * Usage :
 *   <Reveal>{...}</Reveal>
 *   <Reveal as="article" direction="zoom" delay={index * 100}>{...}</Reveal>
 *   <Reveal className="ma-classe" direction="left">{...}</Reveal>
 */
function Reveal({
    children,
    delay = 0,
    duration = 700,
    direction = 'up',
    threshold = 0.15,
    className = '',
    as: Tag = 'div',
    once = true
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const node = ref.current;
        if (!node) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) observer.unobserve(node);
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold, rootMargin: '0px 0px -10% 0px' }
        );

        observer.observe(node);
        return () => observer.disconnect();
    }, [once, threshold]);

    const style = {
        opacity: visible ? 1 : 0,
        transform: visible ? 'none' : (DIRECTIONS[direction] ?? DIRECTIONS.up),
        transition: `opacity ${duration}ms ease ${delay}ms, transform ${duration}ms ease ${delay}ms`,
        willChange: 'opacity, transform'
    };

    return (
        <Tag ref={ref} className={className || undefined} style={style}>
            {children}
        </Tag>
    );
}

export default Reveal;
