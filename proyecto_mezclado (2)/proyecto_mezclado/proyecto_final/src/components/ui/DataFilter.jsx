// src/components/ui/DataFilter.jsx — del proyecto original
import React from 'react';

/**
 * DataFilter
 * @param {Array}    semanas         - Lista de semanas disponibles
 * @param {Function} onFilterChange  - Callback con el valor seleccionado
 */
export const DataFilter = ({ semanas = [], onFilterChange }) => (
  <select
    onChange={(e) => onFilterChange(e.target.value)}
    style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #d1d5db', fontSize: '13px', color: '#374151' }}
  >
    <option value="todas">Todas las semanas</option>
    {semanas.map((s) => (
      <option key={s} value={String(s)}>Semana {s}</option>
    ))}
  </select>
);
