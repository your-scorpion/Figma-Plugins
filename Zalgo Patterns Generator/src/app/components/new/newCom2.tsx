import * as React from 'react';
import {useEffect, useState, useRef} from "react";
// @ts-ignore
import Alert from '@mui/material/Alert';
// @ts-ignore
import AlertTitle from '@mui/material/AlertTitle';



export function Error() {
    const [state, setState] = useState(null);

    return (
        <div className='App'>
            <h1>{state}</h1> 

             <Alert variant="outlined" align='left' severity="error">
             <AlertTitle>Empty?</AlertTitle>
              If there is nothing in the text area above, try to run the plugin the next day. 
              You have <strong>exhausted</strong> the number of requests to the server to generate the text.
            </Alert>
        </div>
        );
}
