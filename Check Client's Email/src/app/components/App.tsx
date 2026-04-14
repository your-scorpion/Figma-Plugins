import React, { useEffect, useRef, useState } from 'react';
import { keyframes } from '@emotion/react';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
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
import ClearRoundedIcon from '@mui/icons-material/ClearRounded';
import type { ReactNode } from 'react';

type EmailCheckData = {
  format: boolean;
  dns: boolean;
  disposable: boolean;
  domain: string;
};

type PluginMessage =
  | {
      type: 'check-email-result';
      emailAddress: string;
      data: EmailCheckData | null;
    }
  | {
      type: 'check-email-error';
      emailAddress: string;
      message: string;
    };

const inputAnimation = keyframes `
  0% { transform: scale(1); }
  50% { transform: scale(1.01); }
  75% { transform: scale(0.98); }
  100% { transform: scale(1); }
`;

const revealAnimation = keyframes `
  0% {
    opacity: 0;
    transform: translateY(18px) scale(0.985);
    filter: blur(10px);
  }
  100% {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`;

const caretBlink = keyframes `
  0%, 45% { opacity: 1; }
  55%, 100% { opacity: 0; }
`;

const animatedInputStyles = {
    '&:hover': {
        animation: `${inputAnimation} 0.5s linear`,
    },
};

function useTypewriter(text: string, speed: number, enabled = true) {
  const [renderedText, setRenderedText] = useState(enabled ? '' : text);

  useEffect(() => {
    if (!enabled) {
      setRenderedText(text);
      return;
    }

    if (!text) {
      setRenderedText('');
      return;
    }

    setRenderedText('');
    let index = 0;
    const intervalId = window.setInterval(() => {
      index += 1;
      setRenderedText(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(intervalId);
      }
    }, speed);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [enabled, speed, text]);

  return renderedText;
}

type AnimatedRevealProps = {
  children: ReactNode;
  delay?: number;
};

const AnimatedReveal = ({ children, delay = 0 }: AnimatedRevealProps) => (
  <Box
    sx={{
      opacity: 0,
      animation: `${revealAnimation} 780ms cubic-bezier(0.22, 1, 0.36, 1) forwards`,
      animationDelay: `${delay}ms`,
      willChange: 'transform, opacity, filter',
    }}
  >
    {children}
  </Box>
);

type TypewriterTextProps = {
  text: string;
  speed?: number;
  color?: string;
};

const TypewriterText = ({ text, speed = 18, color = 'inherit' }: TypewriterTextProps) => {
  const renderedText = useTypewriter(text, speed, true);
  const isComplete = renderedText.length >= text.length;

  return (
    <Box
      component="span"
      sx={{
        color,
        display: 'inline-flex',
        alignItems: 'center',
        minHeight: '1.2em',
      }}
    >
      <Box component="span">{renderedText}</Box>
      <Box
        component="span"
        sx={{
          ml: 0.35,
          width: '1px',
          height: '1em',
          backgroundColor: color,
          animation: isComplete ? 'none' : `${caretBlink} 1s step-end infinite`,
          opacity: isComplete ? 0 : 1,
        }}
      />
    </Box>
  );
};

const App = () => {
  const [emailAddress, setEmailAddress] = useState('');
  const [data, setData] = useState<EmailCheckData | null>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const latestRequestedEmail = useRef('');

    useEffect(() => {
    const handleMessage = (event: MessageEvent<{ pluginMessage?: PluginMessage }>) => {
      const pluginMessage = event.data.pluginMessage;

      if (!pluginMessage) {
        return;
      }

      if (pluginMessage.emailAddress !== latestRequestedEmail.current) {
        return;
      }

      if (pluginMessage.type === 'check-email-result') {
        setData(pluginMessage.data);
        setErrorMessage('');
        setLoading(false);
        return;
      }

      setData(null);
      setErrorMessage(pluginMessage.message);
      setLoading(false);
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, []);

  useEffect(() => {
    const normalizedEmail = emailAddress.trim();

    if (!normalizedEmail) {
      latestRequestedEmail.current = '';
      setData(null);
      setErrorMessage('');
      setLoading(false);
      return;
    }

    const timeoutId = window.setTimeout(() => {
      latestRequestedEmail.current = normalizedEmail;
      setLoading(true);
      setErrorMessage('');

      parent.postMessage(
        {
          pluginMessage: {
            type: 'check-email',
            emailAddress: normalizedEmail,
          },
        },
        '*',
      );
    }, 350);

    return () => {
      window.clearTimeout(timeoutId);
    };
    }, [emailAddress]);

  const normalizedEmail = emailAddress.trim();
  const emptyStateText = 'Enter an email address to continue.';
  const formatMessage = data ? (data.format ? 'This address looks valid.' : 'This address does not look valid.') : '';
  const dnsMessage = data ? (data.dns ? 'All well' : 'Invalid MX or disposable email for domain') : '';
  const conclusionMessage = data
    ? data.disposable
      ? `Warning! ${normalizedEmail} is disposable.`
      : 'This is not a one-off e-mail.'
    : '';

  const handleClearEmail = () => {
    latestRequestedEmail.current = '';
    setEmailAddress('');
    setData(null);
    setErrorMessage('');
    setLoading(false);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '95vh',
        boxSizing: 'border-box',
        pt: 2.8,
        px: 1.5,
        pb: 1.5,
        overflow: 'hidden',
        background: 'linear-gradient(180deg, #fbfbfd 0%, #f2f4f7 100%)',
      }}
    >
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
      <Stack spacing={2} sx={{ height: '100%' }}>

        <AnimatedReveal delay={120}>
          {!normalizedEmail && !errorMessage && (
            <Box
              sx={{
                padding: '10px 12px',
                borderRadius: '18px',
                border: '1px solid rgba(148, 163, 184, 0.22)',
                background: 'linear-gradient(135deg, rgba(238, 246, 255, 0.98) 0%, rgba(243, 240, 255, 0.96) 48%, rgba(233, 247, 242, 0.98) 100%)',
                boxShadow: '0 14px 30px rgba(148, 163, 184, 0.14)',
              }}
            >
              <Collapse in={Boolean(!loading)}>
                <Typography variant="body1" sx={{ color: '#334155', fontWeight: 500 }}>
                  <TypewriterText text={emptyStateText} speed={18} color="#334155" />
                </Typography>
              </Collapse>
            </Box>
          )}
          {errorMessage && (
            <Box sx={{ backgroundColor: '#fff3f1', padding: '10px 12px', borderRadius: '18px', border: '1px solid rgba(215, 76, 76, 0.12)' }}>
              <Collapse in={Boolean(errorMessage)}>
                <Typography variant="body1" sx={{ color: '#D74C4C' }}>
                  <TypewriterText text={errorMessage} speed={18} color="#D74C4C" />
                </Typography>
              </Collapse>
            </Box>
          )}
        </AnimatedReveal>

        <AnimatedReveal delay={190}>
          <TextField
            className="setEmailAddress"
            id="outlined-basic"
            sx={{
              boxShadow: '0 19px 38px rgba(248,249,251,0.70), 0 15px 12px rgba(241,243,245,0.70);',
              minWidth: 300,
              backgroundColor: '#FFFFFF',
              borderRadius: '20px',
              ...animatedInputStyles,
              '& .MuiOutlinedInput-root': {
                borderRadius: '20px',
              },
              '&:focus': {
                outline: 'none',
              },
            }}
            onChange={(e) => setEmailAddress(e.target.value)}
            value={emailAddress}
            placeholder="user@example.com"
            label="Enter E-mail address:"
            variant="outlined"
            InputProps={{
              endAdornment: emailAddress ? (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Clear email address"
                    edge="end"
                    onClick={handleClearEmail}
                    size="small"
                    sx={{
                      color: '#98a1ae',
                      transition: 'transform 180ms ease, color 180ms ease',
                      '&:hover': {
                        color: '#111827',
                        transform: 'scale(1.04)',
                      },
                    }}
                  >
                    <ClearRoundedIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ) : undefined,
            }}
          />
        </AnimatedReveal>

        <AnimatedReveal delay={260}>
          <Paper sx={{
  backgroundColor: '#FFFFFF',
  borderRadius: '4px',
  boxShadow: '0 8px 24px rgba(0, 0, 0, 0.06)',
  border: '1px solid rgba(0, 0, 0, 0.04)',
  overflow: 'hidden',
}}>
            <Grid container rowSpacing={0} columnSpacing={{ xs: -8, sm: 22, md: 12 }}>
              {data && normalizedEmail && (
                <>
                  <Grow in={Boolean(normalizedEmail)} timeout={480}>
                    <Paper sx={{ mt: -1, backgroundColor: '#E2E3E8', borderRadius: '8px', padding: '8px' }}>
                      <FormHelperText id="component-helper-text">
                        The address looks like an email:{' '}
                        <TypewriterText text={formatMessage} speed={18} color={data.format ? '#020202' : '#D74C4C'} />
                      </FormHelperText>
                    </Paper>
                  </Grow>
                  <Stack spacing={{ xs: 1, sm: 2, mt: 3 }} direction="column" useFlexGap flexWrap="wrap" sx={{ padding: '8px' }}>
                    <Collapse in={Boolean(normalizedEmail)} timeout={540}>
                      <Grid sx={{ mt: 2 }}>
                        <Tooltip TransitionComponent={Zoom} followCursor={true} title={<h3 style={{ color: 'white', lineHeight: '18px' }}>
                          DNS is used in email to find the correct mail server for a particular domain. Without DNS, emails may be unreliable and insecure, with a higher risk of spam and phishing attacks.
                        </h3>}>
                          <Paper className="hover-item" sx={{ wordWrap: 'break-word', padding: '12px', backgroundColor: data.disposable ? '#FDF4F4' : '#ffffff' }}>
                            <Typography variant="body1" style={{ color: '#A9AEAF' }}>
                              DNS:
                            </Typography>
                            <Typography variant="body1" style={{ color: data.dns ? '#4FBCB6' : '#D74C4C' }}>
                              <TypewriterText text={dnsMessage} speed={16} color={data.dns ? '#4FBCB6' : '#D74C4C'} />
                            </Typography>
                          </Paper>
                        </Tooltip>
                      </Grid>
                    </Collapse>
                    <Collapse in={Boolean(normalizedEmail)} timeout={580}>
                      <Grid>
                        <Paper sx={{ padding: '12px', backgroundColor: '#ffffff' }}>
                          <Typography variant="body1" style={{ color: '#A9AEAF', whiteSpace: 'nowrap' }}>
                            Domain:
                          </Typography>
                          <Typography variant="body1" style={{ color: data.domain ? '#020202' : '#D74C4C', whiteSpace: 'break-spaces', wordWrap: 'break-word' }}>
                            {data.domain || 'Unknown'}
                          </Typography>
                        </Paper>
                      </Grid>
                    </Collapse>
                    <Collapse in={Boolean(normalizedEmail)} timeout={620}>
                      <Stack spacing={{ xs: 1, sm: 2, mt: 3 }} direction="row" useFlexGap flexWrap="wrap">
                        <Paper sx={{ padding: '12px', backgroundColor: data.disposable ? '#FDF4F4' : '#ffffff' }}>
                          <div>
                            <Typography variant="body1" style={{ color: '#A9AEAF', whiteSpace: 'nowrap' }}>
                              Conclusion:
                            </Typography>
                            <Typography variant="body1" style={{ color: data.disposable ? '#D74C4C' : '#020202' }}>
                              <TypewriterText text={conclusionMessage} speed={14} color={data.disposable ? '#D74C4C' : '#020202'} />
                            </Typography>
                          </div>
                          <Typography className="hover-item2" variant="h6"></Typography>
                        </Paper>
                      </Stack>
                    </Collapse>
                  </Stack>
                </>
              )}
            </Grid>
          </Paper>
        </AnimatedReveal>
      </Stack>
    </Box>
  );
};

export default App;