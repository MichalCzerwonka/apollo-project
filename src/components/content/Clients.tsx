import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateIcon from '@mui/icons-material/Create';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { getClients, getSelectedClient } from '../../api/ApiClients';
import { useEffect } from 'react';
import { Client } from '../../api/ApiClients';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';

// type Film = {
//     label: string;
//     year: number;
// }

// const mocked = [{
//   id: 1,
//   typ: 23,
//   kod: 'ARGND',
//   nazwa1: 'GND',
//   nazwa2: 'ARCUSSOFT',
//   miasto: 'Grodzisko Nowe',
//   nip: '8161706324',
//   ulica: 'string',
//   kodPocztowy: 'string',
//   poczta: 'string',
//   telefon: 'string',
//   email: 'string',
//   opeUtworzyl: 12,
//   dataUtworzenia: 12,
//   opeModyfikowal: 12,
//   dataModyfikacji: 12
// },
//   {
//     id: 1,
//     typ: 23,
//     kod: 'ARGND',
//     nazwa1: 'GND',
//     nazwa2: 'AR TESTOWA FIRMA',
//     miasto: 'Grodzisko Nowe',
//     nip: '8161706324',
//     ulica: 'string',
//     kodPocztowy: 'string',
//     poczta: 'string',
//     telefon: 'string',
//     email: 'string',
//     opeUtworzyl: 12,
//     dataUtworzenia: 12,
//     opeModyfikowal: 12,
//     dataModyfikacji: 12
//   }];

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client>();

  useEffect(() => {
    getClients().then((res) => {
      setClients(res.data);
    })

    getSelectedClient(2).then((res) => {
      setSelectedClient(res.data);
      console.log(res.data);
    })
  }, []);



  const informationTableDef: GridColDef[] = [
    { field: 'kitId', headerName: 'ID typu', width: 100, sortable: true, },
    { field: 'nazwa', headerName: 'Nazwa', width: 130, sortable: true, },
  ];

  return (
    <Box sx={{ minWidth: 120 }}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Autocomplete
            disablePortal
            autoHighlight
            freeSolo
            id="combo-box-demo"
            // onChange={(event: any, newValue: string | { id: number; label: string; }) => {
            //   if (typeof (newValue) === "string") {

            //   }
            //   else {
            //     console.log(newValue.id);
            //   }
            // }}

            options={clients.map((client) => ({ id: client.id, label: `${client.kod} - ${client.nazwa1}` }))}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Kontrahent" />}
          />
        </Grid>
        <Grid item xs={1}>
          <Button variant="outlined" size='large'
            startIcon={<CreateIcon />}
            sx={{ width: '100%' }}>
            Edytuj
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="outlined" size='large'
            startIcon={<PersonAddIcon />}
            sx={{ width: '100%' }}>
            Dodaj
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: '100%', marginTop: '20' }}>
        <TableContainer component={Paper} >
          <Table sx={{ minWidth: 650 }} aria-label="simple table" >
            <TableHead>
              <TableRow>
                <TableCell> </TableCell>
                <TableCell>ID Typu</TableCell>
                <TableCell>Nazwa</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                selectedClient?.kntInformacje.map((informacja) => (
                  <TableRow
                    key={informacja.kitId}
                    sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                    <TableCell padding="checkbox">
                      <Checkbox
                        color="primary"
                        checked={informacja.wybrany}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row" width={100}>
                      {informacja.kitId}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      <Button>{informacja.nazwa}</Button>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>
    </Box>
  );
}