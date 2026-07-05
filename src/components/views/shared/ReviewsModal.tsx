import React from 'react';
import { X, Star, User } from 'lucide-react';

interface ReviewsModalProps {
  onClose: () => void;
  propertyName: string;
  rating: string;
}

export function ReviewsModal({ onClose, propertyName, rating }: ReviewsModalProps) {
  const reviews = [
    { name: "Alice Smith", score: 5, date: "June 2024", text: "Amazing stay! The property was very well maintained and the staff was extremely helpful." },
    { name: "John Doe", score: 4, date: "May 2024", text: "Great location and nice amenities. The check-in process was a bit slow, but overall a very good experience." },
    { name: "Sarah Connor", score: 5, date: "April 2024", text: "Absolutely loved it. Will definitely book again next time I'm in town." },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
      <div className="absolute inset-0 bg-gray-900/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between p-6 border-b border-gray-100 bg-white z-10 shrink-0">
          <div>
            <h3 className="text-xl font-bold font-display text-gray-900">Reviews for {propertyName}</h3>
            <div className="flex items-center gap-2 mt-1 text-sm text-gray-500">
              <div className="flex text-[#689249]">
                <Star size={14} className="fill-current" />
              </div>
              <span className="font-semibold text-gray-900">{rating}</span> 
              <span>Average Rating</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        
        <div className="p-6 overflow-y-auto custom-scrollbar flex-1 space-y-4">
          {reviews.map((review, idx) => (
            <div key={idx} className="p-4 bg-gray-50 rounded-xl border border-gray-100">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-gray-500">
                    <User size={14} />
                  </div>
                  <div>
                    <div className="font-semibold text-sm text-gray-900">{review.name}</div>
                    <div className="text-xs text-gray-500">{review.date}</div>
                  </div>
                </div>
                <div className="flex gap-0.5 text-[#689249]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={12} className={i < review.score ? "fill-current" : "text-gray-300"} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed mt-3">{review.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
