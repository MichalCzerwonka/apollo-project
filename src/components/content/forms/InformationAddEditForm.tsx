import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import BlockIcon from '@mui/icons-material/Block';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Client, ClientInformation, ClientInformationType, postNewClientInformation, putEditClientInformation } from '../../../api/ApiClients';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack/Stack';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import PostAddIcon from '@mui/icons-material/PostAdd';
import { Checkbox, MenuItem } from '@mui/material';
import { useSnackbar } from 'notistack'

interface InformationAddEditFormProps {
    onClose: () => void,
    clientInformation?: ClientInformation,
    selectedClientCode?: string
    clients: Client[],
    clientInformationTypes: ClientInformationType[]
}

const InformationAddEditForm: React.FC<InformationAddEditFormProps> = ({ onClose, clientInformation, selectedClientCode, clients, clientInformationTypes }) => {
    const isEdit = !!clientInformation;
    let navigate = useNavigate();

    const addInformationSchema = yup.object().shape({
        kitKod: yup.string().required(),
        nazwa: yup.string().required(),
        opis: yup.string().required(),
    })

    yup.setLocale({
        mixed: {
            required: 'Pole obowiązkowe',
        },
    });

    useEffect(() => {
        window.addEventListener('keypress', e => {
            if (e.key === 'Escape') {
                onClose();
            }
        });
    }, []);

    const submitHandler: SubmitHandler<ClientInformation> = (data: ClientInformation) => {
        console.log(data.kntId);
        if (isEdit) {
            putEditClientInformation(data)
                .then((res: any) => {
                    enqueueSnackbar('Zmiany zostały wprowadzone.', {
                        anchorOrigin: { vertical: "bottom", horizontal: "left" },
                        variant: "info",
                        autoHideDuration: 3000
                    });
                })
                .catch((error: any) => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        navigate('/login');
                    }
                    enqueueSnackbar(error.response.data.message, {
                        anchorOrigin: { vertical: "bottom", horizontal: "left" },
                        variant: "error",
                        autoHideDuration: 3000
                    });
                });
        }
        else {
            postNewClientInformation(data, selectedClientCode)
                .then((res: any) => {
                    enqueueSnackbar('Informacja została dodana.', {
                        anchorOrigin: { vertical: "bottom", horizontal: "left" },
                        variant: "info",
                        autoHideDuration: 3000
                    });
                })
                .catch((error: any) => {
                    if (error.response.status === 401) {
                        localStorage.clear();
                        navigate('/login');
                    }
                    enqueueSnackbar(error.response.data.message, {
                        anchorOrigin: { vertical: "bottom", horizontal: "left" },
                        variant: "error",
                        autoHideDuration: 3000
                    });
                });
        }

    }
    // const editedClient = clients.filter(obj => {
    //     return obj.id === clientInformation?.kntId;
    // });

    // const editedClientInformationType = clientInformationTypes.filter(obj => {
    //     return obj.id === clientInformation?.kitId;
    // });

    const { control, handleSubmit, formState: { errors } } = useForm<ClientInformation>({ resolver: yupResolver(addInformationSchema), defaultValues: clientInformation });

    const { enqueueSnackbar } = useSnackbar();


    return <form onSubmit={handleSubmit(submitHandler)}>
        <br />
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gridGap: '20px' }}>
            <section>
                <Controller name="kntKod" control={control} render={({ field }) => (
                    <TextField {...field} value={selectedClientCode} disabled={true} label="Kontrahent" multiline fullWidth variant="outlined" error={!!errors.kntKod}
                        helperText={errors.kntKod ? errors.kntKod?.message : ''} />
                )} />
                {/* <Controller
                    name="kntId"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            options={clients.map((client) => ({ id: client.id, label: client.kod }))}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(client) => client.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Kontrahent"
                                />
                            )}
                            onChange={(_, data) => {
                                onChange(data);
                                //return data?.id;
                            }}
                            //value={value}
                            defaultValue={editedClient.map((client) => ({ id: client.id, label: client.kod }))[0]}
                        />

                    )}
                /> */}

            </section>
            <section>
                <Controller name="kitKod" control={control} render={({ field }) => (
                    <TextField select
                        label="Typ"
                        {...field}
                        fullWidth
                        error={!!errors.kitKod}
                        helperText={errors.kitKod ? errors.kitKod?.message : ''}
                        defaultValue={clientInformation?.kitKod ? clientInformation?.kitKod : undefined}>
                        {clientInformationTypes.map((type) => (
                            <MenuItem key={type.id} value={type.kod}>
                                {type.kod}
                            </MenuItem>
                        ))}
                    </TextField>
                )} />
                {/* <Controller
                    name="kitId"
                    control={control}
                    render={({ field: { onChange, value } }) => (
                        <Autocomplete
                            options={clientInformationTypes.map((clientInformation) => ({ id: clientInformation.id, label: clientInformation.kod }))}
                            isOptionEqualToValue={(option, value) => option.id === value.id}
                            getOptionLabel={(clientInformation) => clientInformation.label}
                            renderInput={(params) => (
                                <TextField
                                    {...params}
                                    variant="outlined"
                                    label="Typ"
                                />
                            )}
                            onChange={(_, data) => {
                                onChange(data);
                                return data;
                            }}
                            defaultValue={editedClientInformationType.map((clientInformation) => ({ id: clientInformation.id, label: clientInformation.kod }))[0]}
                        />

                    )}
                /> */}
            </section>
            <section>
                <Controller name="nazwa" control={control} render={({ field }) => (
                    <TextField {...field} label="Nazwa" multiline fullWidth variant="outlined" error={!!errors.nazwa}
                        helperText={errors.nazwa ? errors.nazwa?.message : ''} />
                )} />
                <Controller
                    name="archiwalny"
                    control={control}
                    rules={{ required: true }}
                    render={({ field }) => <Checkbox {...field} checked={field.value} />}
                />
                Archiwalny
                <Stack direction="row" spacing={3} my={3}>
                    <Button type="submit"
                        variant="contained"
                        color="success"
                        endIcon={isEdit ? (<> <SaveAsIcon /></>) : (<><PostAddIcon /></>)}>
                        {isEdit ? "Zapisz zmiany" : "Dodaj wpis"}
                    </Button>
                    <Button onClick={onClose}
                        variant="contained"
                        color="error"
                        endIcon={<BlockIcon />}>Zamknij</Button>
                </Stack>
            </section>
            <section>
                <Controller name="opis" control={control} render={({ field }) => (
                    <TextField {...field} fullWidth label="Opis" multiline rows={25} variant="outlined" error={!!errors.opis}
                        helperText={errors.opis ? errors.opis?.message : ''} />
                )} />
            </section>
            <section>

            </section>
        </div>
    </form>

}

export default InformationAddEditForm;