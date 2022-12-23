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
import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';

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
import ClientAddEditForm from './forms/ClientAddEditForm';

export default function Clients() {
  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [selectedClientInformation, setSelectedClientInformation] = useState<ClientInformation>();

  const [clientInformationTypes, setClientInformationTypes] = useState<ClientInformationType[]>([]);
  const [selectedClientInformationType, setSelectedClientInformationType] = useState<ClientInformationType>();


  const [editClientButtonDisabled, setEditClientButtonDisabled] = React.useState(true);
  const [editInformationButtonDisabled, setEditInformationButtonDisabled] = React.useState(true);

  const [isEditClient, setIsEditClient] = useState(false);
  const [openAddEditClientDialog, setOpenAddEditClientDialog] = React.useState(false);
  const [openCreateClientInformationDialog, setOpenCreateClientInformationDialog] = React.useState(false);
  const [openEditClientInformationDialog, setOpenEditClientInformationDialog] = React.useState(false);

  const handleCloseCreateEditClientDialog = () => {
    setOpenAddEditClientDialog(false);
    setIsEditClient(false);
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

  const addClientInformationSchema = yup.object().shape({
    kntId: yup.number().required(),
    kitId: yup.number().required(),
    kitNazwa: yup.string().required(),
    nazwa: yup.string().required(),
    opis: yup.string().required(),
    archiwalny: yup.string(),
  })

  const [openSnackbar, setOpenSnackbar] = React.useState(false);
  const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
  }
  const [errorMessage, setErrorMessage] = useState("");

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
  // const ControlledAutocomplete = ({ options = [], renderInput, getOptionLabel, onChange: ignored, control, defaultValue, name, renderOption }) => {
  //   return (
  //     <Controller
  //       render={({ onChange, ...props }) => (
  //         <Autocomplete
  //           options={options}
  //           getOptionLabel={getOptionLabel}
  //           renderOption={renderOption}
  //           renderInput={renderInput}
  //           onChange={(e, data) => onChange(data)}
  //           {...props}
  //         />
  //       )}
  //       onChange={([, data]) => data}
  //       defaultValue={defaultValue}
  //       name={name}
  //       control={control}
  //     />
  //   );
  // }


  useEffect(() => {
    getClients().then((res) => {
      setClients(res.data);
    })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setOpenSnackbar(true);
      });

    getClientInformationTypes().then((res) => {
      setClientInformationTypes(res.data);
    })
      .catch((error) => {
        setErrorMessage(error.response.data.message);
        setOpenSnackbar(true);
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
                }).catch((error) => {
                  setErrorMessage(error.response.data.message);
                  setOpenSnackbar(true);
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
              setOpenAddEditClientDialog(true);
              setIsEditClient(true);
            }}>
            Edytuj
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button variant="outlined" size="large"
            startIcon={<PersonAddIcon />}
            sx={{ width: '100%' }}
            onClick={() => {
              setOpenAddEditClientDialog(true);
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
          open={openAddEditClientDialog}
          onClose={handleCloseCreateEditClientDialog}
          fullScreen>
          <DialogTitle>Klient</DialogTitle>
          <DialogContent>
            <ClientAddEditForm onClose={handleCloseCreateEditClientDialog} client={isEditClient ? selectedClient : undefined} />
          </DialogContent>
        </Dialog>

        {/* Edycja klienta
        <Dialog
          open={openEditClientDialog}
          onClose={handleCloseEditClientDialog}
          fullScreen>
          <DialogContent>
                
          </DialogContent>
        </Dialog> */}

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
                    field.onChange(value.id)
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
                    field.onChange(value.id)
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
      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
        onClose={handleCloseSnackbar}
      >
        <Alert severity="error"
          sx={{ width: '100%' }}

          action={
            <IconButton
              aria-label="close"
              color="inherit"
              size="small"
              onClick={() => {
                setOpenSnackbar(false);
              }}
            >
              <CloseIcon fontSize="inherit" />
            </IconButton>
          }>
          <AlertTitle>Wystąpił błąd</AlertTitle>
          {errorMessage}
        </Alert>
      </Snackbar>
    </Box >
  );
}