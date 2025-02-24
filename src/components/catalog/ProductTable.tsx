
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/reused/table";
import type { Product } from '@/types/catalog';

interface ProductTableProps {
  products: Product[];
}

const ProductTable = ({ products }: ProductTableProps) => {
  return (
    <table className="w-full">
      <thead>
        <tr className="border-b">
          <th className="text-left p-2">SKU</th>
          <th className="text-left p-2">Name</th>
          <th className="text-left p-2">Category</th>
          <th className="text-right p-2">MRP</th>
        </tr>
      </thead>
      <tbody>
        {products.map((product) => (
          <tr key={product.prodId} className="border-b">
            <td className="p-2">{product.prodSku}</td>
            <td className="p-2">{product.prodName}</td>
            <td className="p-2">{product.prodCategory}</td>
            <td className="p-2 text-right">₹{product.prodMrp.toFixed(2)}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ProductTable;
