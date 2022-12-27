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
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import InventoryIcon from '@mui/icons-material/Inventory';
import CheckIcon from '@mui/icons-material/Check';
import EditAttributesIcon from '@mui/icons-material/EditAttributes';
import Snackbar from '@mui/material/Snackbar';
import { ClientInformation, ClientInformationType, getClientInformationTypes, getClients, getSelectedClient } from '../../api/ApiClients';
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
import ClientAddEditForm from './forms/ClientAddEditForm';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import InformationAddEditForm from './forms/InformationAddEditForm';
import { DataGrid, GridColDef, gridColumnGroupingSelector, GridFilterModel, GridSelectionModel, GridSortItem, GridValueGetterParams } from '@mui/x-data-grid';
import { SnackbarProvider, useSnackbar } from 'notistack';
import PersonSearchIcon from '@mui/icons-material/PersonSearch';
import EditRoadIcon from '@mui/icons-material/EditRoad';


export default function Clients() {
  const { enqueueSnackbar } = useSnackbar();

  const [clients, setClients] = useState<Client[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client>();
  const [selectedClientInformation, setSelectedClientInformation] = useState<ClientInformation>();

  const [showClientInformations, setShowClientInformations] = useState(false);
  const [showInformationData, setShowInformationData] = useState(false);

  const [clientInformationTypes, setClientInformationTypes] = useState<ClientInformationType[]>([]);

  const [editClientButtonDisabled, setEditClientButtonDisabled] = React.useState(true);
  const [editInformationButtonDisabled, setEditInformationButtonDisabled] = React.useState(true);

  const [isEditClient, setIsEditClient] = useState(false);
  const [isEditClientInformation, setIsEditClientInformation] = useState(false);
  const [openAddEditClientDialog, setOpenAddEditClientDialog] = React.useState(false);
  const [openAddEditClientInformationDialog, setOpenAddEditClientInformationDialog] = React.useState(false);

  let navigate = useNavigate();

  const handleCloseCreateEditClientDialog = () => {
    setOpenAddEditClientDialog(false);
    setIsEditClient(false);
  };
  const handleCloseAddEditClientInformationDialog = () => {
    setOpenAddEditClientInformationDialog(false);
    setIsEditClientInformation(false);
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

  const clientInformationColumns: GridColDef[] = [
    { field: 'kitNazwa', headerName: 'Typ', minWidth: 150, flex: 0.1, },
    { field: 'nazwa', headerName: 'Nazwa', minWidth: 150, flex: 0.7 },
    {
      field: 'archiwalny', headerName: 'Archiwum', flex: 0.2,
      renderCell: (params) => {
        return params.value ? (
          <InventoryIcon
          />
        ) : (
          <EditAttributesIcon
          />
        );
      },
    },
  ];

  const [sortModel, setSortModel] = React.useState<GridSortItem[]>(
    [{
      field: 'kitNazwa',
      sort: 'asc',
    },
    ]
  );
  const [filterModel, setFilterModel] = React.useState<GridFilterModel>({
    items: [{ columnField: 'archiwalny', operatorValue: 'contains', value: 'false' }],
  });

  const onRowsSelectionHandler = (information: GridSelectionModel) => {
    const selectedRowsData = information.map((id) => selectedClient?.kntInformacje.find((row) => row.id === id));
    setSelectedClientInformation(selectedRowsData[0]);
    setShowInformationData(true);
    handleCanUserEditInformationButtonDisabled();
  };


  useEffect(() => {
    getClients().then((res) => {
      setClients(res.data);
    })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
        enqueueSnackbar(error.response.data.message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
          autoHideDuration: 4000
        });
      });

    getClientInformationTypes().then((res) => {
      setClientInformationTypes(res.data);
    })
      .catch((error) => {
        if (error.response.status === 401) {
          localStorage.clear();
          navigate('/login');
        }
        enqueueSnackbar(error.response.data.message, {
          anchorOrigin: { vertical: "bottom", horizontal: "right" },
          variant: "error",
          autoHideDuration: 4000
        });
      });
  }, []);

  const modificationToolTip = `Modyfikował: ${selectedClientInformation?.opeModyfikowal} \n
  Data modyfikacji: ${selectedClientInformation?.dataModyfikacji}`;

  return (
    <Box sx={{ minWidth: 120 }}>
      <Grid container spacing={2} mb={2}>
        <Grid item xs={10}>
          <Autocomplete<{ id: number, label: string }>
            disablePortal
            autoHighlight
            id="combo-box-demo"
            onChange={(_event, value) => {
              if (value !== null) {
                getSelectedClient(value.id).then((res) => {
                  setSelectedClient(res.data);
                  setShowClientInformations(true);
                  handleCanUserEditClient();
                }).catch((error) => {
                  if (error.response.status === 401) {
                    localStorage.clear();
                    navigate('/login');
                  }
                  enqueueSnackbar(error.response.data.message, {
                    anchorOrigin: { vertical: "bottom", horizontal: "right" },
                    variant: "error",
                    autoHideDuration: 4000
                  });
                });
              }
              else {
                setShowClientInformations(false);
                setShowInformationData(false);
                setEditClientButtonDisabled(true);
                setEditInformationButtonDisabled(true);
                setSelectedClient(undefined);
              }
            }}
            options={clients.map((client) => ({ id: client.id, label: `${client.kod} - ${client.nazwa1}` }))}
            sx={{ width: '100%' }}
            renderInput={(params) => <TextField {...params} label="Kontrahent" />}
          />
        </Grid>
        <Grid item xs={1}>
          <Button size="large"
            startIcon={<PersonSearchIcon />}
            disabled={editClientButtonDisabled}
            variant="contained"
            color="warning"
            sx={{ width: '100%' }}
            onClick={() => {
              setOpenAddEditClientDialog(true);
              setIsEditClient(true);

            }}>
            Edytuj
          </Button>
        </Grid>
        <Grid item xs={1}>
          <Button size="large"
            startIcon={<PersonAddIcon />}
            variant="contained"
            color="success"
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
                variant="contained"
                color="success"
                onClick={() => {
                  setIsEditClientInformation(false);
                  setOpenAddEditClientInformationDialog(true);
                }}>
                Dodaj wpis
              </Button>
              <Button style={{ marginRight: '10px', marginLeft: '10px' }}
                startIcon={<EditRoadIcon />}
                disabled={editInformationButtonDisabled}
                variant="contained"
                color="warning"
                onClick={() => {
                  setIsEditClientInformation(true);
                  setOpenAddEditClientInformationDialog(true);
                }}>
                Edytuj wpis
              </Button>
            </Box>
            <div style={{ height: 650, width: '100%' }}>
              {showClientInformations && (<DataGrid
                rows={selectedClient ? selectedClient.kntInformacje : []}
                columns={clientInformationColumns}
                pageSize={10}
                onSelectionModelChange={(ids) => onRowsSelectionHandler(ids)}
                sortingOrder={['desc', 'asc']}
                sortModel={sortModel}
                onSortModelChange={(model) => setSortModel(model)}
                filterModel={filterModel}
                onFilterModelChange={(newFilterModel) => setFilterModel(newFilterModel)}

                //loading={true}
                rowsPerPageOptions={[10]}
              />)}
            </div>
            {/* <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table" id="table">
                <TableHead>
                  <TableRow>
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
                        <TableCell component="th" scope="row" width={100}>
                          {informacja.kitNazwa}
                        </TableCell>
                        <TableCell component="th" scope="row">
                          <Button
                            onClick={() => {
                              setSelectedClientInformation(informacja);
                              handleCanUserEditInformationButtonDisabled();
                            }}
                          >{informacja.nazwa}</Button>
                        </TableCell>
                      </TableRow>
                    ))}

                </TableBody>
              </Table>
            </TableContainer> */}
          </Grid>
          <Grid item xs={5} >
            {showInformationData && (<Box overflow="auto" flex={1} flexDirection="column" display="flex" p={2}
              style={{ textAlign: 'left', backgroundColor: "whitesmoke" }} >
              <Typography sx={{ fontSize: 24 }} color="text.primary" gutterBottom>
                {selectedClientInformation?.nazwa}
              </Typography>
              <h5 style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', flexShrink: 1 }} dangerouslySetInnerHTML={{ __html: selectedClientInformation?.opis.replace(/\n/g, "<br />") || "" }}></h5>
              <Tooltip title={modificationToolTip}>
                <IconButton>
                  <HelpOutlineIcon />
                </IconButton>
              </Tooltip>
            </Box>
            )}
          </Grid>
        </Grid>
        {/*  Dodawanie / edycja klienta */}
        <Dialog
          open={openAddEditClientDialog}
          onClose={handleCloseCreateEditClientDialog}
          fullScreen>
          <DialogContent>
            <ClientAddEditForm onClose={handleCloseCreateEditClientDialog} client={isEditClient ? selectedClient : undefined} />
          </DialogContent>
        </Dialog>
        {/*  Dodawanie / edycja informacji */}
        <Dialog
          open={openAddEditClientInformationDialog}
          onClose={handleCloseAddEditClientInformationDialog}
          fullScreen>
          <DialogContent>
            <InformationAddEditForm onClose={handleCloseAddEditClientInformationDialog}
              clientInformation={isEditClientInformation ? selectedClientInformation : undefined}
              clients={clients} clientInformationTypes={clientInformationTypes} />
          </DialogContent>
        </Dialog>
      </div>
    </Box >
  );
}