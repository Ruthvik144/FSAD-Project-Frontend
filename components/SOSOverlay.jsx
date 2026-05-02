import React from 'react';
import { X, ShieldAlert, Phone, MapPin } from 'lucide-react';
const SOSOverlay = ({
  onClose
}) => <div className="fixed inset-0 bg-red-600/90 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl text-center relative">
      <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-gray-800">
        <X size={24} />
      </button>
      <ShieldAlert size={64} className="mx-auto text-red-600 mb-4 animate-pulse" />
      <h2 className="text-2xl font-bold text-red-700 mb-2">EMERGENCY ASSISTANCE</h2>
      <p className="text-gray-600 mb-6">Help is on the way. Please stay calm.</p>
      
      <div className="space-y-3">
        <button className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          <Phone size={20} /> Call Campus Security
        </button>
        <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          <Phone size={20} /> Call Ambulance (102)
        </button>
        <button className="w-full border-2 border-gray-300 hover:bg-gray-50 text-gray-700 font-bold py-3 rounded-lg flex items-center justify-center gap-2">
          <MapPin size={20} /> View Nearest Safe Zone
        </button>
      </div>
    </div>
  </div>;
export default SOSOverlay;
