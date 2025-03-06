import { motion, AnimatePresence } from "framer-motion";

const transitionVariants = {
  initial: { opacity: 0, x: -100 },
  enter: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 100 },
};
interface TransitionWrapperType {
  children: React.ReactNode;
}
const TransitionWrapper = ({ children }: TransitionWrapperType) => {
  return (
    <AnimatePresence>
      <motion.div
        variants={transitionVariants}
        initial="initial"
        animate="enter"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
};

export default TransitionWrapper;
