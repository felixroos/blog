import canUseDOM from '../../../components/canUseDOM'
import { rack } from '../../../components/rhythmical/instruments/rack';

const tidalsounds = {
  bd: require('./bd/BT0A0D0.wav'),
  sn: require('./sn/ST0T0S3.wav'),
  hh: require('./hh/000_hh3closedhh.wav'),
  cp: require('./cp/HANDCLP0.wav'),
  mt: require('./mt/MT0D3.wav'),
  ht: require('./ht/HT0D3.wav'),
  lt: require('./lt/LT0D3.wav'),
}

export default canUseDOM() && rack(tidalsounds).toMaster();