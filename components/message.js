import React from "react";

import Alert from "@material-ui/lab/Alert";

function Message({ variant, severity, children }) {
  return (
    <Alert variant={variant} severity={severity}>
      {children}
    </Alert>
  );
}

export default Message;
