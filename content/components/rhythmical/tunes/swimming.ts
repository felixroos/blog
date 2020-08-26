export default {
  name: 'Swimming',
  composer: 'Koji Kondo',
  duration: 51,
  parallel: [
    {
      description: 'melody',
      velocity: 1,
      sequential: [
        { duration: 3, sequential: 'r' },
        [
          'A5',
          [{ sequential: ['F5'], duration: 2 }, 'C5'],
          [{ sequential: ['D5'], duration: 2 }, 'F5'],
          'F5'
        ],
        [
          [{ sequential: ['C5'], duration: 2 }, 'F5'],
          [{ sequential: ['F5'], duration: 2 }, 'C6'],
          'A5',
          'G5'
        ],
        [
          'A5',
          [{ sequential: ['F5'], duration: 2 }, 'C5'],
          [{ sequential: ['D5'], duration: 2 }, 'F5'],
          'F5'
        ],
        [
          [{ sequential: ['C5'], duration: 2 }, 'F5'],
          ['Bb5', 'A5', 'G5'],
          { sequential: ['F5'], duration: 2 }
        ],
        [
          'A5',
          [{ sequential: ['F5'], duration: 2 }, 'C5'],
          [{ sequential: ['D5'], duration: 2 }, 'F5'],
          'F5'
        ],
        [
          [{ sequential: ['C5'], duration: 2 }, 'F5'],
          [{ sequential: ['F5'], duration: 2 }, 'C6'],
          'A5',
          'G5'
        ],
        [
          'A5',
          [{ sequential: ['F5'], duration: 2 }, 'C5'],
          [{ sequential: ['D5'], duration: 2 }, 'F5'],
          'F5'
        ],
        [
          [{ sequential: ['C5'], duration: 2 }, 'F5'],
          ['Bb5', 'A5', 'G5'],
          { sequential: ['F5'], duration: 2 }
        ],
        ['A5', [{ sequential: ['F5'], duration: 2 }, 'C5'], 'A5', 'F5'],
        [
          'Ab5',
          [{ sequential: ['F5'], duration: 2 }, 'Ab5'],
          { sequential: ['G5'], duration: 2 }
        ],
        ['A5', [{ sequential: ['F5'], duration: 2 }, 'C5'], 'A5', 'F5'],
        [
          'Ab5',
          [{ sequential: ['F5'], duration: 2 }, 'C5'],
          { sequential: ['C6'], duration: 2 }
        ],
        [
          'A5',
          [{ sequential: ['F5'], duration: 2 }, 'C5'],
          [{ sequential: ['D5'], duration: 2 }, 'F5'],
          'F5'
        ],
        [
          [{ sequential: ['C5'], duration: 2 }, 'F5'],
          ['Bb5', 'A5', 'G5'],
          { sequential: ['F5'], duration: 2 }
        ]
      ]
    },
    {
      description: 'chords',
      velocity: 0.1,
      sequential: [
        [
          {
            duration: 1,
            parallel: ['F4', 'Bb4', 'D5']
          },
          {
            log: true,
            duration: 1,
            sequential: [
              {
                log: true,
                parallel: ['D4', 'G4', 'Bb4'],
                duration: 2
              },
              {
                parallel: ['Bb3', 'D4', 'F4'],
                duration: 1
              }
            ]
          },
          [
            { parallel: ['G3', 'C4', 'E4'], duration: 2 },
            [{ parallel: ['Ab3', 'F4'] }, { parallel: ['A3', 'Gb4'] }]
          ],
          {
            parallel: ['Bb3', 'E4', 'G4']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'Db3']
          },
          {
            parallel: ['F3', 'Bb3', 'Db3']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['F3', 'B3', 'D3']
          },
          {
            parallel: ['F3', 'B3', 'D3']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['F3', 'B3', 'D3']
          },
          {
            parallel: ['F3', 'B3', 'D3']
          }
        ],
        [
          'r',
          {
            parallel: ['A3', 'C4', 'E4']
          },
          {
            parallel: ['A3', 'C4', 'E4']
          },
          'r',
          {
            parallel: ['Ab3', 'C4', 'Eb4']
          },
          {
            parallel: ['Ab3', 'C4', 'Eb4']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['G3', 'C4', 'E4']
          },
          {
            parallel: ['A3', 'C4', 'E4']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['F3', 'B3', 'D3']
          },
          {
            parallel: ['F3', 'B3', 'D3']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'Bb3', 'D4']
          },
          {
            parallel: ['F3', 'Bb3', 'D4']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'C4']
          },
          {
            parallel: ['F3', 'Bb3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['F3', 'B3', 'D3']
          },
          {
            parallel: ['F3', 'B3', 'D3']
          }
        ],
        [
          'r',
          {
            parallel: ['A3', 'C4', 'E4']
          },
          {
            parallel: ['A3', 'C4', 'E4']
          },
          'r',
          {
            parallel: ['Ab3', 'C4', 'Eb4']
          },
          {
            parallel: ['Ab3', 'C4', 'Eb4']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['G3', 'C4', 'E4']
          },
          {
            parallel: ['A3', 'C4', 'E4']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['F3', 'B3', 'D3']
          },
          {
            parallel: ['F3', 'B3', 'D3']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'Bb3', 'D4']
          },
          {
            parallel: ['F3', 'Bb3', 'D4']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'C4']
          },
          {
            parallel: ['F3', 'Bb3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          }
        ],
        [
          'r',
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          'r',
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          'r',
          {
            parallel: ['A3', 'C4', 'F4']
          },
          {
            parallel: ['A3', 'C4', 'F4']
          },
          'r',
          {
            parallel: ['A3', 'C4', 'F4']
          },
          {
            parallel: ['A3', 'C4', 'F4']
          }
        ],
        [
          'r',
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          'r',
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          'r',
          {
            parallel: ['G3', 'Bb3', 'F4']
          },
          {
            parallel: ['G3', 'Bb3', 'F4']
          },
          'r',
          {
            parallel: ['G3', 'Bb3', 'E4']
          },
          {
            parallel: ['G3', 'Bb3', 'E4']
          }
        ],
        [
          'r',
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          'r',
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          {
            parallel: ['Bb3', 'D3', 'F4']
          },
          'r',
          {
            parallel: ['A3', 'C4', 'F4']
          },
          {
            parallel: ['A3', 'C4', 'F4']
          },
          'r',
          {
            parallel: ['A3', 'C4', 'F4']
          },
          {
            parallel: ['A3', 'C4', 'F4']
          }
        ],
        [
          'r',
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          'r',
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          {
            parallel: ['Ab3', 'B3', 'F4']
          },
          'r',
          {
            parallel: ['G3', 'Bb3', 'F4']
          },
          {
            parallel: ['G3', 'Bb3', 'F4']
          },
          'r',
          {
            parallel: ['G3', 'Bb3', 'E4']
          },
          {
            parallel: ['G3', 'Bb3', 'E4']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C3']
          },
          {
            parallel: ['F3', 'A3', 'C3']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          {
            parallel: ['F3', 'Bb3', 'D3']
          },
          'r',
          {
            parallel: ['F3', 'B3', 'D3']
          },
          {
            parallel: ['F3', 'B3', 'D3']
          }
        ],
        [
          'r',
          {
            parallel: ['F3', 'Bb3', 'D4']
          },
          {
            parallel: ['F3', 'Bb3', 'D4']
          },
          'r',
          {
            parallel: ['F3', 'Bb3', 'C4']
          },
          {
            parallel: ['F3', 'Bb3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          },
          'r',
          {
            parallel: ['F3', 'A3', 'C4']
          },
          {
            parallel: ['F3', 'A3', 'C4']
          }
        ]
      ]
    },
    {
      description: 'bass',
      sequential: [
        ["G3", "G3", "C3", "E3"],
        ["F2", "D2", "G2", "C2"],
        ["F2", "D2", "G2", "C2"],
        ["F2", "A2", "Bb2", "B2"],
        ["A2", "Ab2", "G2", "C2"],
        ["F2", "A2", "Bb2", "B2"],
        ["G2", "C2", "F2", "F2"],
        ["F2", "A2", "Bb2", "B2"],
        ["A2", "Ab2", "G2", "C2"],
        ["F2", "A2", "Bb2", "B2"],
        ["G2", "C2", "F2", "F2"],
        ["Bb2", "Bb2", "A2", "A2"],
        ["Ab2", "Ab2", "G2", ["C2", "D2", "E2"]],
        ["Bb2", "Bb2", "A2", "A2"],
        ["Ab2", "Ab2", "G2", ["C2", "D2", "E2"]],
        ["F2", "A2", "Bb2", "B2"],
        ["G2", "C2", "F2", "F2"]
      ]
    }
  ]
}