import React from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import ValueProvider from './ValueProvider';

function MachineCircularProgressbar(props) {
  const { score, color } = props;

  const calcColor = (parent, start, end) => {
    const a = parent / 100;
    /* eslint-disable-next-line */
    const b = (end - start) * a;   
    return color;
  };

  return (
    <ValueProvider valueStart={0} valueEnd={score.replaceAll(",", "")}>
      {(value) => (
        <CircularProgressbar
          value={value}
          minValue={props.minReading}
          maxValue={props.maxReading}
          text={`${props.text}`}
          circleRatio={0.7}
          styles={{
            trail: {
              strokeLinecap: 'but',
              transform: 'rotate(-126deg)',
              transformOrigin: 'center center',
            },
            path: {
              strokeLinecap: 'butt',
              transform: 'rotate(-126deg)',
              transformOrigin: 'center center',
              stroke: calcColor(value, 0, 120),
            },
            text: {
              fill: '#003380',
              fontSize: '24px',
            },
          }}
          strokeWidth={9}
        />
      )}
    </ValueProvider>
  );
}

export default MachineCircularProgressbar;
