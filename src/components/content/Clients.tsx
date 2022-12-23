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
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import BlockIcon from '@mui/icons-material/Block';

import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';
import { ClientInformation, ClientInformationType, getClientInformationTypes, getClients, getSelectedClient, postNewClient } from '../../api/ApiClients';
import { useEffect } from 'react';
import { Client } from '../../api/ApiClients';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteSweepIcon from '@mui/icons-material/DeleteSweep';
import { textAlign } from '@mui/system';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import RestartAltIcon from '@mui/icons-material/RestartAlt';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [selectedClientInformation, setSelectedClientInformation] = useState<ClientInformation>();

  const [clientInformationTypes, setClientInformationTypes] = useState<ClientInformationType[]>([]);
  const [selectedClientInformationType, setSelectedClientInformationType] = useState<ClientInformationType>();


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

  const addClientSchema = yup.object().shape({
    kod: yup.string().required(),
    nazwa1: yup.string().required(),
    nazwa2: yup.string(),
    miasto: yup.string().required(),
    nip: yup.string().required(),
    ulica: yup.string().required(),
    kodPocztowy: yup.string().required(),
    poczta: yup.string().required(),
    telefon: yup.string().required(),
    email: yup.string().email()
  })

  const addClientInformationSchema = yup.object().shape({
    kntId: yup.number().required(),
    kitId: yup.number().required(),
    kitNazwa: yup.string().required(),
    nazwa: yup.string().required(),
    opis: yup.string().required(),
    archiwalny: yup.string(),
  })

  const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm<Client>({ resolver: yupResolver(addClientSchema) });

  const { control: controlInformation, register: registerInformation, handleSubmit: handleSubmitInformation, watch: watchInformation, reset: resetInformation, formState: { errors: errorsInformation } } = useForm<ClientInformation>({ resolver: yupResolver(addClientInformationSchema) });

  const addClientSubmitHandler: SubmitHandler<Client> = (data: Client) => {
    postNewClient(data)
      .catch((error: any) => {
        console.log(error);
      });
  }
  const addClientInformationSubmitHandler: SubmitHandler<ClientInformation> = (data: ClientInformation) => {
    console.log(data);
  }
  const [selectedInformationClient, setSelectedInformationClient] = React.useState<number>();
  const handleInformationClientChange = (event: SelectChangeEvent) => {
    setSelectedInformationClient(event.target.value as unknown as number);
    console.log(selectedInformationClient);
  };



  useEffect(() => {
    getClients().then((res) => {
      setClients(res.data);
    });
    getClientInformationTypes().then((res) => {
      setClientInformationTypes(res.data);
    });
  }, []);

  const modificationToolTip = `Modyfikował: ${selectedClientInformation?.opeModyfikowal} \n
  Data modyfikacji: ${selectedClientInformation?.dataModyfikacji}`;

  // const informationTableDef: GridColDef[] = [
  //   { field: 'kitId', headerName: 'ID typu', width: 100, sortable: true, },
  //   { field: 'nazwa', headerName: 'Nazwa', width: 130, sortable: true, },
  // ];

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

        <Grid container spacing={2} style={{ textAlign: 'left', flex: 1, flexWrap: 'wrap', flexShrink: 1 }}>
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
          <Grid item xs={5} >
            <Card variant="outlined" >
              <CardContent>
                <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
                  {selectedClientInformation?.nazwa}
                </Typography>
                <h5 style={{ textAlign: 'left', flex: 1, flexWrap: 'wrap', flexShrink: 1 }} dangerouslySetInnerHTML={{ __html: selectedClientInformation?.opis.replace(/\n/g, "<br />") || "" }}></h5>
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
          <DialogTitle>Nowy klient</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmit(addClientSubmitHandler)}>
              <br />
              <Controller name="kod" control={control} render={({ field }) => (
                <TextField {...field} label="Kod" variant="outlined" error={!!errors.kod}
                  helperText={errors.kod ? errors.kod?.message : ''} />
              )} />
              <br />
              {errors.kod && errors.kod?.message && <span>{errors.kod.message}</span>}
              <br />
              <Controller name="nazwa1" control={control} render={({ field }) => (
                <TextField {...field} label="Nazwa1" variant="outlined" error={!!errors.nazwa1}
                  helperText={errors.nazwa1 ? errors.nazwa1?.message : ''} />
              )} />
              <br />
              {errors.nazwa1 && errors.nazwa1?.message && <span>{errors.nazwa1.message}</span>}
              <br />
              <Controller name="nazwa2" control={control} render={({ field }) => (
                <TextField {...field} label="Nazwa2" variant="outlined" error={!!errors.nazwa2}
                  helperText={errors.nazwa2 ? errors.nazwa2?.message : ''} />
              )} />
              <br />
              <br />
              <Controller name="miasto" control={control} render={({ field }) => (
                <TextField {...field} label="Miasto" variant="outlined" error={!!errors.miasto}
                  helperText={errors.miasto ? errors.miasto?.message : ''} />
              )} />
              <br />
              {errors.miasto && errors.miasto?.message && <span>{errors.miasto.message}</span>}
              <br />
              <Controller name="nip" control={control} render={({ field }) => (
                <TextField {...field} label="NIP" variant="outlined" error={!!errors.nip}
                  helperText={errors.nip ? errors.nip?.message : ''} />
              )} />
              <br />
              {errors.nip && errors.nip?.message && <span>{errors.nip.message}</span>}
              <br />
              <Controller name="ulica" control={control} render={({ field }) => (
                <TextField {...field} label="Ulica" variant="outlined" error={!!errors.ulica}
                  helperText={errors.ulica ? errors.ulica?.message : ''} />
              )} />
              <br />
              {errors.ulica && errors.ulica?.message && <span>{errors.ulica.message}</span>}
              <br />
              <Controller name="kodPocztowy" control={control} render={({ field }) => (
                <TextField {...field} label="Kod pocztowy" variant="outlined" error={!!errors.kodPocztowy}
                  helperText={errors.kodPocztowy ? errors.kodPocztowy?.message : ''} />
              )} />
              <br />
              {errors.kodPocztowy && errors.kodPocztowy?.message && <span>{errors.kodPocztowy.message}</span>}
              <br />
              <Controller name="poczta" control={control} render={({ field }) => (
                <TextField {...field} label="Poczta" variant="outlined" error={!!errors.poczta}
                  helperText={errors.poczta ? errors.poczta?.message : ''} />
              )} />
              <br />
              {errors.poczta && errors.poczta?.message && <span>{errors.poczta.message}</span>}
              <br />
              <Controller name="telefon" control={control} render={({ field }) => (
                <TextField {...field} label="Telefon" variant="outlined" error={!!errors.telefon}
                  helperText={errors.telefon ? errors.telefon?.message : ''} />
              )} />
              <br />
              {errors.telefon && errors.telefon?.message && <span>{errors.telefon.message}</span>}
              <br />
              <Controller name="email" control={control} render={({ field }) => (
                <TextField {...field} type="email" label="Email" variant="outlined" error={!!errors.email}
                  helperText={errors.email ? errors.email?.message : ''} />
              )} />
              <br />
              <br />
              <Button onClick={handleCloseCreateClientDialog}
                variant="contained"
                endIcon={<BlockIcon />}>Anuluj</Button>
              <Button onClick={handleSubmit(addClientSubmitHandler)}
                variant="contained"
                endIcon={<PersonAddIcon />}>Dodaj</Button>
            </form>
          </DialogContent>
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
          <DialogTitle>Nowa informacja</DialogTitle>
          <DialogContent>
            <form onSubmit={handleSubmitInformation(addClientInformationSubmitHandler)}>
              <br />
              <Controller name="kntId" control={controlInformation} render={({ field }) => (<Autocomplete<{ id: number, label: string }>
                autoHighlight
                id="combo-box-demo"
                onChange={(_event, value) => {
                  if (value !== null) {
                  };
                }
                }
                options={clients.map((client) => ({ id: client.id, label: client.kod }))}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Kontrahent" />}
              />)} />
              <br />
              <Controller name="kitId" control={controlInformation} render={({ field }) => (<Autocomplete<{ id: number, label: string }>
                autoHighlight
                id="combo-box-demo"
                onChange={(_event, value) => {
                  if (value !== null) {
                  };
                }
                }
                options={clientInformationTypes.map((informationType) => ({ id: informationType.id, label: informationType.kod }))}
                sx={{ width: '100%' }}
                renderInput={(params) => <TextField {...params} label="Typ informacji" />}
              />)} />
              <br />
              <Controller name="nazwa" control={controlInformation} render={({ field }) => (
                <TextField {...field} label="Nazwa" variant="outlined" error={!!errorsInformation.nazwa}
                  helperText={errorsInformation.nazwa ? errorsInformation.nazwa?.message : ''} />
              )} />
              <br />
              {errorsInformation.nazwa && errorsInformation.nazwa?.message && <span>{errorsInformation.nazwa.message}</span>}
              <br />
              <Controller name="opis" control={controlInformation} render={({ field }) => (
                <TextField {...field} fullWidth label="Opis" variant="outlined" error={!!errorsInformation.opis}
                  helperText={errorsInformation.opis ? errorsInformation.opis?.message : ''} />
              )} />
              <br />
              {errorsInformation.opis && errorsInformation.opis?.message && <span>{errorsInformation.opis.message}</span>}
              <br />
              <br />
              <Button onClick={handleCloseAddClientInformationDialog}
                variant="contained"
                endIcon={<BlockIcon />}>Anuluj</Button>
              <Button onClick={handleSubmitInformation(addClientInformationSubmitHandler)}
                variant="contained"
                endIcon={<PersonAddIcon />}>Dodaj</Button>
            </form>
          </DialogContent>
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