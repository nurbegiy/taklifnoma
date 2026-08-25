import { motion } from 'framer-motion';

export default function Reveal({ children, delay = 0, y = 28, className = '', as = 'div' }) {
  const Motion = motion[as] || motion.div;
  return (
    <Motion
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </Motion>
  );
}
