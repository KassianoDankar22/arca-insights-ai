
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface EmptyStateProps {
  onCreateNew: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onCreateNew }) => {
  return (
    <Card className="bg-white/70 backdrop-blur-lg">
      <CardContent className="p-6 text-center">
        <h3 className="text-lg font-medium mb-2">Nenhuma análise encontrada</h3>
        <p className="text-gray-600 mb-4">
          Você ainda não criou nenhuma análise de ROI ou todas expiraram.
        </p>
        <Button onClick={onCreateNew}>
          Criar Nova Análise
        </Button>
      </CardContent>
    </Card>
  );
};

export default EmptyState;
