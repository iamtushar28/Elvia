import React from 'react';

const HighlightedText = ({ children }) => {
  return (
    <span className="bg-violet-200 font-bold px-1 rounded">
      {children}
    </span>
  );
};

export default HighlightedText;