
import React from 'react';
import TomRoiAnalyzer from '@/components/tom-roi/TomRoiAnalyzer';
import { motion } from 'framer-motion';

const RoiShortTermPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TomRoiAnalyzer />
    </motion.div>
  );
};

export default RoiShortTermPage;
