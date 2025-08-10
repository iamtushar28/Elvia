import React from 'react';

const blobs = [
  { color: 'pink', width: 80, height: 90, top: '14%', left: '5%', delay: '0s' },
  { color: 'violet', width: 50, height: 50, top: '30%', left: '20%', delay: '1s' },
  { color: 'green', width: 60, height: 60, top: '60%', left: '10%', delay: '2s' },
  { color: 'purple', width: 60, height: 60, top: '10%', left: '70%', delay: '3s' },
  { color: 'yellow', width: 50, height: 50, top: '50%', left: '75%', delay: '4s' },
  { color: 'blue', width: 90, height: 80, top: '60%', left: '85%', delay: '4s' },
  { color: 'orange', width: 40, height: 40, top: '80%', left: '65%', delay: '4s' },
  { color: 'red', width: 40, height: 40, top: '80%', left: '25%', delay: '4s' },
];

const AnimatedBackground = () => {
  return (
    <div className="animated-bg">
      {blobs.map((blob, index) => (
        <div
          key={index}
          className={`blob ${blob.color}`}
          style={{
            width: `${blob.width}px`,
            height: `${blob.height}px`,
            top: blob.top,
            left: blob.left,
            animationDelay: blob.delay,
          }}
        />
      ))}
    </div>
  );
};

export default AnimatedBackground;
