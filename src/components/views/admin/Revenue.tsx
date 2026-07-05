import React from 'react';
import { Card } from '../../ui/Card';
import { DollarSign, TrendingUp, TrendingDown, CreditCard } from 'lucide-react';

export function Revenue() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Revenue & Finance</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Track income, expenses, and financial performance.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { title: 'Today\'s Revenue', value: '$4,250', trend: '+12%', isUp: true, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50' },
          { title: 'Weekly Revenue', value: '$28,400', trend: '+5%', isUp: true, icon: TrendingUp, color: 'text-blue-600', bg: 'bg-blue-50' },
          { title: 'Monthly Expenses', value: '$12,300', trend: '-2%', isUp: false, icon: TrendingDown, color: 'text-rose-600', bg: 'bg-rose-50' },
          { title: 'Pending Payouts', value: '$3,150', trend: 'Processing', isUp: true, icon: CreditCard, color: 'text-amber-600', bg: 'bg-amber-50' },
        ].map((stat, i) => {
          const Icon = stat.icon;
          return (
            <Card key={i}>
              <div className="p-5">
                <div className="flex justify-between items-start mb-4">
                  <div className={`w-10 h-10 rounded-lg ${stat.bg} flex items-center justify-center ${stat.color}`}>
                    <Icon size={20} />
                  </div>
                  <span className={`text-xs font-medium px-2 py-1 rounded-md ${
                    stat.isUp ? 'text-emerald-700 bg-emerald-50' : 'text-gray-600 bg-gray-100'
                  }`}>
                    {stat.trend}
                  </span>
                </div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <h3 className="text-2xl font-bold text-gray-900 mt-1">{stat.value}</h3>
              </div>
            </Card>
          );
        })}
      </div>

      <Card>
        <div className="p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Transactions</h3>
          <div className="text-center py-12 text-gray-500 text-sm border-2 border-dashed border-gray-100 rounded-lg">
            Transaction history visualization will appear here.
          </div>
        </div>
      </Card>
    </div>
  );
}
