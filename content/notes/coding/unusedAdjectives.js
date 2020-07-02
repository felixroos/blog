const fetch = require('node-fetch');

const startsWith = 'm'; // n p m
const hasType = 'adv'; // adj, adv

function wordsWith(letter) {
  return fetch(
    `https://api.datamuse.com/words?md=p&sp=${letter}*`
  ).then((res) => res.json());
}

function getExpansions() {
  return fetch(
    'https://raw.githubusercontent.com/npm/npm-expansions/master/expansions.txt'
  )
    .then((res) => res.text())
    .then((exp) => exp.split('\n'));
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}

async function randomUnusedExpansion() {
  const expansions = await getExpansions();
  const unused = [
    await wordsWith('n'),
    await wordsWith('p'),
    await wordsWith('m')
  ].map((words) =>
    words
      .filter(
        ({ word }) =>
          !expansions.find((expansion) =>
            expansion.toLowerCase().includes(word.toLowerCase())
          )
      )
      .map(({ word }) => word)
  );
  const random = Array.from({ length: 100 }, () =>
    unused.map(randomElement).join(' ')
  ).join('\n');
  console.log(random);
  return random;
}
randomUnusedExpansion();

// poignant manoeuvre
// noir plaque macabre
// nonpareil posture massage
// nightstand
/*
[ { word: 'nonplussed', score: 1299, tags: [ 'adj' ] },
  { word: 'notional', score: 1235, tags: [ 'adj' ] },
  { word: 'normative', score: 1183, tags: [ 'adj' ] },
  { word: 'nuts', score: 1162, tags: [ 'adj' ] },
  { word: 'nonpareil', score: 1151, tags: [ 'n', 'adj' ] },
  { word: 'nugatory', score: 1023, tags: [ 'adj' ] },
  { word: 'noisome', score: 1011, tags: [ 'adj' ] } ]


  */

/*
  nouns
  [ { word: 'narrative', score: 2128, tags: [ 'n' ] },
  { word: 'notch', score: 2107, tags: [ 'n' ] },
  { word: 'nudge', score: 2066, tags: [ 'n', 'v' ] },
  { word: 'non sequitur', score: 1962, tags: [ 'n' ] },
  { word: 'nadir', score: 1955, tags: [ 'n' ] },
  { word: 'nurse', score: 1934, tags: [ 'n' ] },
  { word: 'nuisance', score: 1805, tags: [ 'n' ] },
  { word: 'notion', score: 1739, tags: [ 'n' ] },
  { word: 'nova', score: 1679, tags: [ 'n', 'prop' ] },
  { word: 'nurture', score: 1672, tags: [ 'v', 'n' ] },
  { word: 'nostalgia', score: 1611, tags: [ 'n' ] },
  { word: 'noir', score: 1373, tags: [ 'n' ] },
  { word: 'nonce', score: 1359, tags: [ 'n' ] },
  { word: 'narcissism', score: 1328, tags: [ 'n' ] },
  { word: 'nutrition', score: 1282, tags: [ 'n' ] },
  { word: 'notation', score: 1273, tags: [ 'n' ] },
  { word: 'nightstand', score: 1252, tags: [ 'n' ] },
  { word: 'none', score: 1225, tags: [ 'n' ] },
  { word: 'nonpareil', score: 1151, tags: [ 'n', 'adj' ] },
  { word: 'nook', score: 1076, tags: [ 'n' ] },
  { word: 'nostrum', score: 1038, tags: [ 'n' ] },
  { word: 'nudism', score: 1038, tags: [ 'n' ] },
  { word: 'noggin', score: 1001, tags: [ 'n' ] } ]
  */

/*
  adv
  [ { word: 'nonetheless', score: 1401, tags: [ 'adv' ] },
  { word: 'nowadays', score: 1096, tags: [ 'adv' ] } ]
  */

/*
  n
  [ { word: 'potential', score: 3009, tags: [ 'adj', 'n' ] },
  { word: 'policy', score: 2643, tags: [ 'n' ] },
  { word: 'platform', score: 2469, tags: [ 'n' ] },
  { word: 'polemic', score: 2322, tags: [ 'n' ] },
  { word: 'plot', score: 2288, tags: [ 'n' ] },
  { word: 'plain', score: 2087, tags: [ 'adj', 'n' ] },
  { word: 'politics', score: 2075, tags: [ 'n' ] },
  { word: 'plague', score: 2019, tags: [ 'n' ] },
  { word: 'plight', score: 1889, tags: [ 'n' ] },
  { word: 'postulate', score: 1865, tags: [ 'n', 'v' ] },
  { word: 'powder', score: 1856, tags: [ 'n' ] },
  { word: 'poppy', score: 1786, tags: [ 'n' ] },
  { word: 'portfolio', score: 1776, tags: [ 'n' ] },
  { word: 'platitude', score: 1771, tags: [ 'n' ] },
  { word: 'plaque', score: 1755, tags: [ 'n' ] },
  { word: 'plagiarism', score: 1743, tags: [ 'n' ] },
  { word: 'poise', score: 1727, tags: [ 'n' ] },
  { word: 'police', score: 1663, tags: [ 'n' ] },
  { word: 'player', score: 1636, tags: [ 'n' ] },
  { word: 'porn', score: 1628, tags: [ 'n' ] },
  { word: 'pleasure', score: 1601, tags: [ 'n' ] },
  { word: 'portal', score: 1490, tags: [ 'n' ] },
  { word: 'posterity', score: 1426, tags: [ 'n' ] },
  { word: 'populist', score: 1376, tags: [ 'n' ] },
  { word: 'pouch', score: 1366, tags: [ 'n' ] },
  { word: 'plexus', score: 1331, tags: [ 'n' ] },
  { word: 'plow', score: 1325, tags: [ 'n', 'v' ] },
  { word: 'possession', score: 1317, tags: [ 'n' ] },
  { word: 'posture', score: 1279, tags: [ 'n' ] },
  { word: 'poem', score: 1256, tags: [ 'n' ] },
  { word: 'plateau', score: 1246, tags: [ 'n' ] },
  { word: 'pontificate', score: 1229, tags: [ 'n' ] },
  { word: 'plaintiff', score: 1215, tags: [ 'n' ] },
  { word: 'porter', score: 1195, tags: [ 'n' ] },
  { word: 'plinth', score: 1189, tags: [ 'n' ] },
  { word: 'polymath', score: 1184, tags: [ 'n' ] },
  { word: 'poltroon', score: 1180, tags: [ 'n' ] },
  { word: 'poverty', score: 1177, tags: [ 'n' ] },
  { word: 'posse', score: 1152, tags: [ 'n' ] },
  { word: 'population', score: 1148, tags: [ 'n' ] },
  { word: 'portrait', score: 1142, tags: [ 'n' ] } ]
  */

/*
  adj with p
  [ { word: 'poignant', score: 3372, tags: [ 'adj' ] },
  { word: 'potential', score: 3009, tags: [ 'adj', 'n' ] },
  { word: 'plain', score: 2087, tags: [ 'adj', 'n' ] },
  { word: 'positive', score: 1965, tags: [ 'adj' ] },
  { word: 'plausible', score: 1942, tags: [ 'adj' ] },
  { word: 'pompous', score: 1619, tags: [ 'adj' ] },
  { word: 'plenary', score: 1533, tags: [ 'adj' ] },
  { word: 'poised', score: 1342, tags: [ 'adj' ] },
  { word: 'placid', score: 1304, tags: [ 'adj' ] },
  { word: 'posh', score: 1300, tags: [ 'adj' ] } ]
  */

/*

  [ { word: 'mawl', score: 2188, tags: [ 'n' ] },
  { word: 'mantle', score: 2132, tags: [ 'n' ] },
  { word: 'maneuver', score: 2035, tags: [ 'n', 'v' ] },
  { word: 'marshal', score: 1926, tags: [ 'n' ] },
  { word: 'manifold', score: 1683, tags: [ 'adj', 'n' ] },
  { word: 'martyr', score: 1675, tags: [ 'n' ] },
  { word: 'makeup', score: 1670, tags: [ 'n' ] },
  { word: 'malice', score: 1641, tags: [ 'n' ] },
  { word: 'magnitude', score: 1561, tags: [ 'n' ] },
  { word: 'mary', score: 1555, tags: [ 'n', 'prop' ] },
  { word: 'malfeasance', score: 1530, tags: [ 'n' ] },
  { word: 'marquee', score: 1379, tags: [ 'n' ] },
  { word: 'making', score: 1363, tags: [ 'n' ] },
  { word: 'majority', score: 1295, tags: [ 'n' ] },
  { word: 'maple', score: 1275, tags: [ 'n' ] },
  { word: 'marrow', score: 1270, tags: [ 'n' ] },
  { word: 'maroon', score: 1225, tags: [ 'n', 'adj' ] },
  { word: 'mainstream', score: 1196, tags: [ 'n' ] },
  { word: 'massage', score: 1158, tags: [ 'n' ] },
  { word: 'maiden', score: 1145, tags: [ 'n' ] },
  { word: 'mason', score: 1109, tags: [ 'n', 'prop' ] },
  { word: 'maw', score: 1074, tags: [ 'n' ] },
  { word: 'manoeuvre', score: 1052, tags: [ 'n', 'v' ] },
  { word: 'male', score: 1047, tags: [ 'adj', 'n' ] },
  { word: 'magnum', score: 1034, tags: [ 'n' ] },
  { word: 'malady', score: 1017, tags: [ 'n' ] } ]
  */

/*
  [ { word: 'malevolent', score: 4453, tags: [ 'adj' ] },
  { word: 'mature', score: 1890, tags: [ 'adj', 'v' ] },
  { word: 'manifold', score: 1683, tags: [ 'adj', 'n' ] },
  { word: 'many', score: 1563, tags: [ 'adj' ] },
  { word: 'malicious', score: 1459, tags: [ 'adj' ] },
  { word: 'macabre', score: 1440, tags: [ 'adj' ] },
  { word: 'malign', score: 1335, tags: [ 'adj', 'v' ] },
  { word: 'maroon', score: 1225, tags: [ 'n', 'adj' ] },
  { word: 'mawkish', score: 1202, tags: [ 'adj' ] },
  { word: 'massive', score: 1192, tags: [ 'adj' ] },
  { word: 'malignant', score: 1172, tags: [ 'adj' ] },
  { word: 'malleable', score: 1149, tags: [ 'adj' ] },
  { word: 'male', score: 1047, tags: [ 'adj', 'n' ] } ]
  */
