import React, { useState } from 'react';
import { Card } from '../../ui/Card';
import { Building2, CreditCard, Shield, Bell, Globe } from 'lucide-react';
import { notify } from '../../../utils';

type Tab = 'profile' | 'preferences' | 'payments' | 'notifications' | 'security';

export function Profile() {
  const [activeTab, setActiveTab] = useState<Tab>('profile');

  const tabs: { id: Tab; label: string; icon: React.ElementType }[] = [
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    { id: 'preferences', label: 'Preferences', icon: Globe },
    { id: 'payments', label: 'Payment Integration', icon: CreditCard },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'security', label: 'Security', icon: Shield },
  ];

  return (
    <div className="space-y-6 max-w-5xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-gray-900 tracking-tight">Settings</h1>
        <p className="text-gray-500 mt-1 text-sm font-medium">Manage business profile, payments, and security.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="md:col-span-1 space-y-1">
          {tabs.map((item) => (
            <button 
              key={item.id} 
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                activeTab === item.id ? 'bg-[#689249]/10 text-[#689249]' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </div>
        
        <div className="md:col-span-3">
          {activeTab === 'profile' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Business Profile</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Name</label>
                    <input type="text" defaultValue="Grand Horizon Hospitality" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Contact Email</label>
                      <input type="email" defaultValue="admin@grandhorizon.com" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                      <input type="tel" defaultValue="+1 (555) 123-4567" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" defaultValue="Lakeside, Pokhara, Nepal" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Tax ID / PAN</label>
                      <input type="text" defaultValue="123456789" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Website</label>
                      <input type="url" defaultValue="https://grandhorizon.com" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Business Description</label>
                    <textarea rows={3} defaultValue="Premium resort and hospitality services located in the beautiful city of Pokhara." className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249] resize-none"></textarea>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => notify('Business profile updated successfully', 'success')}
                      className="bg-[#689249] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#557A3A] transition-colors"
                    >
                      Save Changes
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'preferences' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">System Preferences</h3>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                    <select className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]">
                      <option value="en">English</option>
                      <option value="ne">Nepali</option>
                    </select>
                    <p className="text-xs text-gray-500 mt-2">Select the primary language for the administrative interface.</p>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => notify('Preferences updated successfully', 'success')}
                      className="bg-[#689249] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#557A3A] transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'payments' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Payment Integration</h3>
                <div className="space-y-6">
                  <div className="p-4 border border-gray-200 rounded-xl bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-blue-600">
                        Stripe
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Stripe Integration</h4>
                        <p className="text-sm text-gray-500">Connected to acct_1NXY2... (Active)</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => notify('Stripe connection settings opened', 'info')}
                      className="text-sm font-medium text-gray-600 bg-white border border-gray-200 px-4 py-2 rounded-lg hover:bg-gray-50"
                    >
                      Manage
                    </button>
                  </div>
                  <div className="p-4 border border-gray-200 rounded-xl flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white rounded-lg border border-gray-200 flex items-center justify-center font-bold text-[#003087]">
                        PayPal
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">PayPal Express</h4>
                        <p className="text-sm text-gray-500">Not connected</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => notify('Connecting to PayPal...', 'info')}
                      className="text-sm font-medium text-[#689249] bg-[#689249]/10 px-4 py-2 rounded-lg hover:bg-[#689249]/20"
                    >
                      Connect
                    </button>
                  </div>
                  <div className="pt-4 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => notify('Payment settings saved', 'success')}
                      className="bg-[#689249] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#557A3A] transition-colors"
                    >
                      Save Settings
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Notification Preferences</h3>
                <div className="space-y-4">
                  {[
                    { id: 'n1', label: 'New Bookings', desc: 'Receive email alerts for new bookings' },
                    { id: 'n2', label: 'Cancellations', desc: 'Get notified when a booking is cancelled' },
                    { id: 'n3', label: 'Daily Summary', desc: 'Receive a daily digest of activities' },
                    { id: 'n4', label: 'Marketing', desc: 'Receive updates and tips from our team' },
                  ].map((setting) => (
                    <div key={setting.id} className="flex items-center justify-between py-3">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">{setting.label}</h4>
                        <p className="text-sm text-gray-500">{setting.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input type="checkbox" className="sr-only peer" defaultChecked={setting.id !== 'n4'} />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#689249]"></div>
                      </label>
                    </div>
                  ))}
                  <div className="pt-6 border-t border-gray-100 flex justify-end">
                    <button 
                      onClick={() => notify('Notification preferences updated', 'success')}
                      className="bg-[#689249] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#557A3A] transition-colors"
                    >
                      Save Preferences
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-6">Security Settings</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-sm font-medium text-gray-900 mb-1">Change Password</h4>
                    <p className="text-sm text-gray-500 mb-4">Ensure your account is using a long, random password to stay secure.</p>
                    <div className="space-y-3 max-w-md">
                      <input type="password" placeholder="Current Password" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                      <input type="password" placeholder="New Password" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                      <input type="password" placeholder="Confirm New Password" className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                      <button 
                        onClick={() => notify('Password changed successfully', 'success')}
                        className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                      >
                        Update Password
                      </button>
                    </div>
                  </div>
                  
                  <div className="pt-6 border-t border-gray-100">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-sm font-medium text-gray-900">Two-Factor Authentication</h4>
                        <p className="text-sm text-gray-500">Add an extra layer of security to your account.</p>
                      </div>
                      <button 
                        onClick={() => notify('2FA setup initiated', 'info')}
                        className="text-sm font-medium text-[#689249] bg-[#689249]/10 px-4 py-2 rounded-lg hover:bg-[#689249]/20"
                      >
                        Enable 2FA
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
