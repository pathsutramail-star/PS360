import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, MapPin, Plus, Trash2, Upload, CheckCircle2, Star } from 'lucide-react';
import { Card } from '../../ui/Card';
import { notify } from '../../../utils';

interface AddPropertyWizardProps {
  onClose: () => void;
  onComplete: () => void;
}

export function AddPropertyWizard({ onClose, onComplete }: AddPropertyWizardProps) {
  const [step, setStep] = useState(1);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const totalSteps = 11;

  // Form State
  const [propertyType, setPropertyType] = useState('');
  const [subType, setSubType] = useState('');
  const [location, setLocation] = useState({ country: '', state: '', city: '', street: '', building: '', floor: '', zip: '' });
  const [facilities, setFacilities] = useState<string[]>([]);
  const [rooms, setRooms] = useState([{ id: 1, type: '', size: '', occupancy: '', bathrooms: '', rate: '', breakfast: false }]);
  const [pricing, setPricing] = useState({ currency: 'NPR', extraBed: '' });
  const [details, setDetails] = useState({ name: '', rating: 4, checkIn: '14:00', checkOut: '11:00', policy: 'Flexible' });
  const [profile, setProfile] = useState({ name: '', email: '', phone: '', residence: '' });

  const nextStep = () => setStep(s => Math.min(s + 1, totalSteps));
  const prevStep = () => setStep(s => Math.max(s - 1, 1));

  const canProceedToNextStep = () => {
    switch (step) {
      case 2:
        if (!propertyType) {
          notify('Please select a property type', 'error');
          return false;
        }
        break;
      case 3:
        if (!subType) {
          notify('Please select a property subtype', 'error');
          return false;
        }
        break;
      case 4:
        if (!location.country || !location.state || !location.city || !location.street) {
          notify('Please fill in all required location fields', 'error');
          return false;
        }
        break;
      case 6:
        const invalidRooms = rooms.filter(r => !r.type || !r.size || !r.occupancy || !r.bathrooms || !r.rate);
        if (invalidRooms.length > 0) {
          notify('Please fill in all room details', 'error');
          return false;
        }
        break;
      case 9:
        if (!details.name) {
          notify('Please enter a property name', 'error');
          return false;
        }
        break;
      case 10:
        if (!profile.name || !profile.email || !profile.phone) {
          notify('Please fill in all required contact details', 'error');
          return false;
        }
        break;
    }
    return true;
  };

  const handleNextStep = () => {
    if (canProceedToNextStep()) {
      nextStep();
    }
  };

  const toggleFacility = (facility: string) => {
    setFacilities(prev => 
      prev.includes(facility) ? prev.filter(f => f !== facility) : [...prev, facility]
    );
  };

  const addRoom = () => {
    setRooms(prev => [...prev, { id: Date.now(), type: '', size: '', occupancy: '', bathrooms: '', rate: '', breakfast: false }]);
  };

  const removeRoom = (id: number) => {
    setRooms(prev => prev.filter(r => r.id !== id));
  };

  const updateRoom = (id: number, field: string, value: any) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, [field]: value } : r));
  };

  const handlePublish = () => {
    if (!termsAccepted) {
      notify('Please accept the terms and conditions', 'error');
      return;
    }
    notify('Property published successfully!', 'success');
    onComplete();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col animate-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 shrink-0">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">List Property on PS360</h3>
            <p className="text-sm text-gray-500 mt-1">Step {step} of {totalSteps}</p>
          </div>
          <button onClick={onClose} className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
            <X size={20} />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-100 h-1.5 shrink-0">
          <div 
            className="bg-[#689249] h-full transition-all duration-300 ease-out" 
            style={{ width: `${(step / totalSteps) * 100}%` }}
          ></div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 custom-scrollbar">
          
          {/* Step 1: Intro */}
          {step === 1 && (
            <div className="max-w-xl mx-auto text-center space-y-6 py-8">
              <div className="w-20 h-20 bg-[#689249]/10 text-[#689249] rounded-full flex items-center justify-center mx-auto mb-6">
                <MapPin size={40} />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Ready to list your property?</h2>
              <p className="text-gray-600 text-lg">Join thousands of hosts on PS360 and start accepting bookings worldwide.</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left mt-8">
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-1">1. Tell us about it</h4>
                  <p className="text-sm text-gray-500">Share basic info, location, and amenities.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-1">2. Add photos</h4>
                  <p className="text-sm text-gray-500">Upload images and 360° virtual tours.</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-1">3. Publish</h4>
                  <p className="text-sm text-gray-500">Set your pricing and start earning.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Property Type */}
          {step === 2 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What type of property is this?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Hotel', 'Resort', 'Villa', 'Apartment', 'Guest House', 'Café'].map(type => (
                  <button
                    key={type}
                    onClick={() => setPropertyType(type)}
                    className={`p-6 border-2 rounded-xl text-center transition-all ${propertyType === type ? 'border-[#689249] bg-[#689249]/5 text-[#689249]' : 'border-gray-200 hover:border-gray-300 text-gray-700'}`}
                  >
                    <span className="font-semibold">{type}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Step 3: Sub Type */}
          {step === 3 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Which best describes your {propertyType || 'property'}?</h2>
              <div className="space-y-3">
                {['Boutique Hotel', 'Luxury Resort', 'Budget Hotel', 'Business Hotel', 'Eco Lodge'].map(type => (
                  <label key={type} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${subType === type ? 'border-[#689249] bg-[#689249]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="radio" name="subtype" value={type} checked={subType === type} onChange={(e) => setSubType(e.target.value)} className="w-5 h-5 text-[#689249] focus:ring-[#689249]" />
                    <span className="ml-3 font-medium text-gray-900">{type}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 4: Location */}
          {step === 4 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Where's your property located?</h2>
              
              <div className="bg-gray-100 rounded-xl h-48 flex items-center justify-center text-gray-500 mb-6 border border-gray-200">
                <div className="text-center">
                  <MapPin size={32} className="mx-auto mb-2 text-gray-400" />
                  <p className="text-sm font-medium">Map Preview</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Country/Region *</label>
                  <input type="text" value={location.country} onChange={e => setLocation({...location, country: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">State/Province *</label>
                  <input type="text" value={location.state} onChange={e => setLocation({...location, state: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">City *</label>
                  <input type="text" value={location.city} onChange={e => setLocation({...location, city: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Street Address *</label>
                  <input type="text" value={location.street} onChange={e => setLocation({...location, street: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Building Name (Optional)</label>
                  <input type="text" value={location.building} onChange={e => setLocation({...location, building: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Floor/Unit No (Optional)</label>
                  <input type="text" value={location.floor} onChange={e => setLocation({...location, floor: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Zip/Postal Code (Optional)</label>
                  <input type="text" value={location.zip} onChange={e => setLocation({...location, zip: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249] focus:border-[#689249]" />
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Facilities */}
          {step === 5 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">What facilities do you offer?</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {['Free WiFi', 'Swimming Pool', 'Spa & Wellness', 'Fitness Center', 'Restaurant', 'Bar/Lounge', 'Free Parking', 'Room Service', 'Airport Shuttle'].map(fac => (
                  <label key={fac} className={`flex items-center p-4 border rounded-xl cursor-pointer transition-all ${facilities.includes(fac) ? 'border-[#689249] bg-[#689249]/5' : 'border-gray-200 hover:bg-gray-50'}`}>
                    <input type="checkbox" checked={facilities.includes(fac)} onChange={() => toggleFacility(fac)} className="w-5 h-5 text-[#689249] rounded focus:ring-[#689249]" />
                    <span className="ml-3 font-medium text-gray-900 text-sm">{fac}</span>
                  </label>
                ))}
              </div>
            </div>
          )}

          {/* Step 6: Rooms */}
          {step === 6 && (
            <div className="max-w-3xl mx-auto space-y-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Rooms / Units</h2>
                <button onClick={addRoom} className="flex items-center gap-2 text-sm font-medium text-[#689249] hover:bg-[#689249]/10 px-3 py-1.5 rounded-lg transition-colors">
                  <Plus size={16} /> Add Another Room
                </button>
              </div>

              <div className="space-y-6">
                {rooms.map((room, index) => (
                  <div key={room.id} className="p-5 border border-gray-200 rounded-xl bg-gray-50 relative">
                    {rooms.length > 1 && (
                      <button onClick={() => removeRoom(room.id)} className="absolute top-4 right-4 text-gray-400 hover:text-red-500">
                        <Trash2 size={18} />
                      </button>
                    )}
                    <h4 className="font-semibold text-gray-900 mb-4">Room {index + 1}</h4>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Room Type</label>
                        <input type="text" placeholder="e.g. Deluxe Double" value={room.type} onChange={e => updateRoom(room.id, 'type', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Room Size (sq m)</label>
                        <input type="number" placeholder="30" value={room.size} onChange={e => updateRoom(room.id, 'size', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Occupancy Limit</label>
                        <input type="number" placeholder="2" value={room.occupancy} onChange={e => updateRoom(room.id, 'occupancy', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Bathrooms</label>
                        <input type="number" placeholder="1" value={room.bathrooms} onChange={e => updateRoom(room.id, 'bathrooms', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Base Rate (Per Night)</label>
                        <input type="number" placeholder="$100" value={room.rate} onChange={e => updateRoom(room.id, 'rate', e.target.value)} className="w-full border border-gray-200 rounded-lg py-2 px-3 text-sm focus:ring-[#689249]" />
                      </div>
                      <div className="flex items-center pt-5">
                        <label className="flex items-center cursor-pointer">
                          <input type="checkbox" checked={room.breakfast} onChange={e => updateRoom(room.id, 'breakfast', e.target.checked)} className="w-4 h-4 text-[#689249] rounded focus:ring-[#689249]" />
                          <span className="ml-2 text-sm font-medium text-gray-700">Breakfast Included</span>
                        </label>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Step 7: Pricing */}
          {step === 7 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Pricing & Taxes</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Currency</label>
                  <select value={pricing.currency} onChange={e => setPricing({...pricing, currency: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]">
                    <option value="NPR">NPR (रु)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Extra Bed Charge (Per Night)</label>
                  <input type="number" placeholder="20" value={pricing.extraBed} onChange={e => setPricing({...pricing, extraBed: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" />
                </div>
                <div className="p-4 bg-blue-50 text-blue-800 rounded-xl text-sm border border-blue-100">
                  <p className="font-medium mb-1">Note about taxes</p>
                  <p>Standard local taxes will be applied automatically based on your property location during guest checkout.</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 8: Photos */}
          {step === 8 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Photos & 360° Views</h2>
              
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Property Photos</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer">
                  <Upload size={32} className="mx-auto text-gray-400 mb-3" />
                  <p className="text-sm font-medium text-gray-900">Click to upload photos</p>
                  <p className="text-xs text-gray-500 mt-1">JPG, PNG up to 5MB</p>
                </div>
              </div>

              <div className="space-y-4 mt-8">
                <label className="block text-sm font-medium text-gray-700">360° Virtual Tour</label>
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors cursor-pointer bg-gradient-to-b from-white to-gray-50">
                  <div className="w-12 h-12 bg-white shadow-sm rounded-full flex items-center justify-center mx-auto mb-3">
                    <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600 text-xs">360°</span>
                  </div>
                  <p className="text-sm font-medium text-gray-900">Upload panoramic images</p>
                  <p className="text-xs text-gray-500 mt-1">Or paste a Matterport/Kuula link</p>
                </div>
              </div>
            </div>
          )}

          {/* Step 9: Details */}
          {step === 9 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Property Details</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Property Name *</label>
                  <input type="text" value={details.name} onChange={e => setDetails({...details, name: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" placeholder="e.g. Sunrise Resort" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Star Rating</label>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          onClick={() => setDetails({ ...details, rating: star })}
                          className={`p-1.5 rounded-lg transition-colors ${
                            details.rating >= star
                              ? 'text-yellow-400 hover:text-yellow-500'
                              : 'text-gray-300 hover:text-gray-400'
                          }`}
                        >
                          <Star size={28} fill={details.rating >= star ? "currentColor" : "none"} strokeWidth={details.rating >= star ? 0 : 2} />
                        </button>
                      ))}
                    </div>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min="0"
                        max="5"
                        step="0.1"
                        value={details.rating}
                        onChange={e => {
                          const val = parseFloat(e.target.value);
                          if (!isNaN(val) && val >= 0 && val <= 5) {
                            setDetails({ ...details, rating: Math.round(val * 10) / 10 });
                          } else if (e.target.value === '') {
                            setDetails({ ...details, rating: 0 });
                          }
                        }}
                        className="w-20 border border-gray-200 rounded-lg py-1.5 px-3 text-sm focus:ring-[#689249] font-medium"
                      />
                      <span className="text-sm font-medium text-gray-600">
                        / 5.0
                      </span>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-in Time</label>
                    <input type="time" value={details.checkIn} onChange={e => setDetails({...details, checkIn: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1.5">Check-out Time</label>
                    <input type="time" value={details.checkOut} onChange={e => setDetails({...details, checkOut: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Cancellation Policy</label>
                  <select value={details.policy} onChange={e => setDetails({...details, policy: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]">
                    <option value="Flexible">Flexible - Full refund 1 day prior</option>
                    <option value="Moderate">Moderate - Full refund 5 days prior</option>
                    <option value="Strict">Strict - 50% refund up to 1 week prior</option>
                    <option value="Non-refundable">Non-refundable</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* Step 10: Profile */}
          {step === 10 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Host Profile & Contact</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name / Business Name *</label>
                  <input type="text" value={profile.name} onChange={e => setProfile({...profile, name: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address *</label>
                  <input type="email" value={profile.email} onChange={e => setProfile({...profile, email: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number *</label>
                  <input type="tel" value={profile.phone} onChange={e => setProfile({...profile, phone: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Residence / Business Address</label>
                  <input type="text" value={profile.residence} onChange={e => setProfile({...profile, residence: e.target.value})} className="w-full border border-gray-200 rounded-lg py-2.5 px-3 text-sm focus:ring-[#689249]" />
                </div>
              </div>
            </div>
          )}

          {/* Step 11: Publish */}
          {step === 11 && (
            <div className="max-w-2xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Publish</h2>
              
              <div className="bg-gray-50 border border-gray-200 rounded-xl overflow-hidden">
                <div className="h-48 bg-gray-200 relative flex items-center justify-center">
                  <span className="text-gray-500 font-medium">Property Image / 360 Preview</span>
                  <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                    {details.rating.toFixed(1)} Star {propertyType}
                  </div>
                </div>
                <div className="p-6 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">{details.name || 'Unnamed Property'}</h3>
                    <p className="text-gray-500 flex items-center gap-1 mt-1 text-sm">
                      <MapPin size={14} /> {location.city || 'City'}, {location.country || 'Country'}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-200">
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Rooms</p>
                      <p className="font-medium text-gray-900">{rooms.length} configured</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Facilities</p>
                      <p className="font-medium text-gray-900">{facilities.length} selected</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Base Currency</p>
                      <p className="font-medium text-gray-900">{pricing.currency}</p>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase font-semibold">Check In / Out</p>
                      <p className="font-medium text-gray-900">{details.checkIn} - {details.checkOut}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-4">
                <label className="flex items-start gap-3 cursor-pointer p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                  <input type="checkbox" checked={termsAccepted} onChange={e => setTermsAccepted(e.target.checked)} className="mt-1 w-5 h-5 text-[#689249] rounded focus:ring-[#689249]" />
                  <span className="text-sm text-gray-700">
                    I confirm that the information provided is accurate, and I agree to the <a href="#" className="text-[#689249] hover:underline">Terms & Conditions</a> and <a href="#" className="text-[#689249] hover:underline">Privacy Policy</a> of PS360 for hosting.
                  </span>
                </label>
              </div>

            </div>
          )}

        </div>

        {/* Footer Navigation */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 flex items-center justify-between shrink-0 rounded-b-2xl">
          {step > 1 ? (
            <button 
              onClick={prevStep}
              className="px-4 py-2 text-gray-700 font-medium text-sm hover:bg-gray-200 rounded-lg transition-colors flex items-center gap-2"
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : (
            <div></div> // Empty div for flex spacing
          )}

          {step < totalSteps ? (
            <button 
              onClick={handleNextStep}
              className="px-6 py-2 bg-[#689249] text-white font-medium text-sm hover:bg-[#557A3A] rounded-lg shadow-sm transition-colors flex items-center gap-2"
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button 
              onClick={handlePublish}
              disabled={!termsAccepted}
              className={`px-6 py-2 text-white font-medium text-sm rounded-lg shadow-sm transition-colors flex items-center gap-2 ${termsAccepted ? 'bg-[#689249] hover:bg-[#557A3A]' : 'bg-gray-400 cursor-not-allowed'}`}
            >
              <CheckCircle2 size={16} /> Publish Property
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
