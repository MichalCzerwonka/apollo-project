import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import BlockIcon from '@mui/icons-material/Block';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Client, postNewClient, putEditClient } from '../../../api/ApiClients';
import React, { useState } from 'react';
import Alert, { AlertProps } from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';
import CloseIcon from '@mui/icons-material/Close';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import SaveAsIcon from '@mui/icons-material/SaveAs';

interface ClientAddEditFormProps {
    onClose: () => void,
    client?: Client
}

const ClientAddEditForm: React.FC<ClientAddEditFormProps> = ({ onClose, client }) => {
    const isEdit = !!client;


    const addClientSchema = yup.object().shape({
        kod: yup.string().required(),
        nazwa1: yup.string().required(),
        nazwa2: yup.string().nullable(),
        miasto: yup.string().required(),
        nip: yup.string().required(),
        ulica: yup.string().required(),
        kodPocztowy: yup.string().required(),
        poczta: yup.string().required(),
        telefon: yup.string().required(),
        email: yup.string().email()
    })

    const [openSnackbar, setOpenSnackbar] = React.useState(false);
    const handleCloseSnackbar = (event: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === 'clickaway') {
            return;
        }
    }
    const [errorMessage, setErrorMessage] = useState("");
    const submitHandler: SubmitHandler<Client> = (data: Client) => {
        if (isEdit) {
            putEditClient(data)
                .catch((error: any) => {
                    setErrorMessage(error.response.data.message);
                    setOpenSnackbar(true);
                });
        }
        else {
            postNewClient(data)
                .catch((error: any) => {
                    setErrorMessage(error.response.data.message);
                    setOpenSnackbar(true);
                });
        }

    }

    const { control, register, handleSubmit, watch, reset, formState: { errors } } = useForm<Client>({ resolver: yupResolver(addClientSchema), defaultValues: client });
    return <form onSubmit={handleSubmit(submitHandler)} className="form">
        <br />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
            <section>
                <Controller name="kod" control={control} render={({ field }) => (
                    <TextField {...field} label="Kod" fullWidth variant="outlined" error={!!errors.kod}
                        helperText={errors.kod ? errors.kod?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="nazwa1" control={control} render={({ field }) => (
                    <TextField {...field} label="Nazwa1" fullWidth variant="outlined" error={!!errors.nazwa1}
                        helperText={errors.nazwa1 ? errors.nazwa1?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="nazwa2" control={control} render={({ field }) => (
                    <TextField {...field} label="Nazwa2" fullWidth variant="outlined" error={!!errors.nazwa2}
                        helperText={errors.nazwa2 ? errors.nazwa2?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="miasto" control={control} render={({ field }) => (
                    <TextField {...field} label="Miasto" fullWidth variant="outlined" error={!!errors.miasto}
                        helperText={errors.miasto ? errors.miasto?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="nip" control={control} render={({ field }) => (
                    <TextField {...field} label="NIP" fullWidth variant="outlined" error={!!errors.nip}
                        helperText={errors.nip ? errors.nip?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="ulica" control={control} render={({ field }) => (
                    <TextField {...field} label="Ulica" fullWidth variant="outlined" error={!!errors.ulica}
                        helperText={errors.ulica ? errors.ulica?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="kodPocztowy" control={control} render={({ field }) => (
                    <TextField {...field} label="Kod pocztowy" fullWidth variant="outlined" error={!!errors.kodPocztowy}
                        helperText={errors.kodPocztowy ? errors.kodPocztowy?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="poczta" control={control} render={({ field }) => (
                    <TextField {...field} label="Poczta" fullWidth variant="outlined" error={!!errors.poczta}
                        helperText={errors.poczta ? errors.poczta?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="telefon" control={control} render={({ field }) => (
                    <TextField {...field} label="Telefon" fullWidth variant="outlined" error={!!errors.telefon}
                        helperText={errors.telefon ? errors.telefon?.message : ''} />
                )} />
            </section>
            <section>
                <Controller name="email" control={control} render={({ field }) => (
                    <TextField {...field} type="email" fullWidth label="Email" variant="outlined" error={!!errors.email}
                        helperText={errors.email ? errors.email?.message : ''} />
                )} />
            </section>
            <section>
                <Stack direction="row" spacing={3}>
                    <Button onClick={onClose}
                        style={{ margin: '10' }}
                        variant="contained"
                        endIcon={<BlockIcon />}>Anuluj</Button>

                    <Button type="submit"
                        variant="contained"
                        endIcon={isEdit ? (<> <SaveAsIcon /></>) : (<><PersonAddIcon /></>)}>
                        {isEdit ? "Zapisz zmiany" : "Dodaj"}
                    </Button>
                </Stack>
            </section>
        </div>

        <Snackbar
            open={openSnackbar}
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

export default ClientAddEditForm;