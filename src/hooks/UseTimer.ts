import {useState, useEffect} from "react";

interface UseTimerParams {
    type: "stopwatch" | "countdown" | "xy" | "tabata";
    startTime?: number;
    workTime?: number;
    restTime?: number;
    roundTime?: number;
    rounds?: number;
}

interface UseTimerReturn {
    time: number;
    isActive: boolean;
    isPaused: boolean;
    isWorkInterval: boolean;
    currentRound: number;
    start: () => void;
    pause: () => void;
    reset: () => void;
    fastForward: () => void;
}

const useTimer = ({
                      type,
                      startTime = 0,
                      workTime = 20,
                      restTime = 10,
                      roundTime = 60,
                      rounds = 1,
                  }: UseTimerParams): UseTimerReturn => {
    const [time, setTime] = useState(type === "countdown" ? startTime : 0);
    const [isActive, setIsActive] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [isWorkInterval, setIsWorkInterval] = useState(true); // Tabata-specific
    const [currentRound, setCurrentRound] = useState(1);

    useEffect(() => {
        let timer: NodeJS.Timeout | null = null;

        if (isActive && !isPaused) {
            timer = setInterval(() => {
                setTime((prevTime) => (type === "stopwatch" ? prevTime + 1 : prevTime - 1));
            }, 1000);
        }

        if (time === 0 && isActive) {
            handleEndOfInterval();
        }

        return () => clearInterval(timer!);
    }, [time, isActive, isPaused]);

    const handleEndOfInterval = () => {
        if (type === "countdown") {
            setIsActive(false);
        } else if (type === "xy") {
            if (currentRound < rounds) {
                setCurrentRound((prev) => prev + 1);
                setTime(roundTime);
            } else {
                setIsActive(false);
                setTime(0);
            }
        } else if (type === "tabata") {
            if (currentRound === rounds && !isWorkInterval) {
                setIsActive(false);
            } else if (isWorkInterval) {
                setTime(restTime);
                setIsWorkInterval(false);
            } else {
                setTime(workTime);
                setIsWorkInterval(true);
                setCurrentRound((prev) => prev + 1);
            }
        }
    };

    return {
        time,
        isActive,
        isPaused,
        isWorkInterval,
        currentRound,
        start: () => setIsActive(true),
        pause: () => setIsPaused((prev) => !prev),
        reset: () => {
            setIsActive(false);
            setIsPaused(false);
            setCurrentRound(1);
            setTime(type === "countdown" ? startTime : roundTime);
        },
        fastForward: () => {
            setCurrentRound(rounds);
            setTime(0);
            setIsActive(false);
        },
    };
};

export default useTimer;
