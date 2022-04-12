import * as React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

export enum BaseCurrency {
    USD = "cUSD",
    EUR = "cEUR",
    ETH = "ETH",
    CELO = "CELO"
  }

type AccountDataEntry = {
    token: BaseCurrency;
    balance: number;
    value: number;
    exchange: number;
    baseCurrency: BaseCurrency;
};

function formatSmallValue(value: number): string {
    if (value < 1e-8) return `${(value * 1e9).toFixed(3)} n`;
    if (value < 1e-5) return `${(value * 1e6).toFixed(3)} μ`;
    if (value < 1e-2) return `${(value * 1e3).toFixed(3)} m`;
    return value.toFixed(3) + " ";
}

function formatValue(value: number, currency: BaseCurrency): string {
    if (currency === BaseCurrency.USD) return `$${value.toFixed(2)}`;
    if (currency === BaseCurrency.EUR) return `€${value.toFixed(2)}`;
    if (currency === BaseCurrency.ETH) return `${value < 0.01 ? formatSmallValue(value) : value.toFixed(2) + " "}ETH`;
    return `${value.toFixed(2)} CELO`;
}

const AccountTable: React.FC<{ rows: AccountDataEntry[] }> = ({ rows }) => (
    <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Token</TableCell>
            <TableCell align="right">Balance</TableCell>
            <TableCell align="right">Estimated Value</TableCell>
            <TableCell align="right">Estimated Exchange</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          { rows.map((row) => (
            <TableRow
              key={row.token}
              sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
              <TableCell component="th" scope="row">
                {row.token}
              </TableCell>
              <TableCell align="right">{row.balance < 0.01 ? formatSmallValue(row.balance) : row.balance.toFixed(2) + " "}{row.token}</TableCell>
              <TableCell align="right">{formatValue(row.value, row.baseCurrency)}</TableCell>
              <TableCell align="right">{formatValue(row.exchange, row.baseCurrency)} / {row.token}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
);
export default AccountTable;
