import React from 'react';
import { categories } from '../data/mockData';
import { useNavigate } from 'react-router-dom';

export const StoryBubbles = () => {
  const navigate = useNavigate();
  
  return (
    <div className="flex gap-3 overflow-x-auto pb-4 px-6 no-scrollbar">
      {categories.map((category) => (
        <button
          key={category.id}
          onClick={() => navigate(`/category/${category.id}`)}
          className="flex flex-col items-center gap-2 flex-shrink-0"
        >
          <div
            className="w-16 h-16 rounded-full flex items-center justify-center text-2xl border-2 transition-all active:scale-95"
            style={{
              borderColor: category.color,
              background: `linear-gradient(135deg, ${category.color}20, ${category.color}10)`
            }}
          >
            {category.icon}
          </div>
          <span className="text-xs text-gray-400">{category.name}</span>
        </button>
      ))}
    </div>
  );
};
