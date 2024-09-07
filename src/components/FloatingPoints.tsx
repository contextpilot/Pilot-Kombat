import React from 'react';

interface FloatingPointsProps {
  clicks: { id: number, x: number, y: number }[];
  pointsToAdd: number;
  onAnimationEnd: (id: number) => void;
}

const FloatingPoints: React.FC<FloatingPointsProps> = ({ clicks, pointsToAdd, onAnimationEnd }) => (
  <>
    {clicks.map((click) => (
      <div
        key={click.id}
        className="absolute text-5xl font-bold opacity-0 text-white pointer-events-none"
        style={{
          top: `${click.y - 42}px`,
          left: `${click.x - 28}px`,
          animation: `float 1s ease-out`
        }}
        onAnimationEnd={() => onAnimationEnd(click.id)}
      >
        {pointsToAdd}
      </div>
    ))}
  </>
);

export default FloatingPoints;