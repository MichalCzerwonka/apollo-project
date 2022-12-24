import { AlertTitle, IconButton, Snackbar } from '@mui/material';
import Slide from '@mui/material';
import Alert from '@mui/material';
import { useState } from 'react';
import CloseIcon from '@mui/icons-material/Close';

function SnackbarHOC<T>(WrappedComponent: React.ComponentType<T>, Alert: React.ElementType) {
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("I'm a custom snackbar");
    const [duration, setDuration] = useState(2000);
    const [severity, setSeverity] = useState(
        "success"
    ); /** error | warning | info */

    return (props: T) => {


        const showMessage = (message: string, severity = "success", duration = 2000) => {
            setMessage(message);
            setSeverity(severity);
            setDuration(duration);
            setOpen(true);
        };

        const handleClose = (event: React.SyntheticEvent | Event, reason?: string) => {
            if (reason === 'clickaway') {
                return;
            }
        }

        return (
            <>
                <WrappedComponent {...props} snackbarShowMessage={showMessage} />
                <Snackbar
                    anchorOrigin={{
                        vertical: "bottom",
                        horizontal: "center"
                    }}
                    autoHideDuration={duration}
                    open={open}
                    onClose={handleClose}
                //TransitionComponent={Slide}
                >
                    <Alert severity="error"
                        sx={{ width: '100%' }}

                        action={
                            <IconButton
                                aria-label="close"
                                color="inherit"
                                size="small"
                                onClick={handleClose}>
                                <CloseIcon fontSize="inherit" />
                            </IconButton>
                        }>
                        {message}
                    </Alert>
                </Snackbar>
            </>
        );
    };
};

export default SnackbarHOC;
