import canUseDOM from '../components/canUseDOM'
import { sampler } from '../components/rhythmical/instruments/sampler';

export const MK2md2 = {
  load: (onload) => {
    const samples = {
      E1: "../samples/rhodes/MK2Md2000.mp3",
      F1: "../samples/rhodes/MK2Md2001.mp3",
      Gb1: "../samples/rhodes/MK2Md2002.mp3",
      G1: "../samples/rhodes/MK2Md2003.mp3",
      Bb1: "../samples/rhodes/MK2Md2006.mp3",
      B1: "../samples/rhodes/MK2Md2007.mp3",
      C2: "../samples/rhodes/MK2Md2008.mp3",
      Db2: "../samples/rhodes/MK2Md2009.mp3",
      D2: "../samples/rhodes/MK2Md2010.mp3",
      Eb2: "../samples/rhodes/MK2Md2011.mp3",
      E2: "../samples/rhodes/MK2Md2012.mp3",
      F2: "../samples/rhodes/MK2Md2013.mp3",
      Gb2: "../samples/rhodes/MK2Md2014.mp3",
      G2: "../samples/rhodes/MK2Md2015.mp3",
      Ab2: "../samples/rhodes/MK2Md2016.mp3",
      Bb2: "../samples/rhodes/MK2Md2018.mp3",
      B2: "../samples/rhodes/MK2Md2019.mp3",
      C3: "../samples/rhodes/MK2Md2020.mp3",
      Db3: "../samples/rhodes/MK2Md2021.mp3",
      D3: "../samples/rhodes/MK2Md2022.mp3",
      E3: "../samples/rhodes/MK2Md2024.mp3",
      F3: "../samples/rhodes/MK2Md2025.mp3",
      Gb3: "../samples/rhodes/MK2Md2026.mp3",
      G3: "../samples/rhodes/MK2Md2027.mp3",
      Ab3: "../samples/rhodes/MK2Md2028.mp3",
      A3: "../samples/rhodes/MK2Md2029.mp3",
      Bb3: "../samples/rhodes/MK2Md2030.mp3",
      B3: "../samples/rhodes/MK2Md2031.mp3",
      C4: "../samples/rhodes/MK2Md2032.mp3",
      Db4: "../samples/rhodes/MK2Md2033.mp3",
      D4: "../samples/rhodes/MK2Md2034.mp3",
      Eb4: "../samples/rhodes/MK2Md2035.mp3",
      E4: "../samples/rhodes/MK2Md2036.mp3",
      F4: "../samples/rhodes/MK2Md2037.mp3",
      Gb4: "../samples/rhodes/MK2Md2038.mp3",
      G4: "../samples/rhodes/MK2Md2039.mp3",
      Ab4: "../samples/rhodes/MK2Md2040.mp3",
      A4: "../samples/rhodes/MK2Md2041.mp3",
      Bb4: "../samples/rhodes/MK2Md2042.mp3",
      B4: "../samples/rhodes/MK2Md2043.mp3",
      C5: "../samples/rhodes/MK2Md2044.mp3",
      Db5: "../samples/rhodes/MK2Md2045.mp3",
      D5: "../samples/rhodes/MK2Md2046.mp3",
      Eb5: "../samples/rhodes/MK2Md2047.mp3",
      E5: "../samples/rhodes/MK2Md2048.mp3",
      F5: "../samples/rhodes/MK2Md2049.mp3",
      Gb5: "../samples/rhodes/MK2Md2050.mp3",
      G5: "../samples/rhodes/MK2Md2051.mp3",
      Ab5: "../samples/rhodes/MK2Md2052.mp3",
      A5: "../samples/rhodes/MK2Md2053.mp3",
      Bb5: "../samples/rhodes/MK2Md2054.mp3",
      B5: "../samples/rhodes/MK2Md2055.mp3",
      C6: "../samples/rhodes/MK2Md2056.mp3",
      Db6: "../samples/rhodes/MK2Md2057.mp3",
      D6: "../samples/rhodes/MK2Md2058.mp3",
      Eb6: "../samples/rhodes/MK2Md2059.mp3",
      E6: "../samples/rhodes/MK2Md2060.mp3",
      F6: "../samples/rhodes/MK2Md2061.mp3",
      Gb6: "../samples/rhodes/MK2Md2062.mp3",
      G6: "../samples/rhodes/MK2Md2063.mp3",
      Ab6: "../samples/rhodes/MK2Md2064.mp3",
      Bb6: "../samples/rhodes/MK2Md2066.mp3",
      B6: "../samples/rhodes/MK2Md2067.mp3",
      C7: "../samples/rhodes/MK2Md2068.mp3",
      Db7: "../samples/rhodes/MK2Md2069.mp3",
      D7: "../samples/rhodes/MK2Md2070.mp3",
      Eb7: "../samples/rhodes/MK2Md2071.mp3",
      E7: "../samples/rhodes/MK2Md2072.mp3"
    }
    return canUseDOM() && sampler(samples, { volume: -20, onload }).toMaster();
  }
}

/* export const Md2 = {
  E1: require("./MK2Md2000.mp3"),
  F1: require("./MK2Md2001.mp3"),
  Gb1: require("./MK2Md2002.mp3"),
  G1: require("./MK2Md2003.mp3"),
  Bb1: require("./MK2Md2006.mp3"),
  B1: require("./MK2Md2007.mp3"),
  C2: require("./MK2Md2008.mp3"),
  Db2: require("./MK2Md2009.mp3"),
  D2: require("./MK2Md2010.mp3"),
  Eb2: require("./MK2Md2011.mp3"),
  E2: require("./MK2Md2012.mp3"),
  F2: require("./MK2Md2013.mp3"),
  Gb2: require("./MK2Md2014.mp3"),
  G2: require("./MK2Md2015.mp3"),
  Ab2: require("./MK2Md2016.mp3"),
  Bb2: require("./MK2Md2018.mp3"),
  B2: require("./MK2Md2019.mp3"),
  C3: require("./MK2Md2020.mp3"),
  Db3: require("./MK2Md2021.mp3"),
  D3: require("./MK2Md2022.mp3"),
  E3: require("./MK2Md2024.mp3"),
  F3: require("./MK2Md2025.mp3"),
  Gb3: require("./MK2Md2026.mp3"),
  G3: require("./MK2Md2027.mp3"),
  Ab3: require("./MK2Md2028.mp3"),
  A3: require("./MK2Md2029.mp3"),
  Bb3: require("./MK2Md2030.mp3"),
  B3: require("./MK2Md2031.mp3"),
  C4: require("./MK2Md2032.mp3"),
  Db4: require("./MK2Md2033.mp3"),
  D4: require("./MK2Md2034.mp3"),
  Eb4: require("./MK2Md2035.mp3"),
  E4: require("./MK2Md2036.mp3"),
  F4: require("./MK2Md2037.mp3"),
  Gb4: require("./MK2Md2038.mp3"),
  G4: require("./MK2Md2039.mp3"),
  Ab4: require("./MK2Md2040.mp3"),
  A4: require("./MK2Md2041.mp3"),
  Bb4: require("./MK2Md2042.mp3"),
  B4: require("./MK2Md2043.mp3"),
  C5: require("./MK2Md2044.mp3"),
  Db5: require("./MK2Md2045.mp3"),
  D5: require("./MK2Md2046.mp3"),
  Eb5: require("./MK2Md2047.mp3"),
  E5: require("./MK2Md2048.mp3"),
  F5: require("./MK2Md2049.mp3"),
  Gb5: require("./MK2Md2050.mp3"),
  G5: require("./MK2Md2051.mp3"),
  Ab5: require("./MK2Md2052.mp3"),
  A5: require("./MK2Md2053.mp3"),
  Bb5: require("./MK2Md2054.mp3"),
  B5: require("./MK2Md2055.mp3"),
  C6: require("./MK2Md2056.mp3"),
  Db6: require("./MK2Md2057.mp3"),
  D6: require("./MK2Md2058.mp3"),
  Eb6: require("./MK2Md2059.mp3"),
  E6: require("./MK2Md2060.mp3"),
  F6: require("./MK2Md2061.mp3"),
  Gb6: require("./MK2Md2062.mp3"),
  G6: require("./MK2Md2063.mp3"),
  Ab6: require("./MK2Md2064.mp3"),
  Bb6: require("./MK2Md2066.mp3"),
  B6: require("./MK2Md2067.mp3"),
  C7: require("./MK2Md2068.mp3"),
  Db7: require("./MK2Md2069.mp3"),
  D7: require("./MK2Md2070.mp3"),
  Eb7: require("./MK2Md2071.mp3"),
  E7: require("./MK2Md2072.mp3")
} */
/*
export const Md1 = {
  E1: require("./MK2Md1000.mp3"),
  F1: require("./MK2Md1001.mp3"),
  Gb1: require("./MK2Md1002.mp3"),
  G1: require("./MK2Md1003.mp3"),
  Bb1: require("./MK2Md1006.mp3"),
  B1: require("./MK2Md1007.mp3"),
  C2: require("./MK2Md1008.mp3"),
  Db2: require("./MK2Md1009.mp3"),
  D2: require("./MK2Md1010.mp3"),
  Eb2: require("./MK2Md1011.mp3"),
  E2: require("./MK2Md1012.mp3"),
  Gb2: require("./MK2Md1014.mp3"),
  G2: require("./MK2Md1015.mp3"),
  Ab2: require("./MK2Md1016.mp3"),
  Bb2: require("./MK2Md1018.mp3"),
  B2: require("./MK2Md1019.mp3"),
  C3: require("./MK2Md1020.mp3"),
  Db3: require("./MK2Md1021.mp3"),
  D3: require("./MK2Md1022.mp3"),
  E3: require("./MK2Md1024.mp3"),
  F3: require("./MK2Md1025.mp3"),
  Gb3: require("./MK2Md1026.mp3"),
  G3: require("./MK2Md1027.mp3"),
  Ab3: require("./MK2Md1028.mp3"),
  A3: require("./MK2Md1029.mp3"),
  Bb3: require("./MK2Md1030.mp3"),
  B3: require("./MK2Md1031.mp3"),
  C4: require("./MK2Md1032.mp3"),
  Db4: require("./MK2Md1033.mp3"),
  D4: require("./MK2Md1034.mp3"),
  Eb4: require("./MK2Md1035.mp3"),
  E4: require("./MK2Md1036.mp3"),
  F4: require("./MK2Md1037.mp3"),
  Gb4: require("./MK2Md1038.mp3"),
  G4: require("./MK2Md1039.mp3"),
  Ab4: require("./MK2Md1040.mp3"),
  A4: require("./MK2Md1041.mp3"),
  Bb4: require("./MK2Md1042.mp3"),
  B4: require("./MK2Md1043.mp3"),
  C5: require("./MK2Md1044.mp3"),
  Db5: require("./MK2Md1045.mp3"),
  D5: require("./MK2Md1046.mp3"),
  Eb5: require("./MK2Md1047.mp3"),
  E5: require("./MK2Md1048.mp3"),
  F5: require("./MK2Md1049.mp3"),
  Gb5: require("./MK2Md1050.mp3"),
  G5: require("./MK2Md1051.mp3"),
  Ab5: require("./MK2Md1052.mp3"),
  A5: require("./MK2Md1053.mp3"),
  Bb5: require("./MK2Md1054.mp3"),
  B5: require("./MK2Md1055.mp3"),
  C6: require("./MK2Md1056.mp3"),
  Db6: require("./MK2Md1057.mp3"),
  D6: require("./MK2Md1058.mp3"),
  Eb6: require("./MK2Md1059.mp3"),
  E6: require("./MK2Md1060.mp3"),
  F6: require("./MK2Md1061.mp3"),
  Gb6: require("./MK2Md1062.mp3"),
  G6: require("./MK2Md1063.mp3"),
  Ab6: require("./MK2Md1064.mp3"),
  Bb6: require("./MK2Md1066.mp3"),
  B6: require("./MK2Md1067.mp3"),
  C7: require("./MK2Md1068.mp3"),
  Db7: require("./MK2Md1069.mp3"),
  D7: require("./MK2Md1070.mp3"),
  Eb7: require("./MK2Md1071.mp3"),
  E7: require("./MK2Md1072.mp3")
}

export const Hrd = {
  E1: require("./MK2Hrd000.mp3"),
  F1: require("./MK2Hrd001.mp3"),
  G1: require("./MK2Hrd003.mp3"),
  A1: require("./MK2Hrd005.mp3"),
  Bb1: require("./MK2Hrd006.mp3"),
  B1: require("./MK2Hrd007.mp3"),
  C2: require("./MK2Hrd008.mp3"),
  Db2: require("./MK2Hrd009.mp3"),
  D2: require("./MK2Hrd010.mp3"),
  Eb2: require("./MK2Hrd011.mp3"),
  E2: require("./MK2Hrd012.mp3"),
  G2: require("./MK2Hrd015.mp3"),
  Ab2: require("./MK2Hrd016.mp3"),
  Bb2: require("./MK2Hrd018.mp3"),
  B2: require("./MK2Hrd019.mp3"),
  C3: require("./MK2Hrd020.mp3"),
  Db3: require("./MK2Hrd021.mp3"),
  D3: require("./MK2Hrd022.mp3"),
  E3: require("./MK2Hrd024.mp3"),
  F3: require("./MK2Hrd025.mp3"),
  Gb3: require("./MK2Hrd026.mp3"),
  G3: require("./MK2Hrd027.mp3"),
  Ab3: require("./MK2Hrd028.mp3"),
  A3: require("./MK2Hrd029.mp3"),
  Bb3: require("./MK2Hrd030.mp3"),
  B3: require("./MK2Hrd031.mp3"),
  C4: require("./MK2Hrd032.mp3"),
  Db4: require("./MK2Hrd033.mp3"),
  D4: require("./MK2Hrd034.mp3"),
  Eb4: require("./MK2Hrd035.mp3"),
  E4: require("./MK2Hrd036.mp3"),
  F4: require("./MK2Hrd037.mp3"),
  Gb4: require("./MK2Hrd038.mp3"),
  G4: require("./MK2Hrd039.mp3"),
  Ab4: require("./MK2Hrd040.mp3"),
  A4: require("./MK2Hrd041.mp3"),
  Bb4: require("./MK2Hrd042.mp3"),
  B4: require("./MK2Hrd043.mp3"),
  C5: require("./MK2Hrd044.mp3"),
  Db5: require("./MK2Hrd045.mp3"),
  D5: require("./MK2Hrd046.mp3"),
  Eb5: require("./MK2Hrd047.mp3"),
  E5: require("./MK2Hrd048.mp3"),
  F5: require("./MK2Hrd049.mp3"),
  Gb5: require("./MK2Hrd050.mp3"),
  G5: require("./MK2Hrd051.mp3"),
  Ab5: require("./MK2Hrd052.mp3"),
  A5: require("./MK2Hrd053.mp3"),
  Bb5: require("./MK2Hrd054.mp3"),
  B5: require("./MK2Hrd055.mp3"),
  C6: require("./MK2Hrd056.mp3"),
  Db6: require("./MK2Hrd057.mp3"),
  D6: require("./MK2Hrd058.mp3"),
  Eb6: require("./MK2Hrd059.mp3"),
  E6: require("./MK2Hrd060.mp3"),
  F6: require("./MK2Hrd061.mp3"),
  Gb6: require("./MK2Hrd062.mp3"),
  G6: require("./MK2Hrd063.mp3"),
  Ab6: require("./MK2Hrd064.mp3"),
  A6: require("./MK2Hrd065.mp3"),
  Bb6: require("./MK2Hrd066.mp3"),
  B6: require("./MK2Hrd067.mp3"),
  C7: require("./MK2Hrd068.mp3"),
  Db7: require("./MK2Hrd069.mp3"),
  D7: require("./MK2Hrd070.mp3"),
  Eb7: require("./MK2Hrd071.mp3"),
  E7: require("./MK2Hrd072.mp3")
} */
