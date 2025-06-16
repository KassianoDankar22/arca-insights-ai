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

import React, { useState, useMemo } from 'react';
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface CondominiumAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  condominiums: string[];
}

export function CondominiumAutocomplete({ value, onChange, condominiums }: CondominiumAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSelect = (selectedValue: string) => {
    onChange(selectedValue);
    setOpen(false);
    setSearchQuery("");
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      setSearchQuery("");
    }
  };

  // Filtra os condomínios baseado na busca
  const filteredCondominiums = useMemo(() => {
    if (!condominiums || condominiums.length === 0) return [];
    
    if (!searchQuery || searchQuery.trim() === "") {
      return condominiums; // Mostra todos se não há busca
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Primeiro: condomínios que começam com a busca
    const startsWithQuery = condominiums.filter((condominium) =>
      condominium.toLowerCase().startsWith(query)
    );
    
    // Segundo: condomínios que contêm a busca (mas não começam)
    const containsQuery = condominiums.filter((condominium) =>
      condominium.toLowerCase().includes(query) && 
      !condominium.toLowerCase().startsWith(query)
    );
    
    // Retorna primeiro os que começam, depois os que contêm
    return [...startsWithQuery, ...containsQuery];
  }, [condominiums, searchQuery]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Selecione um condomínio..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Digite para buscar condomínio..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filteredCondominiums.length > 0 ? (
            filteredCondominiums.map((condominium, index) => (
              <div
                key={`${condominium}-${index}`}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-b-0"
                onClick={() => handleSelect(condominium)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-green-600",
                    value === condominium ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="text-sm flex-1">{condominium}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center">
              {searchQuery ? 
                `Nenhum condomínio encontrado para "${searchQuery}"` : 
                `${condominiums?.length || 0} condomínios disponíveis`
              }
            </div>
          )}
        </div>
        {filteredCondominiums.length > 0 && searchQuery && (
          <div className="p-2 border-t bg-gray-50 text-xs text-gray-600 text-center">
            {filteredCondominiums.length} resultado{filteredCondominiums.length !== 1 ? 's' : ''} para "{searchQuery}"
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 