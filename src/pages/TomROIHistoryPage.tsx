
import React from 'react';
import { motion } from 'framer-motion';
import TomROIHistory from '@/components/tom-roi/TomROIHistory';

const TomROIHistoryPage: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white to-blue-50"
    >
      <TomROIHistory />
    </motion.div>
  );
};

export default TomROIHistoryPage;
