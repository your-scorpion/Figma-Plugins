import * as React from 'react';
import { useEffect, useState, useRef } from "react";
// @ts-ignore
import Alert from '@mui/material/Alert';


export function App2() {
    const [state, setState] = useState(null);

    return (
        <div className='App'>
            <h1>{state}</h1>

            <Alert severity="success" color="info" align='left'>
                Performance alert. More than ten elements can drop performance dramatically.
            </Alert>
        </div>
    );
}
