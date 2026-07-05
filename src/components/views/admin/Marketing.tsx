import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Megaphone, Tag, Gift, Mail, Plus, X } from 'lucide-react';
import { notify } from '../../../utils';

interface Campaign {
  id: string;
  title: string;
  type: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface AddCampaignModalProps {
  onClose: () => void;
  onSave: (campaign: Campaign) => void;
}

function AddCampaignModal({ onClose, onSave }: AddCampaignModalProps) {
  const [campaign, setCampaign] = useState({
    title: '',
    type: 'Discount Coupon',
    startDate: '',
    endDate: '',
    description: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!campaign.title || !campaign.startDate || !campaign.endDate) {
      notify('Please fill in title, start date, and end date', 'error');
      return;
    }

    onSave({
      id: `CMP-${Math.floor(Math.random() * 100000)}`,
      ...campaign,
    });
    setCampaign({ title: '', type: 'Discount Coupon', startDate: '', endDate: '', description: '' });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">Create New Campaign</h3>
            <p className="text-sm text-gray-500 mt-1">Launch a new marketing campaign for guests.</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title *</label>
              <input
                type="text"
                value={campaign.title}
                onChange={(e) => setCampaign({ ...campaign, title: e.target.value })}
                placeholder="Summer Sale Campaign"
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-[#689249] focus:border-[#689249]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Type</label>
              <select
                value={campaign.type}
                onChange={(e) => setCampaign({ ...campaign, type: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-[#689249] focus:border-[#689249]"
              >
                <option>Discount Coupon</option>
                <option>Special Package</option>
                <option>Email Campaign</option>
                <option>Referral Program</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
              <input
                type="date"
                value={campaign.startDate}
                onChange={(e) => setCampaign({ ...campaign, startDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-[#689249] focus:border-[#689249]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
              <input
                type="date"
                value={campaign.endDate}
                onChange={(e) => setCampaign({ ...campaign, endDate: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-[#689249] focus:border-[#689249]"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={campaign.description}
              onChange={(e) => setCampaign({ ...campaign, description: e.target.value })}
              rows={4}
              placeholder="Describe the campaign details..."
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-[#689249] focus:border-[#689249]"
            />
          </div>
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-50 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-lg bg-[#689249] text-white hover:bg-[#557A3A] transition-all"
            >
              Create Campaign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function Marketing() {
  const [isAddCampaignOpen, setIsAddCampaignOpen] = useState(false);
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);

  const handleSaveCampaign = (campaign: Campaign) => {
    setCampaigns((prev) => [campaign, ...prev]);
    notify('Campaign created successfully!', 'success');
    setIsAddCampaignOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Marketing & Promotions</h1>
          <p className="text-gray-500 mt-1 text-sm font-medium">Create campaigns, special offers, and discount codes.</p>
        </div>
        <button 
          onClick={() => setIsAddCampaignOpen(true)}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-[#689249] text-white rounded-lg shadow-sm hover:bg-[#557A3A] font-medium text-sm transition-all"
        >
          <Plus size={16} />
          Add Campaign
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 hover:border-[#689249]/30 transition-colors cursor-pointer group" onClick={() => notify('Creating new discount coupon', 'info')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Tag size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Discount Coupons</h3>
            <p className="text-sm text-gray-500 mt-1">Create promotional codes for direct bookings.</p>
          </div>
        </Card>

        <Card className="p-6 hover:border-[#689249]/30 transition-colors cursor-pointer group" onClick={() => notify('Creating special package', 'info')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Gift size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Special Packages</h3>
            <p className="text-sm text-gray-500 mt-1">Bundle rooms with amenities for seasonal offers.</p>
          </div>
        </Card>
        
        <Card className="p-6 hover:border-[#689249]/30 transition-colors cursor-pointer group" onClick={() => notify('Creating email campaign', 'info')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Mail size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Email Campaigns</h3>
            <p className="text-sm text-gray-500 mt-1">Send newsletters to your loyal customer base.</p>
          </div>
        </Card>

        <Card className="p-6 hover:border-[#689249]/30 transition-colors cursor-pointer group" onClick={() => notify('Creating referral program', 'info')}>
          <div className="flex justify-between items-start mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Megaphone size={24} />
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Referral Program</h3>
            <p className="text-sm text-gray-500 mt-1">Reward customers for referring new guests.</p>
          </div>
        </Card>
      </div>

      {campaigns.length > 0 && (
        <div className="mt-8 space-y-4">
          <h2 className="text-xl font-semibold text-gray-900">Created Campaigns</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {campaigns.map((campaign) => (
              <Card key={campaign.id} className="p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{campaign.title}</h3>
                    <p className="text-sm text-gray-500">{campaign.type}</p>
                  </div>
                  <span className="text-xs uppercase tracking-wider text-green-700 bg-green-100 px-2 py-1 rounded-full">Live</span>
                </div>
                <p className="text-sm text-gray-600 mb-3">{campaign.description || 'No description provided.'}</p>
                <div className="text-sm text-gray-500">
                  <div>Start: {campaign.startDate}</div>
                  <div>End: {campaign.endDate}</div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {isAddCampaignOpen && (
        <AddCampaignModal onClose={() => setIsAddCampaignOpen(false)} onSave={handleSaveCampaign} />
      )}
    </div>
  );
}
