// DocumentationView.tsx

import Button from '../components/button/Button';
import DisplayRounds from '../components/displayRounds/DisplayRounds';
import DisplayTime from '../components/displayTime/DisplayTime';
import DocumentComponent from '../components/documentation/DocumentComponent';
import Timer from '../components/timers/Timer';

const DocumentationView = () => {
    return (
        <div className="documentation-container">
            <DocumentComponent
                title="Timer"
                component={<Timer id="mock-id" name="Mock Timer" type="stopwatch" duration={10} state="not running" addedAt={Date.now()} isActive={false} />}
                propDocs={[
                    {
                        prop: 'type',
                        description: 'Defines the type of timer: stopwatch, countdown, xy, or tabata.',
                        type: "'stopwatch' | 'countdown' | 'xy' | 'tabata'",
                        defaultValue: "'stopwatch'",
                    },
                    {
                        prop: 'startTime',
                        description: 'Initial time in seconds for the countdown timer.',
                        type: 'number',
                        defaultValue: '0',
                    },
                    {
                        prop: 'workTime',
                        description: 'Work interval time in seconds for Tabata timer.',
                        type: 'number',
                        defaultValue: '20',
                    },
                    {
                        prop: 'restTime',
                        description: 'Rest interval time in seconds for Tabata timer.',
                        type: 'number',
                        defaultValue: '10',
                    },
                    {
                        prop: 'roundTime',
                        description: 'Time per round in seconds for XY timer.',
                        type: 'number',
                        defaultValue: '60',
                    },
                    {
                        prop: 'rounds',
                        description: 'Total number of rounds for XY and Tabata timers.',
                        type: 'number',
                        defaultValue: '1',
                    },
                ]}
            />

            {/* Button Documentation */}
            <DocumentComponent
                title="Button"
                component={<Button label="Sample Button" onClick={() => alert('Button clicked!')} />}
                propDocs={[
                    { prop: 'label', description: 'Text displayed on the button', type: 'string', defaultValue: "''" },
                    {
                        prop: 'onClick',
                        description: 'Function called when the button is clicked',
                        type: 'function',
                        defaultValue: 'undefined',
                    },
                    {
                        prop: 'disabled',
                        description: 'Disables the button when true',
                        type: 'boolean',
                        defaultValue: 'false',
                    },
                ]}
            />

            {/* DisplayTime Documentation */}
            <DocumentComponent
                title="DisplayTime"
                component={<DisplayTime timeInSeconds={120} />}
                propDocs={[
                    {
                        prop: 'time',
                        description: 'Time in seconds to display in HH:MM:SS format',
                        type: 'number',
                        defaultValue: '0',
                    },
                ]}
            />

            {/* DisplayRounds Documentation */}
            <DocumentComponent
                title="DisplayRounds"
                component={<DisplayRounds currentRound={1} totalRounds={10} />}
                propDocs={[
                    { prop: 'currentRound', description: 'The current round number', type: 'number', defaultValue: '1' },
                    { prop: 'totalRounds', description: 'The total number of rounds', type: 'number', defaultValue: '1' },
                ]}
            />
        </div>
    );
};

export default DocumentationView;
