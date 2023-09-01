import React, { useState, useEffect } from 'react';
import { keyframes } from '@emotion/react';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import Zoom from '@mui/material/Zoom';
import FormHelperText from '@mui/material/FormHelperText';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress from '@mui/material/LinearProgress';
import Collapse from '@mui/material/Collapse';
import Grow from '@mui/material/Grow';


const inputAnimation = keyframes `
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  75% { transform: scale(0.98); }
  100% { transform: scale(1); }
`;

const animatedInputStyles = {
    '&:hover': {
        animation: `${inputAnimation} 0.5s linear`,
    },
};

const App = () => {
    const [emailAddress, setEmailAddress] = useState('johndoe@example.com');
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    // @ts-ignore
    const [shouldAnimate, setShouldAnimate] = useState(false);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const response = await fetch(`https://www.disify.com/api/email/${emailAddress}`);
                if (response.status === 404 || response.status === 400) {
                    throw new Error('Something went wrong');
                } else if (!response.ok) {
                    console.clear();
                }
                const data = await response.json();
                setData(data);
                setShouldAnimate(true);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [emailAddress]);

    return (
        <Box sx={{ width: '100%', pt: 2.8 }}>
      {loading && (
        <span>
          <span className="hover-loader_actor">
            <span>
              <Collapse in={Boolean(loading)}>
                <LinearProgress sx={{ zIndex: '99999', height: '12px',mt: "-30px" }} color="info" />
              </Collapse>
            </span>
          </span>
        </span>
      )}
      <Stack spacing={2}>
        {!emailAddress && (
          <div style={{ backgroundColor: '#FFEBEE', padding: '8px' }}>
            <Collapse in={Boolean(!loading)}>
              <Typography variant="body1" style={{ color: '#D74C4C' }}>
                Please enter an email address to continue.
              </Typography>
            </Collapse>
          </div>
        )}
        <TextField
          className="setEmailAddress"
          id="outlined-basic"
          sx={{
            boxShadow: '0 19px 38px rgba(248,249,251,0.70), 0 15px 12px rgba(241,243,245,0.70);',
            minWidth: 300,
            backgroundColor: '#FFFFFF',
            ...animatedInputStyles,
            '&:focus': {
              outline: 'none',
            },
          }}
          onChange={(e) => setEmailAddress(e.target.value)}
          value={emailAddress}
          placeholder="user@example.com"
          label="Enter E-mail address:"
          variant="outlined"
        />
        <Paper sx={{ backgroundColor: '#F7F8F9', boxShadow: '0 19px 38px rgba(248,249,251,0.42), 0 15px 12px rgba(241,243,245,0.70);' }}>
          <Grid container rowSpacing={0} columnSpacing={{ xs: -8, sm: 22, md: 12 }}>
            {data && (
              <>
                {emailAddress && (
                  <Grow in={Boolean(emailAddress)}><Paper sx={{ mt: -1, backgroundColor: '#E2E3E8', borderRadius: '33px', padding: '8px' }}>
                    <FormHelperText id="component-helper-text">
                      The address looks like an email:
                      <span style={{ color: data.format === ' ✅' ? '#020202' : data.format === ' Nope' ? '#D74C4C' : '#343434' }}>
                        {data.format ? ' ✅' : data.format === null || data.format === '' ? ' not valid so far...' : ' Nope'}
                      </span>
                    </FormHelperText>
                  </Paper></Grow>
                )}
                <Stack spacing={{ xs: 1, sm: 2, mt: 3 }} direction="column" useFlexGap flexWrap="wrap" sx={{padding: '8px' }}>
                  <Collapse in={Boolean(emailAddress)}>
                    <Grid sx={{ mt: 2 }}>
                      {emailAddress && (
                        <Tooltip TransitionComponent={Zoom} followCursor={true} title={<h3 style={{ color: 'white', lineHeight: '18px' }}>
                          DNS is used in email to find the correct mail server for a particular domain. Without DNS, emails may be unreliable and insecure, with a higher risk of spam and phishing attacks.
                        </h3>}>
                          <Paper className="hover-item" sx={{ wordWrap: 'break-word', padding: '12px', backgroundColor: data.disposable ? '#FDF4F4' : '#ffffff' }}>
                            <Typography variant="body1" style={{ color: '#A9AEAF' }}>
                              DNS:
                            </Typography>
                            <Typography variant="body1" style={{ color: data.dns ? '#4FBCB6' : '#D74C4C' }}>
                              {data.dns ? 'All well' : 'Invalid MX or disposable email for domain'}
                            </Typography>
                            <Typography variant="h6">
                              <div id="json-data-dns"></div>
                            </Typography>
                          </Paper>
                        </Tooltip>
                      )}
                    </Grid>
                  </Collapse>
                  <Grid>
                    {emailAddress && (
                      <Paper sx={{ padding: '12px', backgroundColor: data.disposable ? '#ffffff' : '#ffffff' }}>
                        <Typography variant="body1" style={{ color: '#A9AEAF', whiteSpace: 'nowrap' }}>
                          Domain:
                        </Typography>
                        <Typography variant="body1" style={{ color: data.domain ? '#020202' : '#D74C4C', whiteSpace: 'break-spaces', wordWrap: 'break-word' }}>
                          {data.domain || 'Unknown'}
                        </Typography>
                        <Typography variant="h6">
                          <div id="json-data"></div>
                        </Typography>
                      </Paper>
                    )}
                  </Grid>
                  <Stack spacing={{ xs: 1, sm: 2, mt: 3 }} direction="row" useFlexGap flexWrap="wrap">
                    {emailAddress && (
                      <Collapse in={Boolean(emailAddress)}>
                        <Paper sx={{ padding: '12px', backgroundColor: data.disposable ? '#FDF4F4' : '#ffffff'}}>
                          <div>
                            <Typography variant="body1" style={{ color: '#A9AEAF',  whiteSpace: 'nowrap' }}>
                              Conclusion:
                            </Typography>
                            <Typography variant="body1" style={{ color: data.disposable ? '#D74C4C' : '#020202' }}>
                              {data.disposable ? `⚠️ Warning! ${emailAddress} is disposable!` : 'This is not a one-off e-mail'}
                            </Typography>
                          </div>
                          <Typography className="hover-item2" variant="h6"></Typography>
                        </Paper>
                      </Collapse>
                    )}
                  </Stack>
                </Stack>
              </>
            )}
          </Grid>
        </Paper>
      </Stack>
    </Box>
    );
}

export default App;