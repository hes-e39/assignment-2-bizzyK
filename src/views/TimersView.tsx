// TimersView.tsx

import { useTimerContext } from "../context/TimerContext";
import Timer from "../components/timers/Timer";

const TimersView = () => {
    const { state } = useTimerContext();

    return (
        <div>
            {state.timers.length === 0 ? (
                <p className="center-text">No timers configured. Add a timer to get started.</p>
            ) : (
                <div className="timers-container">
                    {state.timers.map((timer) => (
                        <Timer key={timer.id} {...timer} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default TimersView;
