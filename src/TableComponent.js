import React from "react";
import "./TableComponent.css";
import numeral from "numeral";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  withStyles,
} from "@material-ui/core";

function TableComponent({ countries }) {
  const StyledTableCell = withStyles((theme) => ({
    head: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    body: {
      fontSize: 14,
    },
  }))(TableCell);

  const StyledTableRow = withStyles((theme) => ({
    root: {
      "&:nth-of-type(odd)": {
        backgroundColor: theme.palette.action.hover,
      },
    },
  }))(TableRow);

  return (
    <TableContainer component={Paper} className="table__container">
      <Table aria-label="customized table">
        <TableHead>
          <TableRow>
            <StyledTableCell>Country</StyledTableCell>
            <StyledTableCell align="right">Cases</StyledTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {countries.map(({ country, cases }, i) => (
            <StyledTableRow key={i}>
              <StyledTableCell component="th" scope="row">
                {country}
              </StyledTableCell>
              <StyledTableCell align="right">
                {numeral(cases).format("0,0")}
              </StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default TableComponent;
