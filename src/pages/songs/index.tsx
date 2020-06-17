import React, { useState, useMemo } from 'react';
import standards from '../../../content/posts/ireal/jazz1350.json';
import DynamicTable, {
  sortString
} from '../../../content/components/common/DynamicTable';
import { countUniques } from '../../../content/components/ireal/analytics';
import iRealReader from 'ireal-reader';
import Layout from './Layout';
import Sidebar from './Sidebar';

const { songs } = iRealReader(decodeURI(standards));

const uniques = countUniques(songs, ['composer', 'key', 'style']);
const SongPage = () => {
  console.log('song page...');
  const songList = useMemo(() => {
    console.log('get song table');
    return (
      <DynamicTable
        cols={[
          {
            property: 'title',
            label: 'Title',
            sort: sortString
          },
          {
            property: 'composer',
            label: 'Composer',
            sort: sortString
          },
          {
            property: 'key',
            label: 'Key',
            sort: sortString
          },
          {
            property: 'style',
            label: 'Key',
            sort: sortString
          }
        ]}
        rows={songs.slice(0, 100)}
      />
    );
  }, []);
  return (
    <Layout
      sidebar={<Sidebar checkboxes={uniques.composer} />}
      main={songList}
    />
  );
};
export default SongPage;
