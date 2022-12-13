import * as React from 'react';
import Box from '@mui/material/Box';
import FormControl from '@mui/material/FormControl';
import { useState } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { DataGrid, GridColDef, GridValueGetterParams } from '@mui/x-data-grid';

type Film = {
  label: string;
  year: number;
}

export default function Clients() {
    const [client, setClient] = useState<string | number>('');

    const top100Films: Film[] = [
        { label: 'The Shawshank Redemption', year: 1994 },
        { label: 'City of God', year: 2002 },
        { label: 'Se7en', year: 1995 },
        { label: 'The Silence of the Lambs', year: 1991 },
        { label: "It's a Wonderful Life", year: 1946 },
        { label: 'Life Is Beautiful', year: 1997 },
        { label: 'The Usual Suspects', year: 1995 },
        { label: 'Léon: The Professional', year: 1994 },
        { label: 'Spirited Away', year: 2001 },
        { label: 'Saving Private Ryan', year: 1998 },
        { label: 'Once Upon a Time in the West', year: 1968 },
        { label: 'American History X', year: 1998 },
        { label: 'Interstellar', year: 2014 },];

    const columns: GridColDef[] = [
        { field: 'id', headerName: 'ID', width: 100, sortable: true, },
        { field: 'firstName', headerName: 'First name', width: 130, sortable: true, },
        { field: 'lastName', headerName: 'Last name', width: 130, sortable: true, },
        {
            field: 'age',
            headerName: 'Age',
            type: 'number',
            width: 90,
            sortable: true,
        },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            valueGetter: (params: GridValueGetterParams) =>
                `${params.row.firstName || ''} ${params.row.lastName || ''}`,
        },
    ];

    const rows = [
        { id: 1, lastName: 'Snow', firstName: 'Jon', age: 35 },
        { id: 2, lastName: 'Lannister', firstName: 'Cersei', age: 42 },
        { id: 3, lastName: 'Lannister', firstName: 'Jaime', age: 45 },
        { id: 4, lastName: 'Stark', firstName: 'Arya', age: 16 },
        { id: 5, lastName: 'Targaryen', firstName: 'Daenerys', age: null },
        { id: 6, lastName: 'Melisandre', firstName: null, age: 150 },
        { id: 7, lastName: 'Clifford', firstName: 'Ferrara', age: 44 },
        { id: 8, lastName: 'Frances', firstName: 'Rossini', age: 36 },
        { id: 9, lastName: 'Roxie', firstName: 'Harvey', age: 65 },
    ];

    return (
        <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
                <Autocomplete
                    disablePortal
                    freeSolo
                    id="combo-box-demo"
                    onChange={(_event, newValue: string | Film | null) => {
                        if(typeof newValue === 'string'){
                          setClient(newValue);
                        }
                        if(typeof newValue !== 'string' && newValue?.year){
                          setClient(newValue.year);
                        }
                        console.log(newValue);
                    }}
                    options={top100Films}
                    sx={{ width: '100%' }}
                    renderInput={(params) => <TextField {...params} label="Kontrahent" />}
                />
            </FormControl>
            <div style={{ height: 400, width: '100%' }}>
                <DataGrid
                    rows={rows}
                    columns={columns}
                    pageSize={5}
                    rowsPerPageOptions={[5]}
                />
            </div>
        </Box>
    );
}