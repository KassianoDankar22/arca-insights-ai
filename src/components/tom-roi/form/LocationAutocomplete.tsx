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

const LOCATIONS = [
  "Altamonte Springs",
  "Apopka",
  "Bay Lake",
  "Celebration",
  "College Park",
  "Clermont",
  "Davenport",
  "Edgewood",
  "Geneva",
  "Kissimmee",
  "Lake Buena Vista",
  "Lake Nona",
  "Maitland",
  "Montverde",
  "Ocoee",
  "Orlando",
  "Poinciana",
  "Sanford",
  "Southchase",
  "St. Cloud",
  "Thornton Park",
  "Windermere",
  "Winter Garden",
  "Winter Park"
];

interface LocationAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
}

export function LocationAutocomplete({ value, onChange }: LocationAutocompleteProps) {
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

  // Filtra as localizações baseado na busca
  const filteredLocations = useMemo(() => {
    if (!searchQuery || searchQuery.trim() === "") {
      return LOCATIONS; // Mostra todas se não há busca
    }
    
    const query = searchQuery.toLowerCase().trim();
    
    // Primeiro: localizações que começam com a busca
    const startsWithQuery = LOCATIONS.filter((location) =>
      location.toLowerCase().startsWith(query)
    );
    
    // Segundo: localizações que contêm a busca (mas não começam)
    const containsQuery = LOCATIONS.filter((location) =>
      location.toLowerCase().includes(query) && 
      !location.toLowerCase().startsWith(query)
    );
    
    // Retorna primeiro os que começam, depois os que contêm
    return [...startsWithQuery, ...containsQuery];
  }, [searchQuery]);

  return (
    <Popover open={open} onOpenChange={handleOpenChange}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value || "Selecione uma localização..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0" align="start">
        <div className="p-2 border-b">
          <Input
            placeholder="Digite para buscar localização..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
        <div className="max-h-64 overflow-y-auto">
          {filteredLocations.length > 0 ? (
            filteredLocations.map((location, index) => (
              <div
                key={`${location}-${index}`}
                className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer border-b border-gray-50 last:border-b-0"
                onClick={() => handleSelect(location)}
              >
                <Check
                  className={cn(
                    "mr-2 h-4 w-4 text-green-600",
                    value === location ? "opacity-100" : "opacity-0"
                  )}
                />
                <span className="text-sm flex-1">{location}</span>
              </div>
            ))
          ) : (
            <div className="p-3 text-sm text-gray-500 text-center">
              {searchQuery ? 
                `Nenhuma localização encontrada para "${searchQuery}"` : 
                `${LOCATIONS.length} localizações disponíveis`
              }
            </div>
          )}
        </div>
        {filteredLocations.length > 0 && searchQuery && (
          <div className="p-2 border-t bg-gray-50 text-xs text-gray-600 text-center">
            {filteredLocations.length} resultado{filteredLocations.length !== 1 ? 's' : ''} para "{searchQuery}"
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
} 