import React from 'react';
import { motion } from 'framer-motion';
import { ChefHat, Heart } from 'lucide-react';

const Footer = () => (
  <footer className="relative bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 text-white mt-20 overflow-hidden">
    {/* Animated Background */}
    <div className="absolute inset-0 opacity-10">
      <motion.div
        animate={{ 
          x: [0, 100, 0],
          y: [0, 50, 0],
        }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
        className="absolute top-0 left-0 w-96 h-96 bg-purple-600 rounded-full blur-3xl"
      />
      <motion.div
        animate={{ 
          x: [0, -100, 0],
          y: [0, -50, 0],
        }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        className="absolute bottom-0 right-0 w-96 h-96 bg-pink-600 rounded-full blur-3xl"
      />
    </div>

    <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <div className="flex items-center gap-3 mb-6">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl blur-lg opacity-50" />
              <div className="relative bg-gradient-to-br from-purple-600 to-pink-600 p-3 rounded-2xl">
                <ChefHat size={32} className="text-white" />
              </div>
            </motion.div>
            <span className="text-2xl font-bold">TastyRecipes</span>
          </div>
          <p className="text-gray-300 leading-relaxed mb-6">
            Share and discover amazing recipes from passionate cooks around the world. Join our growing community today!
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-400">
            <span>Made with</span>
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity }}
            >
              <Heart size={16} className="fill-red-500 text-red-500" />
            </motion.div>
            <span>by food lovers</span>
          </div>
        </motion.div>
        
        {/* Quick Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.1 }}
        >
          <h4 className="font-bold text-lg mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Quick Links
          </h4>
          <ul className="space-y-3">
            {['About Us', 'Contact', 'Privacy Policy', 'Terms of Service', 'Help Center'].map((item, i) => (
              <motion.li
                key={i}
                whileHover={{ x: 5 }}
                className="text-gray-300 hover:text-white transition-all cursor-pointer flex items-center gap-2"
              >
                <span className="text-purple-400">→</span>
                {item}
              </motion.li>
            ))}
          </ul>
        </motion.div>
        
        {/* Community */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <h4 className="font-bold text-lg mb-6 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Connect With Us
          </h4>
          <p className="text-gray-300 mb-6">Join our vibrant community on social media</p>
          
          {/* Social Icons */}
          <div className="flex gap-4">
            {['🌐', '📱', '💬', '📸'].map((emoji, i) => (
              <motion.button
                key={i}
                whileHover={{ y: -5, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center text-2xl hover:bg-white/20 transition-all border border-white/10"
              >
                {emoji}
              </motion.button>
            ))}
          </div>
          
          {/* Newsletter */}
          <div className="mt-8">
            <p className="text-sm text-gray-400 mb-3">Subscribe to our newsletter</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white placeholder-gray-400 outline-none focus:border-purple-500 transition-all"
              />
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                →
              </motion.button>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Bottom Bar */}
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="border-t border-white/10 mt-12 pt-8 text-center"
      >
        <p className="text-gray-400 text-sm">
          © 2025 TastyRecipes. All rights reserved. Crafted with passion for food enthusiasts.
        </p>
      </motion.div>
    </div>

    {/* Decorative Elements */}
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
      className="absolute -bottom-20 -left-20 w-40 h-40 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"
    />
    <motion.div
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute -top-20 -right-20 w-60 h-60 bg-pink-600/10 rounded-full blur-3xl pointer-events-none"
    />
  </footer>
);

export default Footer;