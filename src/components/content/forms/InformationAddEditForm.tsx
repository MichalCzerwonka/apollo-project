import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Client, ClientInformation, ClientInformationType } from '../../../api/ApiClients';
import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete/Autocomplete';
import Stack from '@mui/material/Stack/Stack';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Snackbar, Alert, IconButton, AlertTitle } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface InformationAddEditFormProps {
    onClose: () => void,
    clientInformation?: ClientInformation,
    clients: Client[],
    clientInformationTypes: ClientInformationType[]
}

const InformationAddEditForm: React.FC<InformationAddEditFormProps> = ({ onClose, clientInformation, clients, clientInformationTypes }) => {
    const isEdit = !!clientInformation;
    let navigate = useNavigate();

    const addInformationSchema = yup.object().shape({
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
    const submitHandler: SubmitHandler<ClientInformation> = (data: ClientInformation) => {
        if (isEdit) {

        }
        else {

        }

    }

    const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm<ClientInformation>({ resolver: yupResolver(addInformationSchema), defaultValues: clientInformation });

    const editedClient = clients.filter(obj => {
        return obj.id === clientInformation?.kntId;
    });

    const editedClientInformationType = clientInformationTypes.filter(obj => {
        return obj.id === clientInformation?.kitId;
    });

    // console.log(editedClient);
    // console.log(editedClientInformationType);
    return <form onSubmit={handleSubmit(submitHandler)}>
        <br />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
            <section>
                <Controller name="kntId" control={control} render={({ field }) => (<Autocomplete<{ id: number, label: string }>
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
                    renderInput={(params) => <TextField {...params} label="Kontrahent" defaultValue="//todo: jak tu wsadzić editedClient" />}
                />)} />
            </section>
            <section>
                <Controller name="kitId" control={control} render={({ field }) => (<Autocomplete<{ id: number, label: string }>
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
                    renderInput={(params) => <TextField {...params} label="Typ informacji" defaultValue="//todo: jak tu wsadzić editedClientInformationType" />}
                />)} />
            </section>
            <section>
                <Controller name="nazwa" control={control} render={({ field }) => (
                    <TextField {...field} label="Nazwa" multiline fullWidth variant="outlined" error={!!errors.nazwa}
                        helperText={errors.nazwa ? errors.nazwa?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="opis" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth label="Opis" multiline rows={25} variant="outlined" error={!!errors.opis}
                        helperText={errors.opis ? errors.opis?.message : ''} />
                )} />
            </section>
            <section>
                <Stack direction="row" spacing={3}>
                    <Button onClick={onClose}
                        variant="contained"
                        endIcon={<BlockIcon />}>Anuluj</Button>
                    <Button type="submit"
                        variant="contained"
                        endIcon={isEdit ? (<> <SaveAsIcon /></>) : (<><PostAddIcon /></>)}>
                        {isEdit ? "Zapisz zmiany" : "Dodaj"}
                    </Button>
                </Stack>
            </section>
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
    </form>

}

export default InformationAddEditForm;