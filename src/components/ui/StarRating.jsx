import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const StarRating = ({ rating, onRatingChange, readonly = false, size = 24 }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          disabled={readonly}
          onClick={() => !readonly && onRatingChange(star)}
          onMouseEnter={() => !readonly && setHover(star)}
          onMouseLeave={() => !readonly && setHover(0)}
          whileHover={!readonly ? { scale: 1.2, rotate: 10 } : {}}
          whileTap={!readonly ? { scale: 0.9 } : {}}
          className={`${readonly ? 'cursor-default' : 'cursor-pointer'} transition-all duration-200`}
        >
          <motion.div
            animate={{
              scale: (hover || rating) >= star ? [1, 1.2, 1] : 1,
            }}
            transition={{ duration: 0.3 }}
          >
            <Star
              size={size}
              className={`transition-all duration-200 ${
                (hover || rating) >= star 
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-lg' 
                  : 'text-gray-300'
              }`}
            />
          </motion.div>
        </motion.button>
      ))}
    </div>
  );
};

export default StarRating;