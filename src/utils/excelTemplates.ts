
import * as XLSX from 'xlsx';

export const generateProductTemplate = () => {
  const headers = [
    'Product Name*', 'SKU*', 'Brand*', 'Category*', 'Collection*', 
    'Material', 'Type', 'Variant', 'Packaging',
    'MRP*', 'Base Price*', 'MOQ', 'Pack Count',
    'Box Stock', 'Piece Stock', 'Restock Date',
    'CBM', 'Unit Weight', 'Gross Weight', 'Net Weight',
    'Landing Cost', 'Variable Price', 'Status*'
  ];

  const worksheet = XLSX.utils.aoa_to_sheet([headers]);

  // Add data validation
  worksheet['!datavalidation'] = {
    B2: { // SKU validation - must not be empty
      type: 'custom',
      operator: 'notBlank',
      prompt: 'SKU is required',
      error: 'SKU cannot be empty'
    },
    E2: { // Status validation - dropdown
      type: 'list',
      formula1: '"active,inactive,discontinued"',
      prompt: 'Select a status',
      error: 'Invalid status'
    }
  };

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

    // Validate status
    if (row.Status && !['active', 'inactive', 'discontinued'].includes(row.Status.toLowerCase())) {
      errors.push(`Row ${index + 2}: Invalid status. Must be active, inactive, or discontinued`);
    }

    // Validate numeric fields
    ['MRP', 'Base Price', 'MOQ', 'Pack Count'].forEach(field => {
      if (row[field] && isNaN(Number(row[field]))) {
        errors.push(`Row ${index + 2}: ${field} must be a number`);
      }
    });
  });

  return errors;
};
