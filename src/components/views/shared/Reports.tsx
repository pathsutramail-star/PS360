import React from 'react';
import { Card } from '../../ui/Card';
import { FileBarChart, Download, Calendar } from 'lucide-react';

export function Reports() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-500 text-sm">Detailed insights and exportable operational reports.</p>
        </div>
      </div>

      <Card>
        <div className="p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 rounded-lg bg-[#689249]/10 flex items-center justify-center text-[#689249]">
              <FileBarChart size={20} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900">Generate Report</h3>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Report Type</label>
              <select className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]">
                <option>Booking Report</option>
                <option>Occupancy Report</option>
                <option>Revenue Report</option>
                <option>Customer Report</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Date Range</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <select className="w-full border border-gray-200 rounded-lg py-2 pl-10 pr-3 text-sm focus:ring-[#689249] focus:border-[#689249]">
                  <option>Last 30 Days</option>
                  <option>This Quarter</option>
                  <option>This Year</option>
                  <option>Custom Range</option>
                </select>
              </div>
            </div>
            <div className="flex items-end">
              <button className="w-full flex items-center justify-center gap-2 bg-[#689249] text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-[#557A3A] transition-colors">
                <Download size={16} />
                Export as PDF
              </button>
            </div>
          </div>
        </div>
      </Card>
      
      <Card>
        <div className="p-6 text-center py-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-50 mb-4">
            <FileBarChart size={28} className="text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-1">Advanced Analytics Dashboard</h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">Select a report type above to view detailed tabular data and charts.</p>
        </div>
      </Card>
    </div>
  );
}
