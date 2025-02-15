
import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { generateProductTemplate, validateProductData } from '../utils/excelTemplates';
import { FileUp, Download } from 'lucide-react';

const ProductUpload = () => {
  const handleDownloadTemplate = () => {
    const workbook = generateProductTemplate();
    XLSX.writeFile(workbook, 'product_template.xlsx');
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const workbook = XLSX.read(e.target?.result, { type: 'binary' });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const data = XLSX.utils.sheet_to_json(worksheet);

        const validationErrors = validateProductData(data);
        if (validationErrors.length > 0) {
          toast.error('Validation errors found', {
            description: validationErrors.join('\n')
          });
          return;
        }

        // Process the validated data
        // ... handle the upload to Supabase
        toast.success('File validated successfully');
      } catch (error) {
        toast.error('Error processing file');
      }
    };
    reader.readAsBinaryString(file);
  };

  return (
    <div className="flex gap-4 items-center">
      <Button onClick={handleDownloadTemplate} variant="outline" className="flex items-center gap-2">
        <Download className="w-4 h-4" />
        Download Template
      </Button>
      <label className="cursor-pointer">
        <input
          type="file"
          accept=".xlsx,.xls"
          onChange={handleFileUpload}
          className="hidden"
        />
        <Button variant="default" className="flex items-center gap-2">
          <FileUp className="w-4 h-4" />
          Upload Products
        </Button>
      </label>
    </div>
  );
};

export default ProductUpload;
