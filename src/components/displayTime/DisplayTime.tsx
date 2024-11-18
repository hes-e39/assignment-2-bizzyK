//DisplayTime.tsx

import React from 'react';

const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
};

interface DisplayTimeProps {
    timeInSeconds: number; // Updated to be more descriptive
}

const DisplayTime: React.FC<DisplayTimeProps> = ({ timeInSeconds }) => (
    <div className="time-display">{formatTime(timeInSeconds)}</div>
);

export default DisplayTime;
