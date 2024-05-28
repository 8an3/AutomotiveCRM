import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import PaymentCalculatorEmail from './PaymentCalculatorEmail';


const EmailPreview = (props) => {
  // Render the email component to a static HTML string
  const emailHtml = renderToStaticMarkup(<PaymentCalculatorEmail {...props} />);

  // Wrap the HTML string in a <html> tag if it's not already
  const fullHtml = `<!DOCTYPE html>
  <html>
    ${emailHtml}
  </html>`;

  return (
    <div>

      <iframe
        srcDoc={fullHtml}
        style={{ width: '100%', height: '500px', border: '1px solid #27272a' }}
        title="Email Preview"
      />
    </div>
  );
};

export default EmailPreview;
