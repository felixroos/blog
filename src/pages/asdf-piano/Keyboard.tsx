import React, { useMemo } from 'react';

import { defaultOptions, renderSVG } from 'svg-piano';

export default function Keyboard({ options, onClick }: any) {
  options = useMemo(() => defaultOptions(options), [options]);
  // console.log(options);
  const { svg, children } = useMemo(() => renderSVG(options), [options]);

  const laneHeight = 20;
  const lanes = [
    /*{ range: ["C2", "C3"], fill: "purple" },
    { range: ["C2", "C3"], fill: "violet" }*/
  ];

  const height = svg.height + lanes.length * laneHeight + options.strokeWidth * 2;

  return useMemo(
    () => (
      <svg {...svg} height={height}>
        {children.map(({ polygon, circle, text, key }, index) => [
          polygon && <polygon {...polygon} key={'p' + index} onClick={() => onClick(key)} />,
          circle && <circle {...circle} key={'c' + index} />,
          text && (
            <text {...text} key={'t' + index}>
              {text.value}
            </text>
          ),
        ])}
      </svg>
    ),
    [svg, children, onClick, height]
  );
}
