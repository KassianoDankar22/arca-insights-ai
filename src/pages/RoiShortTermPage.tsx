
import React from 'react';
import RoiCalculator from '@/components/RoiCalculator';
import { motion } from 'framer-motion';

const RoiShortTermPage = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <RoiCalculator />
    </motion.div>
  );
};

export default RoiShortTermPage;
