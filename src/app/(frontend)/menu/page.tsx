import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Dijital Menü | Dilim Pastaneleri',
  description: 'Dilim Pastaneleri dijital ürün menüsü.',
};

export default function MenuPage() {
  return (
    <div className="bg-gray-50/50 min-h-screen py-12 lg:py-20">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-dilim-siyah mb-4">Dijital Menümüz</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Lezzetlerimizi aşağıdan inceleyebilirsiniz. Menümüz sürekli güncellenmektedir.
          </p>
        </div>
        
        <div className="w-full bg-white rounded-3xl shadow-xl overflow-hidden border border-gray-100" style={{ height: '80vh', minHeight: '600px' }}>
          <iframe 
            style={{ border: 'none', width: '100%', height: '100%' }} 
            src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fproto%2FIR8eKNvKGTLeWbKiYUVkg4%2FDilim-Pastanesi%3Ftype%3Ddesign%26node-id%3D2222-895%26t%3DWAagkDaKqcfVsuuf-0%26scaling%3Dmin-zoom%26page-id%3D0%253A1%26starting-point-node-id%3D1%253A667" 
            allowFullScreen
          ></iframe>
        </div>
      </div>
    </div>
  );
}
