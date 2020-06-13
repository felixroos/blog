import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  }
});

export default function SongTable({ songs }) {
  const classes = useStyles();
  const rows = songs.map((song) => song);
  console.log('songs', songs);
  return (
    <TableContainer component={Paper}>
      <Table className={classes.table} size="small" aria-label="Songs">
        <TableHead>
          <TableRow>
            <TableCell>Title</TableCell>
            <TableCell>Composer</TableCell>
            <TableCell>Style</TableCell>
            <TableCell>Key</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.title}</TableCell>
              <TableCell>{row.composer}</TableCell>
              <TableCell>{row.style}</TableCell>
              <TableCell>{row.key}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
