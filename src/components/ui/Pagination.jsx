import React from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  const maxVisible = 5;
  
  let start = Math.max(0, currentPage - Math.floor(maxVisible / 2));
  let end = Math.min(totalPages, start + maxVisible);
  
  if (end - start < maxVisible) {
    start = Math.max(0, end - maxVisible);
  }

  for (let i = start; i < end; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center gap-2 mt-12">
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 0}
        className={`
          p-3 rounded-xl font-semibold transition-all duration-300
          ${currentPage === 0 
            ? 'glass opacity-50 cursor-not-allowed' 
            : 'glass hover:bg-white/30'
          }
        `}
      >
        <ChevronLeft size={20} />
      </motion.button>
      
      <div className="flex gap-2">
        {pages.map((page) => (
          <motion.button
            key={page}
            whileHover={{ scale: 1.1, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onPageChange(page)}
            className={`
              w-12 h-12 rounded-xl font-semibold transition-all duration-300
              ${currentPage === page 
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg' 
                : 'glass hover:bg-white/30'
              }
            `}
          >
            {page + 1}
          </motion.button>
        ))}
      </div>
      
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        className={`
          p-3 rounded-xl font-semibold transition-all duration-300
          ${currentPage >= totalPages - 1
            ? 'glass opacity-50 cursor-not-allowed' 
            : 'glass hover:bg-white/30'
          }
        `}
      >
        <ChevronRight size={20} />
      </motion.button>
    </div>
  );
};

export default Pagination;