import React from 'react';

const ProductBulkManage = () => {
  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold">Product Bulk Upload</h2>
      <div className="space-x-4 mt-4">
        <button className="bg-blue-500 text-white p-2 rounded">Template Download</button>
        <button className="bg-green-500 text-white p-2 rounded">Files Upload</button>
        <button className="bg-red-500 text-white p-2 rounded">Download All Products</button>
      </div>
    </div>
  );
};

export default ProductBulkManage;
