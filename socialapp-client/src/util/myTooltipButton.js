import React from 'react';

// MUI
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';
import Fade from '@material-ui/core/Fade';

export default ({ children, onClick, tip, btnClassName, tipClassName }) => (
  <Tooltip
    className={tipClassName}
    title={tip}
    TransitionComponent={Fade}
    TransitionProps={{ timeout: 600 }}
  >
    <IconButton onClick={onClick} className={btnClassName}>
      {children}
    </IconButton>
  </Tooltip>
);
