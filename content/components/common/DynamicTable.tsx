import React, { useEffect, useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import JSONViewer from './JSONViewer';

const useStyles = makeStyles({
  table: {
    minWidth: 650
  },
  visuallyHidden: {
    border: 0,
    clip: 'rect(0 0 0 0)',
    height: 1,
    margin: -1,
    overflow: 'hidden',
    padding: 0,
    position: 'absolute',
    top: 20,
    width: 1
  }
});

declare type Order = 'asc' | 'desc';

declare interface FieldConfig {
  property: string;
  label?: string;
  sort?: (a, b) => number;
  defaultOrder?: Order;
  resolve?: (row?: Object, index?: number, rows?: Object[]) => any;
  desc?: boolean;
  heading?: React.ReactNode;
  display?: (value: any) => React.ReactNode;
  [key: string]: any;
}

export default function DynamicTable({
  fields: _fields,
  rows: _rows,
  debug = false,
  orderedBy = ''
}: {
  fields: Array<string | FieldConfig>;
  rows: Object[];
  debug?: boolean;
  orderedBy?: string;
}) {
  const [rows, setRows] = useState(_rows);
  useEffect(() => {
    setRows(_rows);
  }, [_rows]);
  const classes = useStyles();
  // unify field
  const fields: FieldConfig[] = _fields
    .map((field) => (typeof field === 'string' ? { property: field } : field))
    .map((field) => ({
      align: 'left',
      label: field.property,
      display: (value) => value,
      defaultOrder: 'asc',
      resolve: (row) => row[field.property],
      ...field
    }));
  let defaultOrder: Order = 'asc';
  if (orderedBy) {
    defaultOrder =
      fields.find(({ property }) => property === orderedBy)?.defaultOrder ||
      'asc';
  }
  const [order, setOrder] = useState<Order>(defaultOrder);
  const [orderBy, setOrderBy] = useState(orderedBy || '');
  function handleSort({ property, sort, resolve, defaultOrder }: FieldConfig) {
    let sorted = [...rows.sort((a, b) => sort(resolve(a), resolve(b)))];
    let _order = order;
    if (orderBy === property) {
      _order = order === 'asc' ? 'desc' : 'asc';
    } else {
      _order = defaultOrder;
    }
    if (_order !== defaultOrder) {
      sorted.reverse();
    }
    setOrder(_order);
    setOrderBy(property);
    setRows(sorted);
  }
  return (
    <>
      {debug && <JSONViewer json={rows} collapsed={false} />}
      <TableContainer component={Paper}>
        <Table
          className={classes.table}
          size="small"
          aria-label="a dense table"
        >
          <TableHead>
            <TableRow>
              {fields.map((field) => {
                const { property, label, align, heading, sort, defaultOrder } = field;
                return (
                  <TableCell
                    style={{ cursor: 'pointer' }}
                    key={property}
                    align={align}
                  >
                    <TableSortLabel
                      active={orderBy === property}
                      direction={orderBy === property ? order : defaultOrder}
                      onClick={() => sort && handleSort(field)}
                    >
                      {heading || label}
                      {orderBy === property ? (
                        <span className={classes.visuallyHidden}>
                          {order === 'desc'
                            ? 'sorted descending'
                            : 'sorted ascending'}
                        </span>
                      ) : null}
                    </TableSortLabel>
                  </TableCell>
                );
              })}
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row, index) => (
              <TableRow key={index}>
                {fields.map(({ property, align, display, resolve }) => (
                  <TableCell component="th" scope="row" align={align}>
                    {display(resolve(row, index, rows))}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
}
