import React, { useState } from 'react';
import { Sparkles, Send, Bot, User, BarChart2, TrendingUp, Calendar } from 'lucide-react';
import { Card, CardContent } from '../../ui/Card';

export function AICopilot() {
  const [query, setQuery] = useState('');
  
  return (
    <div className="space-y-6 h-[calc(100vh-8rem)] flex flex-col animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 flex items-center gap-2 tracking-tight">
            <Sparkles className="text-[#689249]" size={24} />
            AI Copilot
          </h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Your intelligent business assistant powered by AI.</p>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
        <Card className="lg:col-span-2 flex flex-col h-full shadow-sm border-gray-200/60">
          <div className="flex-1 p-6 overflow-y-auto space-y-6 custom-scrollbar">
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2de071] to-[#689249] shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-4 text-sm text-gray-700 max-w-[85%] border border-gray-100 shadow-sm">
                <p>Hello! I'm your PS360 AI Copilot. I can help you analyze revenue, forecast occupancy, and generate insights. How can I assist you today?</p>
              </div>
            </div>

            <div className="flex gap-4 flex-row-reverse">
              <div className="w-8 h-8 rounded-full bg-gray-900 shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                <User size={16} className="text-white" />
              </div>
              <div className="bg-[#689249] text-white rounded-2xl rounded-tr-sm p-4 text-sm max-w-[85%] shadow-sm">
                <p>Generate a monthly revenue report for Grand Horizon Resort.</p>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#2de071] to-[#689249] shadow-sm flex items-center justify-center flex-shrink-0 mt-1">
                <Bot size={16} className="text-white" />
              </div>
              <div className="bg-gray-50 rounded-2xl rounded-tl-sm p-5 text-sm text-gray-700 max-w-[85%] border border-gray-100 shadow-sm">
                <p className="mb-4">Here is the revenue summary for <strong className="text-gray-900">Grand Horizon Resort</strong> for October 2023:</p>
                <div className="bg-white border border-gray-200/60 rounded-xl p-4 space-y-3 shadow-sm">
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-500 font-medium">Total Revenue</span>
                    <span className="font-semibold text-gray-900">$42,500</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                    <span className="text-gray-500 font-medium">Occupancy Rate</span>
                    <span className="font-semibold text-green-600">85% (+5%)</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-500 font-medium">Top Room Category</span>
                    <span className="font-semibold text-gray-900">Deluxe Suite</span>
                  </div>
                </div>
                <p className="mt-4 text-xs font-medium text-gray-500">Would you like me to export this as a PDF?</p>
              </div>
            </div>
          </div>
          
          <div className="p-4 border-t border-gray-100 bg-white">
            <div className="relative flex items-center">
              <input 
                type="text" 
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Ask anything about your business..." 
                className="w-full pl-4 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50 text-sm focus:outline-none focus:ring-2 focus:ring-[#689249]/20 focus:border-[#689249] transition-all"
              />
              <button className="absolute right-2 p-2 bg-[#689249] text-white rounded-lg hover:bg-[#557A3A] transition-colors shadow-sm">
                <Send size={16} />
              </button>
            </div>
          </div>
        </Card>

        <div className="space-y-4">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Suggested Queries</h3>
          
          {[
            { label: 'Revenue Analysis', text: 'Show me revenue trends for the last quarter', icon: BarChart2 },
            { label: 'Occupancy Forecasting', text: 'Predict occupancy rate for next weekend', icon: TrendingUp },
            { label: 'Business Insights', text: 'Which room is most popular this month?', icon: Sparkles },
            { label: 'Report Generation', text: "Show today's bookings summary", icon: Calendar }
          ].map((suggestion, i) => {
            const Icon = suggestion.icon;
            return (
              <Card key={i} className="hover:border-[#689249]/30 hover:shadow-md cursor-pointer transition-all duration-200 group">
                <CardContent className="p-4 flex gap-4">
                  <div className="w-10 h-10 rounded-lg bg-[#689249]/5 flex items-center justify-center group-hover:bg-[#689249]/10 transition-colors">
                    <Icon size={18} className="text-[#689249]" />
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-gray-900 group-hover:text-[#689249] transition-colors">{suggestion.label}</div>
                    <div className="text-xs text-gray-500 mt-1 font-medium">{suggestion.text}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
