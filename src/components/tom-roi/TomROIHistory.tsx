/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

import React from 'react';
import { useAnalysisHistory } from './history/useAnalysisHistory';
import HistoryHeader from './history/HistoryHeader';
import AnalysisCard from './history/AnalysisCard';
import DeleteConfirmationDialog from './history/DeleteConfirmationDialog';
import EmptyState from './history/EmptyState';
import LoadingState from './history/LoadingState';

const TomROIHistory: React.FC = () => {
  const {
    analyses,
    loading,
    deleteDialogOpen,
    setDeleteDialogOpen,
    handleDelete,
    confirmDelete,
    handleView,
    handleBack
  } = useAnalysisHistory();

  return (
    <div className="space-y-6">
      <HistoryHeader />

      <div className="space-y-4">
        {loading ? (
          <LoadingState />
        ) : analyses.length === 0 ? (
          <EmptyState onCreateNew={handleBack} />
        ) : (
          analyses.map((analysis) => (
            <AnalysisCard
              key={analysis.id}
              analysis={analysis}
              onView={handleView}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>

      <DeleteConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default TomROIHistory;
