figma.showUI(__html__, { width: 370, height: 500 });

type CheckEmailMessage = {
  type: 'check-email';
  emailAddress: string;
};

figma.ui.onmessage = async (msg: CheckEmailMessage) => {
  if (msg.type !== 'check-email') {
    return;
  }

  const emailAddress = msg.emailAddress.trim();

  if (!emailAddress) {
    figma.ui.postMessage({
      type: 'check-email-result',
      emailAddress,
      data: null,
    });
    return;
  }

  try {
    const response = await fetch(`https://disify.com/api/email/${encodeURIComponent(emailAddress)}`);

    if (!response.ok) {
      throw new Error(`Email check failed with status ${response.status}`);
    }

    const data = await response.json();

    figma.ui.postMessage({
      type: 'check-email-result',
      emailAddress,
      data,
    });
  } catch (error) {
    console.error('Error checking email:', error);

    figma.ui.postMessage({
      type: 'check-email-error',
      emailAddress,
      message: 'Unable to check this email address right now.',
    });
  }
};