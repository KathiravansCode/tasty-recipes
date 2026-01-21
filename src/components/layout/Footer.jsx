import React from 'react';
import { ChefHat } from 'lucide-react';

const Footer = () => (
  <footer className="bg-gray-800 text-white mt-12">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <ChefHat size={28} className="text-orange-500" />
            <span className="text-xl font-bold">TastyRecipes</span>
          </div>
          <p className="text-gray-400">Share and discover amazing recipes from around the world.</p>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Quick Links</h4>
          <ul className="space-y-2 text-gray-400">
            <li>About Us</li>
            <li>Contact</li>
            <li>Privacy Policy</li>
            <li>Terms of Service</li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-bold mb-4">Follow Us</h4>
          <p className="text-gray-400">Stay connected on social media</p>
        </div>
      </div>
      
      <div className="border-t border-gray-700 mt-8 pt-6 text-center text-gray-400">
        <p>&copy; 2025 TastyRecipes. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

export default Footer;