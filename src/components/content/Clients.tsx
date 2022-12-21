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
import InventoryIcon from '@mui/icons-material/Inventory';
import TablePagination from '@mui/material/TablePagination';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import Checkbox from '@mui/material/Checkbox';
import { ClientInformation, getClients, getSelectedClient } from '../../api/ApiClients';
import { useEffect } from 'react';
import { Client } from '../../api/ApiClients';
import Container from '@mui/material/Container';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TableFooter from '@mui/material/TableFooter';
import FormControlLabel from '@mui/material/FormControlLabel';
import Paper from '@mui/material/Paper';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { textAlign } from '@mui/system';

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

  const [editClientButtonDisabled, setEditClientButtonDisabled] = React.useState(true);
  const [editInformationButtonDisabled, setEditInformationButtonDisabled] = React.useState(true);

  const [openEditClientDialog, setOpenEditClientDialog] = React.useState(false);
  const [openCreateClientDialog, setOpenCreateClientDialog] = React.useState(false);
  const [openCreateClientInformationDialog, setOpenCreateClientInformationDialog] = React.useState(false);
  const [openEditClientInformationDialog, setOpenEditClientInformationDialog] = React.useState(false);

  const handleCloseEditClientDialog = () => {
    setOpenEditClientDialog(false);
  };
  const handleCloseCreateClientDialog = () => {
    setOpenCreateClientDialog(false);
  };
  const handleCloseAddClientInformationDialog = () => {
    setOpenCreateClientInformationDialog(false);
  };
  const handleCloseEditClientInformationDialog = () => {
    setOpenEditClientInformationDialog(false);
  };

  const handleCanUserEditClient = () => {
    if (selectedClient !== null) {
      setEditClientButtonDisabled(false);
    }
    else {
      setEditClientButtonDisabled(true);
    }
  };
  const handleCanUserEditInformationButtonDisabled = () => {
    if (selectedClientInformation !== null) {
      setEditInformationButtonDisabled(false);
    }
    else {
      setEditInformationButtonDisabled(true);
    }
  };



  useEffect(() => {
    getClients().then((res) => {
      setClients(res.data);
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
      <Grid container spacing={2} mb={2}>
        <Grid item xs={10}>
          <Autocomplete<{ id: number, label: string }>
            disablePortal
            autoHighlight
            // freeSolo
            id="combo-box-demo"
            onChange={(_event, value) => {
              if (value !== null) {
                getSelectedClient(value.id).then((res) => {
                  setSelectedClient(res.data);
                  handleCanUserEditClient();
                });
              }
            }}
            options={clients.map((client) => ({ id: client.id, label: `${client.kod} - ${client.nazwa1}` }))}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Kontrahent" />}
          />
        </Grid>
        <Grid item xs={1}>
          <Button variant="outlined" size="large"
            startIcon={<CreateIcon />}
            disabled={editClientButtonDisabled}
            sx={{ width: '100%' }}
            onClick={() => {
              setOpenEditClientDialog(true);
            }}>
            Edytuj
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="outlined" size="large"
            startIcon={<PersonAddIcon />}
            sx={{ width: '100%' }}
            onClick={() => {
              setOpenCreateClientDialog(true);
            }}>
            Dodaj
          </Button>
        </Grid>
      </Grid>
      <div style={{ height: 400, width: '100%', marginTop: '10' }}>

        <Grid container spacing={2}>
          <Grid item xs={7}>
            <Box style={{ marginBottom: '10px', textAlign: 'left' }}>
              <Button style={{ marginRight: '10px', marginLeft: '10px' }}
                startIcon={<PostAddIcon />}
                onClick={() => {
                  setOpenCreateClientInformationDialog(true);
                }}>
                Dodaj
              </Button>
              <Button style={{ marginRight: '10px', marginLeft: '10px' }}
                startIcon={<CreateIcon />}
                disabled={editInformationButtonDisabled}
                onClick={() => {
                  setOpenEditClientInformationDialog(true);
                }}>
                Edytuj
              </Button>
              <Button style={{ marginRight: '10px', marginLeft: '10px' }}
                startIcon={<InventoryIcon />}
                disabled={editClientButtonDisabled}
                onClick={() => {

                }}>
                Pokaż archiwalne
              </Button>
            </Box>
            <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" id="table">
                <TableHead>
                  <TableRow>
                    {/* <TableCell> </TableCell> */}
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
                        {/* <TableCell padding="checkbox">
                          <Checkbox
                            color="primary"
                            checked={informacja.wybrany}
                          />
                        </TableCell> */}
                        <TableCell component="th" scope="row" width={100}>
                          {informacja.kitNazwa}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Button
                            onClick={() => {
                              //handleClickOpenClientInformationDialog();
                              setSelectedClientInformation(informacja);
                              handleCanUserEditInformationButtonDisabled();
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
                <h5 style={{ textAlign: 'left' }} dangerouslySetInnerHTML={{ __html: selectedClientInformation?.opis.replace(/\n/g, "<br />") || "" }}></h5>
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

        {/*  Dodawanie klienta */}
        <Dialog
          open={openCreateClientDialog}
          onClose={handleCloseCreateClientDialog}
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
            <Button onClick={handleCloseCreateClientDialog}>Zamknij</Button>
            <Button onClick={handleCloseCreateClientDialog}>Zapisz</Button>
          </DialogActions>
        </Dialog>

        {/*  Edycja klienta */}
        <Dialog
          open={openEditClientDialog}
          onClose={handleCloseEditClientDialog}
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
            <Button onClick={handleCloseEditClientDialog}>Zamknij</Button>
            <Button onClick={handleCloseEditClientDialog}>Zapisz</Button>
          </DialogActions>
        </Dialog>

        {/*  Dodawanie informacji */}
        <Dialog
          open={openCreateClientInformationDialog}
          onClose={handleCloseAddClientInformationDialog}
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
            <Button onClick={handleCloseAddClientInformationDialog}>Zamknij</Button>
            <Button onClick={handleCloseAddClientInformationDialog}>Zapisz</Button>
          </DialogActions>
        </Dialog>

        {/*  Edycja informacji */}
        <Dialog
          open={openEditClientInformationDialog}
          onClose={handleCloseEditClientInformationDialog}
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
            <Button onClick={handleCloseEditClientInformationDialog}>Zamknij</Button>
            <Button onClick={handleCloseEditClientInformationDialog}>Zapisz</Button>
          </DialogActions>
        </Dialog>
      </div>
    </Box >
  );
}