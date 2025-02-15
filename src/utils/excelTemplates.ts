
import * as XLSX from 'xlsx';

export const generateProductTemplate = () => {
  const headers = [
    'Product Name*', 'SKU*', 'Brand*', 'Category*', 'Collection*', 
    'Material', 'Type', 'Variant', 'Packaging',
    'MRP*', 'Base Price*', 'MOQ', 'Pack Count',
    'Box Stock', 'Piece Stock', 'Restock Date',
    'CBM', 'Unit Weight', 'Gross Weight', 'Net Weight',
    'Landing Cost', 'Variable Price', 'Status*',
    'Color 1', 'Color 2', 'Color 3', 'Color 4', 'Color 5',
    'Slab Price 1', 'Slab Price 2', 'Slab Price 3', 'Slab Price 4', 'Slab Price 5'
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  // Add Excel formulas and validation
  worksheet['!datavalidation'] = {
    A2: { // Product Name validation
      type: 'custom',
      operator: 'notBlank',
      prompt: 'Product Name is required',
      error: 'Product Name cannot be empty'
    },
    B2: { // SKU validation
      type: 'custom',
      operator: 'notBlank',
      prompt: 'SKU is required',
      error: 'SKU cannot be empty'
    },
    J2: { // MRP validation
      type: 'decimal',
      operator: 'between',
      formula1: '0',
      formula2: '999999',
      prompt: 'Enter MRP (must be > 0)',
      error: 'MRP must be a positive number'
    },
    K2: { // Base Price validation
      type: 'decimal',
      operator: 'between',
      formula1: '0',
      formula2: '999999',
      prompt: 'Enter Base Price (must be > 0)',
      error: 'Base Price must be a positive number'
    },
    W2: { // Status validation
      type: 'list',
      formula1: '"active,inactive,discontinued"',
      prompt: 'Select a status',
      error: 'Invalid status'
    }
  };

  // Add Excel formulas for required field validation
  worksheet['A2'] = { f: '=IF(ISBLANK(A2), "Required!", A2)' };
  worksheet['B2'] = { f: '=IF(ISBLANK(B2), "Required!", B2)' };
  worksheet['J2'] = { f: '=IF(OR(ISBLANK(J2), J2<=0), "Required and must be > 0!", J2)' };
  worksheet['K2'] = { f: '=IF(OR(ISBLANK(K2), K2<=0), "Required and must be > 0!", K2)' };
  worksheet['W2'] = { f: '=IF(ISBLANK(W2), "Required!", W2)' };

  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Products');

  // Set column widths
  worksheet['!cols'] = headers.map(() => ({ width: 15 }));

  return workbook;
};

export const validateProductData = (data: any[]) => {
  const requiredFields = ['Product Name', 'SKU', 'Brand', 'Category', 'Collection', 'MRP', 'Base Price', 'Status'];
  const errors: string[] = [];

  data.forEach((row, index) => {
    requiredFields.forEach(field => {
      if (!row[field]) {
        errors.push(`Row ${index + 2}: ${field} is required`);
      }
    });

    // Validate numeric fields
    ['MRP', 'Base Price', 'MOQ', 'Pack Count'].forEach(field => {
      if (row[field] && (isNaN(Number(row[field])) || Number(row[field]) <= 0)) {
        errors.push(`Row ${index + 2}: ${field} must be a positive number`);
      }
    });

    // Validate status
    if (row.Status && !['active', 'inactive', 'discontinued'].includes(row.Status.toLowerCase())) {
      errors.push(`Row ${index + 2}: Invalid status. Must be active, inactive, or discontinued`);
    }

    // Validate color count
    const colorFields = ['Color 1', 'Color 2', 'Color 3', 'Color 4', 'Color 5'];
    const colorCount = colorFields.filter(field => row[field]).length;
    if (colorCount > 5) {
      errors.push(`Row ${index + 2}: Maximum 5 colors allowed`);
    }

    // Validate slab prices
    const slabPrices = ['Slab Price 1', 'Slab Price 2', 'Slab Price 3', 'Slab Price 4', 'Slab Price 5'];
    slabPrices.forEach(field => {
      if (row[field] && (isNaN(Number(row[field])) || Number(row[field]) <= 0)) {
        errors.push(`Row ${index + 2}: ${field} must be a positive number`);
      }
    });
  });

  return errors;
};
