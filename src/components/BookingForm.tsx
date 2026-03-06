import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPinIcon, CalendarIcon, ArrowRightIcon } from 'lucide-react';
export function BookingForm() {
  const [activeTab, setActiveTab] = useState<'point' | 'hourly'>('point');
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 20
      }}
      animate={{
        opacity: 1,
        y: 0
      }}
      transition={{
        duration: 0.8,
        delay: 0.4
      }}
      className="bg-white/80 dark:bg-[#1E1E1E]/85 backdrop-blur-md rounded-lg shadow-xl border border-white/20 dark:border-white/10 overflow-hidden w-full max-w-md mx-auto relative z-10">

      {/* Tabs */}
      <div className="flex border-b border-border relative">
        <button
          onClick={() => setActiveTab('point')}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'point' ? 'text-gold' : 'text-text-secondary hover:text-text-primary'}`}>

          Point to Point
          {activeTab === 'point' &&
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />

          }
        </button>
        <button
          onClick={() => setActiveTab('hourly')}
          className={`flex-1 py-4 text-sm font-medium transition-colors relative ${activeTab === 'hourly' ? 'text-gold' : 'text-text-secondary hover:text-text-primary'}`}>

          By the Hour
          {activeTab === 'hourly' &&
            <motion.div
              layoutId="activeTab"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-gold" />

          }
        </button>
      </div>

      {/* Form Content */}
      <div className="p-5 flex flex-col gap-4">
        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#1E1E1E] px-1 text-xs font-medium text-text-secondary z-10">
            Origin
          </label>
          <div className="relative flex items-center">
            <MapPinIcon className="absolute left-3 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Pickup address"
              className="w-full bg-transparent border border-border rounded-sm py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />

          </div>
        </div>

        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#1E1E1E] px-1 text-xs font-medium text-text-secondary z-10">
            Destination
          </label>
          <div className="relative flex items-center">
            <MapPinIcon className="absolute left-3 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Destination address"
              className="w-full bg-transparent border border-border rounded-sm py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />

          </div>
        </div>

        <div className="relative">
          <label className="absolute -top-2.5 left-3 bg-white dark:bg-[#1E1E1E] px-1 text-xs font-medium text-text-secondary z-10">
            Date & Time
          </label>
          <div className="relative flex items-center">
            <CalendarIcon className="absolute left-3 w-5 h-5 text-text-secondary" />
            <input
              type="text"
              placeholder="Select date and time"
              className="w-full bg-transparent border border-border rounded-sm py-3 pl-10 pr-4 text-text-primary focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all" />

          </div>
        </div>

        <div className="flex items-center gap-2 mt-1">
          <input
            type="checkbox"
            id="returnTrip"
            className="w-4 h-4 rounded-sm border-border text-gold focus:ring-gold bg-transparent" />

          <label
            htmlFor="returnTrip"
            className="text-sm text-text-secondary cursor-pointer">

            Add return trip
          </label>
        </div>

        <button className="w-full mt-2 py-3 bg-gold hover:bg-gold-hover text-white font-medium rounded-sm transition-colors flex items-center justify-center gap-2 group animate-shimmer">
          GET PRICES
          <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>);

}