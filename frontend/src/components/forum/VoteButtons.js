import React from 'react';

const VoteButtons = ({ upvotes, downvotes, userVote, onVote, orientation = 'horizontal' }) => {
  const isVertical = orientation === 'vertical';
  
  return (
    <div className={`flex ${isVertical ? 'flex-col' : 'flex-row'} items-center gap-2`}>
      <button
        type="button"
        onClick={() => onVote('upvote')}
        className={`flex items-center justify-center ${isVertical ? 'w-10 h-10' : 'w-8 h-8'} rounded-full ${
          userVote === 'upvote'
            ? 'bg-primary-100 text-primary-600'
            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
        } transition-colors`}
        aria-label="Upvote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
        </svg>
      </button>
      
      <span className={`font-medium ${isVertical ? 'text-lg' : 'text-sm'} ${
        upvotes > downvotes
          ? 'text-primary-600'
          : upvotes < downvotes
          ? 'text-red-600'
          : 'text-neutral-600'
      }`}>
        {upvotes - downvotes}
      </span>
      
      <button
        type="button"
        onClick={() => onVote('downvote')}
        className={`flex items-center justify-center ${isVertical ? 'w-10 h-10' : 'w-8 h-8'} rounded-full ${
          userVote === 'downvote'
            ? 'bg-red-100 text-red-600'
            : 'bg-neutral-100 text-neutral-500 hover:bg-neutral-200'
        } transition-colors`}
        aria-label="Downvote"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>
    </div>
  );
};

export default VoteButtons;
