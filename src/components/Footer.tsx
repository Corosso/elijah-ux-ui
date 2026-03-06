import React from 'react';
import {
  InstagramIcon,
  TwitterIcon,
  LinkedinIcon,
  FacebookIcon } from
'lucide-react';
export function Footer() {
  return (
    <footer className="bg-[#0A0A0A] pt-20 pb-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 mb-16">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <img
                src="/logo.png"
                alt="Elijah Logo"
                className="h-12 w-auto object-contain" />

              <span className="font-serif text-2xl tracking-[0.2em] text-[#F5F0E8] uppercase">
                Elijah
              </span>
            </div>
            <p className="text-[#9A9590] text-sm leading-relaxed max-w-sm mb-8">
              Colombia's most exclusive private chauffeur service.
              Redefining luxury, privacy and comfort on every journey.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#2A2520] flex items-center justify-center text-[#9A9590] hover:text-gold hover:border-gold transition-colors">

                <InstagramIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#2A2520] flex items-center justify-center text-[#9A9590] hover:text-gold hover:border-gold transition-colors">

                <TwitterIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#2A2520] flex items-center justify-center text-[#9A9590] hover:text-gold hover:border-gold transition-colors">

                <LinkedinIcon className="w-4 h-4" />
              </a>
              <a
                href="#"
                className="w-10 h-10 rounded-full border border-[#2A2520] flex items-center justify-center text-[#9A9590] hover:text-gold hover:border-gold transition-colors">

                <FacebookIcon className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Links Columns */}
          <div>
            <h4 className="text-[#F5F0E8] font-medium mb-6 uppercase tracking-wider text-sm">
              Services
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Point to Point
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  By the Hour
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Airport
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Events
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F5F0E8] font-medium mb-6 uppercase tracking-wider text-sm">
              Cities
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Bogotá
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Medellín
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Cartagena
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Cali
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#F5F0E8] font-medium mb-6 uppercase tracking-wider text-sm">
              Company
            </h4>
            <ul className="space-y-4">
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  About Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Careers
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Press
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="text-[#9A9590] hover:text-gold text-sm transition-colors">

                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-[#2A2520] flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[#9A9590] text-sm">
            © 2026 Elijah. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a
              href="#"
              className="text-[#9A9590] hover:text-gold text-sm transition-colors">

              Terms
            </a>
            <a
              href="#"
              className="text-[#9A9590] hover:text-gold text-sm transition-colors">

              Privacy
            </a>
            <a
              href="#"
              className="text-[#9A9590] hover:text-gold text-sm transition-colors">

              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>);

}