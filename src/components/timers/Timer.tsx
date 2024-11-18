// Timer.tsx
import type React from 'react';
import useTimer from '../../hooks/UseTimer';
import Button from '../button/Button';
import DisplayRounds from '../displayRounds/DisplayRounds';
import DisplayTime from '../displayTime/DisplayTime';

interface TimerProps {
    type: 'stopwatch' | 'countdown' | 'xy' | 'tabata';
    startTime?: number;
    workTime?: number;
    restTime?: number;
    roundTime?: number;
    rounds?: number;
}

const Timer: React.FC<TimerProps> = ({ type, startTime = 0, workTime = 20, restTime = 10, roundTime = 60, rounds = 1 }) => {
    const { time, isActive, isPaused, isWorkInterval, currentRound, start, pause, reset, fastForward } = useTimer({ type, startTime, workTime, restTime, roundTime, rounds });

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
            <h2>{title}</h2>
            {type === 'tabata' || type === 'xy' ? <DisplayRounds currentRound={currentRound} totalRounds={rounds} /> : null}
            {type === 'tabata' && <div className={`interval-display ${isWorkInterval ? 'work' : 'rest'}`}>{isWorkInterval ? 'Work' : 'Rest'} Interval</div>}
            <DisplayTime timeInSeconds={time} />
            <div className="controls">
                <Button onClick={start} label="Start" disabled={isActive && !isPaused} />
                <Button onClick={pause} label={isPaused ? 'Resume' : 'Pause'} disabled={!isActive} />
                <Button onClick={reset} label="Reset" />
                <Button onClick={fastForward} label="Fast Forward" />
            </div>
        </div>
    );
};

export default Timer;
