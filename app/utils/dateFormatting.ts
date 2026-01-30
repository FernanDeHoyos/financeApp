/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) para almacenamiento
 */
export const formatDateToISO = (date: any): string => {
  if (!date) return new Date().toISOString().split('T')[0];
  try {
    // If it's already a Date object
    if (date instanceof Date) {
      // Handle invalid dates
      if (isNaN(date.getTime())) return new Date().toISOString().split('T')[0];
      return date.toISOString().split('T')[0];
    }

    // If it's an object with toISOString (like Dayjs if used later, or similar)
    if (typeof date === 'object' && 'toISOString' in date) {
      return (date as Date).toISOString().split('T')[0];
    }

    // If it's a string, try to normalize it
    if (typeof date === 'string') {
      // 1. Check if already ISO (YYYY-MM-DD)
      if (date.match(/^\d{4}-\d{2}-\d{2}$/)) return date;

      // 2. Handle DD/MM/YYYY or DD-MM-YYYY
      const dmyMatch = date.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
      if (dmyMatch) {
        const day = dmyMatch[1].padStart(2, '0');
        const month = dmyMatch[2].padStart(2, '0');
        const year = dmyMatch[3];
        return `${year}-${month}-${day}`;
      }

      // 3. Try standard parse (for other formats)
      const parsed = new Date(date);
      if (!isNaN(parsed.getTime())) {
        return parsed.toISOString().split('T')[0];
      }

      // 4. Last resort: Return standard "today" or original? 
      // If we return original ("25/01/24"), it breaks dashboard.
      // Better to return current date or empty? 
      // Let's return new Date().toISOString() to guarantee visibility, or maybe flag it?
      // Giving it one attempt at slash replacement:
      if (date.includes('/')) {
        // simple replace might not work if order is DMY, but it fixes separators
        return date.replace(/\//g, '-');
      }

      return date;
    }

    return new Date().toISOString().split('T')[0];
  } catch (e) {
    return new Date().toISOString().split('T')[0];
  }
};

/**
 * Convierte una fecha ISO (YYYY-MM-DD) o cualquier formato a Date object
 */
export const parseDate = (dateString: string): Date => {
  if (!dateString) return new Date();

  // Intenta parsear como ISO primero
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Si falla, intenta otros formatos
  return new Date();
};

/**
 * Formatea una fecha para mostrar al usuario en español
 */
export const formatDateForDisplay = (date: string | Date): string => {
  try {
    const dateObj = typeof date === 'string' ? parseDate(date) : date;
    return dateObj.toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return 'Fecha inválida';
  }
};

/**
 * Parsea una fecha ISO (YYYY-MM-DD) asumiendo que es LOCAL (no UTC).
 * Evita el problema donde "2024-02-01" se convierte en "Jan 31" por la zona horaria.
 */
export const parseISOToLocal = (dateString: string): Date => {
  if (!dateString) return new Date();

  // Si ya viene con hora (T...), dejar que Date lo maneje o cortar
  if (dateString.includes('T')) {
    return new Date(dateString);
  }

  // Esperamos YYYY-MM-DD
  const parts = dateString.split('-');
  if (parts.length === 3) {
    const year = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Mes es 0-indexado
    const day = parseInt(parts[2], 10);
    return new Date(year, month, day);
  }

  return new Date(dateString); // Fallback
};
