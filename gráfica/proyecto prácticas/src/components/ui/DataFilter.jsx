import React from 'react';

export const DataFilter = ({ onFilterChange }) => (
  <select 
    onChange={(e) => onFilterChange(e.target.value)}
    style={{ padding: '8px', borderRadius: '8px', border: '1px solid #d1d5db' }}
  >
    <option value="todas">Todas las semanas</option>
    <option value="1">Semana 1</option>
    <option value="2">Semana 2</option>
    <option value="3">Semana 3</option>
  </select>
);