
import React from 'react';
import TomROIAnalyzer from '@/components/tom-roi/TomROIAnalyzer';
import { motion } from 'framer-motion';

const RoiShortTermPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <TomROIAnalyzer />
    </motion.div>
  );
};

export default RoiShortTermPage;
