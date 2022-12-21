import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CreateIcon from '@mui/icons-material/Create';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { ClientInformation, getClients, getSelectedClient } from '../../api/ApiClients';
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
  const [selectedClientInformation, setSelectedClientInformation] = useState<ClientInformation>();
  const [openClientInformationDialog, setOpenClientInformationDialog] = React.useState(false);

  const handleClickOpenClientInformationDialog = () => {
    setOpenClientInformationDialog(true);
  };

  const handleCloseClientInformationDialog = () => {
    setOpenClientInformationDialog(false);
  };

  useEffect(() => {
    getClients().then((res) => {
      setClients(res.data);
    });

    getSelectedClient(2).then((res) => {
      setSelectedClient(res.data);
      console.log(res.data);
    });
  }, []);

  const modificationToolTip = `Modyfikował: ${selectedClientInformation?.opeModyfikowal} \n
  Data modyfikacji: ${selectedClientInformation?.dataModyfikacji}`;

  const informationTableDef: GridColDef[] = [
    { field: 'kitId', headerName: 'ID typu', width: 100, sortable: true, },
    { field: 'nazwa', headerName: 'Nazwa', width: 130, sortable: true, },
  ];

  return (
    <Box sx={{ minWidth: 120 }}>
      <Grid container spacing={2}>
        <Grid item xs={10}>
          <Autocomplete<{ id: number, label: string }>
            disablePortal
            autoHighlight
            // freeSolo
            id="combo-box-demo"
            onChange={(_event, value) => {
              console.log(value);
            }}

            options={clients.map((client) => ({ id: client.id, label: `${client.kod} - ${client.nazwa1}` }))}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Kontrahent" />}
          />
        </Grid>
        <Grid item xs={1}>
          <Button variant="outlined" size="large"
                  startIcon={<CreateIcon />}
                  sx={{ width: '100%' }}>
            Edytuj
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="outlined" size="large"
                  startIcon={<PersonAddIcon />}
                  sx={{ width: '100%' }}>
            Dodaj
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: '100%', marginTop: '20' }}>
        <Grid container spacing={2}>
          <Grid item xs={7}>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                  <TableRow>
                    <TableCell> </TableCell>
                    <TableCell>Typ</TableCell>
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
                          {informacja.kitNazwa}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Button
                            onClick={() => {
                              //handleClickOpenClientInformationDialog();
                              setSelectedClientInformation(informacja);
                            }}
                          >{informacja.nazwa}</Button>
                        </TableCell>
                      </TableRow>
                    ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Grid>
          <Grid item xs={5}>
            <Card variant="outlined">
              <CardContent>
                <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
                  {selectedClientInformation?.nazwa}
                </Typography>
                <h5>{selectedClientInformation?.opis}</h5>
              </CardContent>
              <CardActions>
                <Tooltip title={modificationToolTip}>
                  <IconButton>
                    <HelpOutlineIcon />
                  </IconButton>
                </Tooltip>
              </CardActions>
            </Card>
          </Grid>
        </Grid>

        <Dialog
          open={openClientInformationDialog}
          onClose={handleCloseClientInformationDialog}
          fullScreen>
          <DialogTitle>Subscribe</DialogTitle>
          <DialogContent>
            <DialogContentText>
              {selectedClientInformation?.nazwa}
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
              variant="standard"
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseClientInformationDialog}>Zamknij</Button>
            <Button onClick={handleCloseClientInformationDialog}>Zapisz</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box>
  );
}