// Timer.tsx

import React from 'react';
import useTimer from '../../hooks/UseTimer';
import DisplayRounds from '../displayRounds/DisplayRounds';
import DisplayTime from '../displayTime/DisplayTime';

interface TimerProps {
    id: string;
    name: string;
    type: 'stopwatch' | 'countdown' | 'xy' | 'tabata';
    startTime?: number;
    workTime?: number;
    restTime?: number;
    roundTime?: number;
    rounds?: number;
    duration: number;
    state: 'not running' | 'running' | 'completed' | 'paused';
    addedAt: number;
    isActive: boolean;
}

const Timer: React.FC<TimerProps> = ({ name, type, startTime = 0, workTime = 20, restTime = 10, roundTime = 60, rounds = 1, isActive }) => {
    const { time, isWorkInterval, currentRound, start, pause } = useTimer({
        type,
        startTime,
        workTime,
        restTime,
        roundTime,
        rounds,
    });

    React.useEffect(() => {
        if (isActive) {
            start(); // Start the timer only if `isActive` is true
        } else if (isActive === false) {
            pause(); // Pause the timer if `isActive` is explicitly false
        }
    }, [isActive, start, pause]);

    const title = {
        stopwatch: 'Stopwatch',
        countdown: 'Countdown Timer',
        xy: 'XY Timer',
        tabata: 'Tabata Timer',
    }[type];

    if (!title) {
        return <div>Invalid timer type.</div>;
    }

    return (
        <div className="timer-container">
            <h2>{name}</h2>
            <h3>{title}</h3>
            {(type === 'tabata' || type === 'xy') && <DisplayRounds currentRound={currentRound} totalRounds={rounds} />}
            {type === 'tabata' && <div className={`interval-display ${isWorkInterval ? 'work' : 'rest'}`}>{isWorkInterval ? 'Work' : 'Rest'} Interval</div>}
            <DisplayTime timeInSeconds={time} />
        </div>
    );
};

export default Timer;
