
import { Variants } from "framer-motion";

export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: { duration: 0.5 }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const slideUp: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 30,
      duration: 0.5
    }
  },
  exit: { 
    y: 20, 
    opacity: 0,
    transition: { duration: 0.3 }
  }
};

export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export const cardHover = {
  rest: { scale: 1, boxShadow: "0px 4px 20px rgba(0, 0, 0, 0.05)" },
  hover: { 
    scale: 1.02, 
    boxShadow: "0px 8px 30px rgba(0, 0, 0, 0.1)",
    transition: { duration: 0.3, ease: "easeOut" }
  }
};

export const buttonTap = {
  rest: { scale: 1 },
  tap: { scale: 0.98 }
};
