import React, { useState, useEffect } from 'react';
import iRealReader from 'ireal-reader';
import JSONViewer from '../common/JSONViewer';
import { Measure } from 'leetsheet/lib/Measure';
import { RealParser } from 'leetsheet/lib/RealParser';
import { Sheet } from 'leetsheet/lib/Sheet';
import { Snippet } from 'leetsheet/lib/Snippet';
import TextField from '@material-ui/core/TextField';
import D3Shell from '../common/D3Shell';
import treeMap from '../common/treeMap';
import {
  countUnique,
  parseChords,
  includesChords,
  parseTransitions,
  includesTransitions,
  averageRegularity,
  unique
} from './analytics';
import DynamicTable from '../common/DynamicTable';

const stringSort = (a, b) => ('' + a).localeCompare(b);

const songFields = [
  /* {
    property: 'index',
    resolve: (_, index) => index,
    sort: (a, b) => b - a
  }, */
  {
    property: 'title',
    sort: stringSort
  },
  {
    property: 'composer',
    sort: stringSort
  },
  {
    property: 'key',
    sort: stringSort
  },
  {
    property: 'style',
    sort: stringSort
  }
];
const regularityField = {
  property: 'regularity',
  display: (v) => `${Math.round(v * 10000) / 100}%`,
  sort: (a, b) => b - a,
  defaultOrder: 'desc'
};

export function RealReader({ url }) {
  const playlist = iRealReader(decodeURI(url));
  return <JSONViewer json={playlist} />;
}

export function getSheet(song, expand?, options?) {
  if (!song) {
    return;
  }
  let sheet = RealParser.parseSheet(song.music.raw).map((m) => {
    m = Measure.from(m);
    if (m.section === 'i') {
      m.section = 'IN';
      // m.body = ['XXX'];
    }
    return m;
  });
  if (expand) {
    sheet = Sheet.render(sheet, options);
  }
  return sheet;
}

export function RealRenderer({ url }) {
  const playlist = iRealReader(decodeURI(url));
  const song = playlist.songs[0];
  const sheet = getSheet(song);
  return <JSONViewer json={sheet} />;
}

export function SheetSnippet({ url, expand, options }) {
  const playlist = iRealReader(decodeURI(url));
  const song = playlist.songs[0];
  const sheet = getSheet(song, expand, options);
  let snippet = Snippet.from(sheet);
  return <pre>{snippet}</pre>;
}

export function RealSongs({ url, onChange }) {
  const [playlist, setPlaylist] = useState<any>({ songs: [] });
  useEffect(() => {
    if (onChange) {
      onChange;
    }
    setPlaylist(getPlaylist(url));
  }, [url]);
  function getPlaylist(url) {
    const list = url ? iRealReader(decodeURI(url)) : { songs: [] };
    if (onChange) {
      onChange(list);
    }
    return list;
  }
  return (
    <>
      <TextField
        label="URL"
        type="url"
        value={url}
        variant="filled"
        style={{ width: '100%' }}
        onChange={(e) => {
          const p = getPlaylist(e.target.value);
          setPlaylist(p);
        }}
      />
    </>
  );
}

export function RealPlaylist({ url, onChange }) {
  const [playlist, setPlaylist] = useState<any>(getPlaylist(url));
  const [songIndex, setSongIndex] = useState(0);
  function getPlaylist(url) {
    const list = url ? iRealReader(decodeURI(url)) : { songs: [] };
    if (onChange) {
      onChange(list);
    }
    return list;
  }
  return (
    <>
      <TextField
        label="URL"
        type="url"
        value={url}
        variant="filled"
        style={{ width: '100%' }}
        onChange={(e) => setPlaylist(getPlaylist(e.target.value))}
      />
      {playlist?.songs?.length && (
        <>
          <TextField
            variant="filled"
            select
            label={`${playlist?.songs?.length} Songs`}
            style={{ width: '100%' }}
            value={songIndex}
            SelectProps={{
              native: true
            }}
            onChange={(e) => setSongIndex(parseInt(e.currentTarget.value))}
          >
            {playlist.songs.map((song, index) => (
              <option key={index} value={index}>
                #{index + 1}: {song.composer} - {song.title}
              </option>
            ))}
          </TextField>
          <br />
          <pre>{Snippet.from(getSheet(playlist.songs[songIndex]))}</pre>
        </>
      )}
    </>
  );
}

export function RealRanking(props) {
  const [ranking, setRanking] = useState([]);
  const [property, setProperty] = useState(props.property);
  const [songs, setSongs] = useState([]);
  const [selected, setSelected] = useState([]);
  useEffect(() => setProperty(props.property), [props.property]);
  function handleChange(_songs = songs, _property = property) {
    setSongs(_songs);
    setProperty(_property);
    const c = countUnique(_songs.map((song) => song[_property]))
      .sort((a, b) => b.count - a.count) // sort by count
      .slice(0, 20); // only use top 20
    setRanking(c);
  }
  const properties = ['composer', 'style', 'key'];
  const filteredSongs = songs.filter(({ [property]: prop }) =>
    selected.includes(prop)
  );
  return (
    <>
      <h3>top {property} ranking</h3>
      <RealSongs
        url={props.url}
        onChange={(list) => handleChange(list.songs)}
      />
      <TextField
        variant="filled"
        select
        label="Ranked Property"
        style={{ width: '100%' }}
        value={property}
        SelectProps={{
          native: true
        }}
        onChange={(e) => {
          handleChange(songs, e.currentTarget.value);
        }}
      >
        {properties.map((property, index) => (
          <option key={index} value={property}>
            {property}
          </option>
        ))}
      </TextField>
      <D3Shell
        render={(container) => {
          return treeMap(container, {
            children: ranking.map(({ value, count }, index) => ({
              name: `${value} (${count})`,
              value: count,
              id: value,
              selected: selected.includes(value),
              onClick: () =>
                setSelected(
                  selected.includes(value)
                    ? selected.filter((s) => s !== value)
                    : selected.concat([value])
                )
            }))
          });
        }}
      />
      {!!selected.length && (
        <DynamicTable
          orderedBy="title"
          fields={songFields}
          rows={filteredSongs}
        />
      )}
    </>
  );
}

export function RealChords(props) {
  const [songs, setSongs] = useState([]);
  const [chords, setChords] = useState([]);
  const [relative, setRelative] = useState(true);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    setChords(parseChords(songs, relative).slice(0, 45));
  }, [songs, relative]);
  const filteredSongs = songs.filter(includesChords(selected, relative));
  return (
    <>
      <RealSongs url={props.url} onChange={(list) => setSongs(list.songs)} />
      <D3Shell
        render={(container) => {
          return treeMap(container, {
            children: chords.map(({ value, count, regularity }) => ({
              name: `${value} (${Math.round(regularity * 10000) / 100}%)`,
              value: count,
              id: value,
              selected: selected.includes(value),
              onClick: () =>
                setSelected(
                  selected.includes(value)
                    ? selected.filter((s) => s !== value)
                    : selected.concat([value])
                )
            }))
          });
        }}
      />
      <label style={{ float: 'right' }}>
        <input
          type="checkbox"
          checked={relative}
          onChange={(e) => setRelative(e.target.checked)}
        />
        Relative
      </label>
      {filteredSongs.length} matching Songs
      <div style={{ overflow: 'auto', clear: 'both', maxHeight: '310px' }}>
        <DynamicTable
          orderedBy="regularity"
          fields={[regularityField, ...songFields]}
          rows={filteredSongs
            .map((song) => ({
              ...song,
              regularity: averageRegularity(
                parseChords([song], relative).map((t) => t.value),
                chords
              )
            }))
            .sort((a, b) => b.regularity - a.regularity)}
        />
      </div>
    </>
  );
}

export function RealTransitions(props) {
  const [songs, setSongs] = useState([]);
  const [transitions, setTransitions] = useState([]);
  const [relative, setRelative] = useState(true);
  const [selected, setSelected] = useState([]);
  useEffect(() => {
    const t = parseTransitions(songs, relative).slice(0, 45);
    setTransitions(t);
  }, [songs, relative]);
  const filteredSongs = songs.filter(includesTransitions(selected, relative));
  return (
    <>
      <RealSongs url={props.url} onChange={(list) => setSongs(list.songs)} />
      <D3Shell
        render={(container) => {
          return treeMap(container, {
            children: transitions.map(({ value, count, regularity }) => ({
              name: `${value} (${Math.round(regularity * 10000) / 100}%)`,
              value: count,
              id: value,
              selected: selected.includes(value),
              onClick: () =>
                setSelected(
                  selected.includes(value)
                    ? selected.filter((s) => s !== value)
                    : selected.concat([value])
                )
            }))
          });
        }}
      />
      <label style={{ float: 'right' }}>
        <input
          type="checkbox"
          checked={relative}
          onChange={(e) => setRelative(e.target.checked)}
        />
        Relative
      </label>
      {filteredSongs.length} matching Songs
      <div style={{ overflow: 'auto', maxHeight: '310px' }}>
        <DynamicTable
          orderedBy="regularity"
          fields={[regularityField, ...songFields]}
          rows={filteredSongs
            .map((song) => ({
              ...song,
              regularity: averageRegularity(
                parseTransitions([song], relative).map((t) => t.value),
                transitions
              )
            }))
            .sort((a, b) => b.regularity - a.regularity)}
        />
      </div>
    </>
  );
}

export function RealDiversity(props) {
  const [songs, setSongs] = useState([]);
  return (
    <>
      <RealSongs url={props.url} onChange={(list) => setSongs(list.songs)} />
      <div style={{ overflow: 'auto', maxHeight: '310px' }}>
        {songs.length} Songs
        <DynamicTable
          orderedBy="uniqueChords"
          fields={[
            {
              property: 'uniqueChords',
              sort: (a, b) => b - a,
              defaultOrder: 'desc'
            },
            ...songFields
          ]}
          rows={songs
            .map((song) => ({
              ...song,
              uniqueChords: unique(song.music.measures.flat()).length
            }))
            .sort((a, b) => b.uniqueChords - a.uniqueChords)}
        />
      </div>
    </>
  );
}
