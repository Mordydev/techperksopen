import { motion, HTMLMotionProps } from "framer-motion";
import * as React from "react";

interface OverlayProps extends HTMLMotionProps<"div"> {
  isVisible: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ isVisible, className, children, ...props }) => {
  return (
    <motion.div
      className={className}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        zIndex: 40,
        display: isVisible ? "block" : "none",
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default Overlay;
