import React from 'react';
import { motion } from 'framer-motion';

interface RollingTextButtonProps {
  children: React.ReactNode;
  href?: string;
  onClick?: (e: React.MouseEvent) => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'orange' | 'dark' | 'ghost';
  type?: 'button' | 'submit' | 'reset';
  disabled?: boolean;
  ariaLabel?: string;
}

export const RollingTextButton: React.FC<RollingTextButtonProps> = ({
  children,
  href,
  onClick,
  className = '',
  variant = 'primary',
  type = 'button',
  disabled = false,
  ariaLabel,
}) => {
  const variantStyles: Record<NonNullable<RollingTextButtonProps['variant']>, string> = {
    primary: 'bg-[#ff4500] text-white border border-transparent hover:border-[#ff4500]/50',
    secondary: 'bg-[#ffffff] text-[#0b0b0b] border border-transparent hover:bg-neutral-100',
    orange: 'bg-[#ff4500] text-white border border-transparent hover:bg-[#e63e00]',
    dark: 'bg-[#0b0b0b] text-white border border-white/15 hover:border-white/30',
    ghost: 'bg-transparent text-white border border-white/20 hover:bg-white/10',
  };

  const innerContent = (
    <motion.div
      className="relative overflow-hidden h-5 flex items-center justify-center pointer-events-none select-none"
      initial="rest"
      whileHover="hover"
    >
      <motion.span
        variants={{
          rest: { y: 0 },
          hover: { y: '-120%' },
        }}
        transition={{
          type: 'spring',
          damping: 17,
          stiffness: 160,
          mass: 0.3,
        }}
        className="block whitespace-nowrap"
      >
        {children}
      </motion.span>
      <motion.span
        variants={{
          rest: { y: '120%' },
          hover: { y: 0 },
        }}
        transition={{
          type: 'spring',
          damping: 17,
          stiffness: 160,
          mass: 0.3,
        }}
        aria-hidden="true"
        className="block absolute inset-0 flex items-center justify-center whitespace-nowrap"
      >
        {children}
      </motion.span>
    </motion.div>
  );

  const combinedClasses = `inline-flex items-center justify-center px-5 py-2.5 text-xs font-medium tracking-wide uppercase transition-colors rounded-none cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${className}`;

  if (href) {
    return (
      <motion.a
        href={href}
        onClick={onClick}
        aria-label={ariaLabel}
        whileHover={{ scale: 0.985 }}
        whileTap={{ scale: 0.965 }}
        transition={{ type: 'spring', damping: 17, stiffness: 170 }}
        className={combinedClasses}
      >
        {innerContent}
      </motion.a>
    );
  }

  return (
    <motion.button
      type={type}
      disabled={disabled}
      onClick={onClick}
      aria-label={ariaLabel}
      whileHover={disabled ? undefined : { scale: 0.985 }}
      whileTap={disabled ? undefined : { scale: 0.965 }}
      transition={{ type: 'spring', damping: 17, stiffness: 170 }}
      className={combinedClasses}
    >
      {innerContent}
    </motion.button>
  );
};
