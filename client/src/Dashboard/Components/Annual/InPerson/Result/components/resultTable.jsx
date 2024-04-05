import Table from '@material-ui/core/Table';
import TableCell from '@material-ui/core/TableCell';
import TableRow from '@material-ui/core/TableRow';
import { makeStyles } from '@material-ui/core/styles';
import './resultT.css';

const useStyles = makeStyles({
  table: {
    width: '95%',
    // Add any other custom styles here
  },
});

function resultTable() {
  const classes = useStyles();

  return (
    <div className="resultTable">
      <div className='table-container'>
        <Table classes={{ root: classes.table }}>
          <TableRow className='row-style'>
            <TableCell className="head">Date: </TableCell>
            <TableCell className="data"><b>Under Review</b></TableCell>
          </TableRow>
          <TableRow className='row-style'>
            <TableCell className="head">Session: </TableCell>
            <TableCell className="data"><b>Under Review</b></TableCell>
          </TableRow>
        </Table>
      </div>
    </div>
  );
}

export default resultTable;
