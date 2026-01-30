/**
 * Convierte una fecha a formato ISO (YYYY-MM-DD) para almacenamiento
 */
export const formatDateToISO = (date: any): string => {
  if (!date) return new Date().toISOString().split('T')[0];
  if (typeof date === 'object' && 'toISOString' in date) {
    return (date as Date).toISOString().split('T')[0];
  }
  if (typeof date === 'string') {
    return date;
  }
  return new Date().toISOString().split('T')[0];
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
