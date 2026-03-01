"use client";
import { motion } from "motion/react";
import { useInView } from "react-intersection-observer";

/**
 * MotionWrapper - Simple component untuk viewport animations
 * Automatically smooth, no manual timing needed
 */
export function MotionWrapper({
  children,
  animation = "fadeInUp",
  delay = 0,
  duration = 0.6,
  className = "",
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true, // Animate only once
  });

  // Predefined animation variants
  const animations = {
    fadeInUp: {
      initial: { opacity: 0, y: 20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInDown: {
      initial: { opacity: 0, y: -20 },
      animate: { opacity: 1, y: 0 },
    },
    fadeInLeft: {
      initial: { opacity: 0, x: -20 },
      animate: { opacity: 1, x: 0 },
    },
    fadeInRight: {
      initial: { opacity: 0, x: 20 },
      animate: { opacity: 1, x: 0 },
    },
    slideInUp: {
      initial: { opacity: 0, y: 40 },
      animate: { opacity: 1, y: 0 },
    },
    slideInDown: {
      initial: { opacity: 0, y: -40 },
      animate: { opacity: 1, y: 0 },
    },
    slideInLeft: {
      initial: { opacity: 0, x: -60 },
      animate: { opacity: 1, x: 0 },
    },
    slideInRight: {
      initial: { opacity: 0, x: 60 },
      animate: { opacity: 1, x: 0 },
    },
    zoomIn: {
      initial: { opacity: 0, scale: 0.8 },
      animate: { opacity: 1, scale: 1 },
    },
    scaleIn: {
      initial: { opacity: 0, scale: 0.9 },
      animate: { opacity: 1, scale: 1 },
    },
    popIn: {
      initial: { opacity: 0, scale: 0 },
      animate: { opacity: 1, scale: 1 },
    },
    bounceIn: {
      initial: { opacity: 0, scale: 0.3 },
      animate: { opacity: 1, scale: 1 },
    },
    rotateIn: {
      initial: { opacity: 0, rotate: -20 },
      animate: { opacity: 1, rotate: 0 },
    },
    flipIn: {
      initial: { opacity: 0, rotateY: 90 },
      animate: { opacity: 1, rotateY: 0 },
    },
  };

  const animVar = animations[animation] || animations.fadeInUp;

  return (
    <motion.div
      ref={ref}
      initial={animVar.initial}
      animate={inView ? animVar.animate : animVar.initial}
      transition={{
        duration: duration,
        delay: delay,
        ease: "easeOut",
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/**
 * StaggerContainer - Container untuk stagger animations
 * Useful untuk grid/list items
 */
export function StaggerContainer({
  children,
  staggerDelay = 0.4,
  animation = "slideInUp",
  className = "",
}) {
  const { ref, inView } = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: staggerDelay,
      },
    },
  };

  const itemVariants = {
    fadeInUp: {
      hidden: { opacity: 0, y: 20 },
      visible: { opacity: 1, y: 0 },
    },
    zoomIn: {
      hidden: { opacity: 0, scale: 0.8 },
      visible: { opacity: 1, scale: 1 },
    },
    popIn: {
      hidden: { opacity: 0, scale: 0 },
      visible: { opacity: 1, scale: 1 },
    },
    slideInUp: {
      hidden: { opacity: 0, y: 40 },
      visible: { opacity: 1, y: 0 },
    },
  };

  const item = itemVariants[animation] || itemVariants.fadeInUp;

  return (
      <motion.div
      ref={ref}
      variants={containerVariants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
    >
    <div className={className}>
      {Array.isArray(children) ? (
        children.map((child, i) => (
          <motion.div key={i} variants={item}>
            {child}
          </motion.div>
        ))
      ) : (
        <motion.div variants={item}>{children}</motion.div>
      )}
    </div>
    </motion.div>
  );
}

/**
 * Scroll reveal - Simple whileInView animation
 */
export function ScrollReveal({
  children,
  animation = { opacity: [0, 1], y: [40, 0] },
  duration = 0.8,
  className = "",
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: duration, ease: "easeOut" }}
      viewport={{ once: true, amount: 0.3 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}