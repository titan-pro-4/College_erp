// Date utility functions for Supabase
// Ensures proper date format conversion between frontend and Supabase

/**
 * Convert date to Supabase DATE format (YYYY-MM-DD)
 * Works with Date objects, ISO strings, or date strings
 */
export const toSupabaseDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  
  // Format as YYYY-MM-DD (local timezone)
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Convert date to Supabase TIMESTAMPTZ format (ISO 8601)
 */
export const toSupabaseTimestamp = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(d.getTime())) {
    throw new Error(`Invalid date: ${date}`);
  }
  
  return d.toISOString();
};

/**
 * Get current timestamp in Supabase format
 */
export const nowTimestamp = (): string => {
  return new Date().toISOString();
};

/**
 * Get current date in Supabase DATE format
 */
export const todayDate = (): string => {
  return toSupabaseDate(new Date());
};

/**
 * Parse Supabase date to JavaScript Date object
 */
export const fromSupabaseDate = (dateString: string): Date => {
  // Supabase DATE is returned as YYYY-MM-DD
  const [year, month, day] = dateString.split('-').map(Number);
  return new Date(year, month - 1, day);
};

/**
 * Parse Supabase timestamp to JavaScript Date object
 */
export const fromSupabaseTimestamp = (timestamp: string): Date => {
  return new Date(timestamp);
};

/**
 * Format date for display (DD/MM/YYYY)
 */
export const formatDisplayDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  
  return `${day}/${month}/${year}`;
};
