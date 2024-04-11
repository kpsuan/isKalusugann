import React from 'react';
import Table from '@mui/material/Table';
import TableCell from '@mui/material/TableCell';
import TableRow from '@mui/material/TableRow';
import { makeStyles } from '@mui/styles';
import './resultT.css';

const ResultTable = () => { // Changed to an arrow function component
 

  const classes = useStyles();

  return (
    <div className="resultTable">
      <div className='table-container'>
        <Table classes={{ root: classes.table }}>
          <TableRow className='row-style'>
            <TableCell className="head">Status</TableCell>
            <TableCell className="data"><b>Under Review</b></TableCell>
          </TableRow>
          <TableRow className='row-style'>
            <TableCell className="head">Remarks</TableCell>
            <TableCell className="data">Your Submitted documents will be reviewed and verified by the HSU</TableCell>
          </TableRow>
        </Table>
      </div>
    </div>
  );
}

export default ResultTable;
