import { Switch } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import standards from '../../posts/ireal/jazz1350.json';
import { toTonalChord } from '../common/toTonalChord';
import { getPlaylist, getSheet, RealSongs } from '../ireal/RealParser';
import SheetGrid from '../score/SheetGrid';
import Card from '@material-ui/core/Card';
import CardContent from '@material-ui/core/CardContent';

export default function RhythmicalBrowser() {
  const [songs, setSongs] = useState([]);
  const [song, setSong] = useState<any>();
  const [sheet, setSheet] = useState<any>();
  const [showScales, setShowScales] = useState(false);
  useEffect(() => {
    const list = getPlaylist(standards);
    setSongs(list.songs); // .slice(0, 50)
    selectSong(randomElement(list.songs));
  }, []);

  function selectSong(song) {
    const _sheet = getSheet(song);
    setSong(song);
    setSheet(_sheet);
  }
  //  className={classes.root}
  return (
    <Card elevation={3}>
      <CardContent style={{ width: '100%', overflow: 'auto' }}>
        {song && (
          <>
            <h3>
              {song.composer} - {song.title}
            </h3>
            <p>Style: {song.style}</p>
            <label>
              chords
              <Switch checked={showScales} color="default" onChange={(e) => setShowScales(e.target.checked)} />
              scales
            </label>
            {sheet && (
              <SheetGrid
                showScales={showScales}
                rows={[1, 1, 1, 1]}
                measures={sheet.map(({ body }) => body.map(toTonalChord))}
                rawText={true}
                loop={true}
                innerBorders={false}
              />
            )}
          </>
        )}
        <div
          style={{
            maxHeight: '300px',
            overflow: 'auto',
            marginTop: '10px',
            border: '1px solid #efefef',
          }}
        >
          <List component="nav" dense={true} style={{ backgroundColor: '#fff' }}>
            {songs.map((song, i) => (
              <ListItem button onClick={() => selectSong(song)} key={i}>
                <ListItemText
                  primary={
                    <>
                      {song.composer} - {song.title}
                    </>
                  }
                />
              </ListItem>
            ))}
          </List>
        </div>
      </CardContent>
    </Card>
  );
}

function randomElement(array) {
  return array[Math.floor(Math.random() * array.length)];
}
