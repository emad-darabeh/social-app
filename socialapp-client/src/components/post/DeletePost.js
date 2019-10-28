import React, { Component, Fragment } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';

import PropTypes from 'prop-types';

import TooltipButton from '../../util/myTooltipButton';

// MUI
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogActions from '@material-ui/core/DialogActions';

// Icons
import DeleteOutlineIcon from '@material-ui/icons/DeleteOutline';

// redux
import { connect } from 'react-redux';
import { deletePost } from '../../redux/actions/dataActions';

const styles = {
  deleteButton: { position: 'absolute', left: '90%', top: '10%' },
  dialogButton: {
    margin: '10px auto 10px auto',
    position: 'relative',
    width: '30%',
    display: 'flex'
  },
  dialogTitle: {
    textAlign: 'center',
    margin: '10px auto 10px auto'
  }
};

class DeletePost extends Component {
  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };
  handleClose = () => {
    this.setState({ open: false });
  };

  handleDelete = () => {
    this.props.deletePost(this.props.postId);
    this.setState({ open: false });
  };
  render() {
    const { classes } = this.props;
    return (
      <Fragment>
        <TooltipButton
          tip='Delete post'
          onClick={this.handleOpen}
          btnClassName={classes.deleteButton}
        >
          <DeleteOutlineIcon color='secondary' />
        </TooltipButton>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          fullWidth
          maxWidth='sm'
        >
          <DialogTitle className={classes.dialogTitle}>
            Are you sure you want to delete this post?
          </DialogTitle>
          <DialogActions>
            <Button
              onClick={this.handleClose}
              color='primary'
              variant='outlined'
              className={classes.dialogButton}
            >
              Cancel
            </Button>
            <Button
              onClick={this.handleDelete}
              color='secondary'
              variant='outlined'
              className={classes.dialogButton}
            >
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

DeletePost.propTypes = {
  postId: PropTypes.string.isRequired,
  deletePost: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired
};

const mapActionsToProps = {
  deletePost
};

export default connect(
  null,
  mapActionsToProps
)(withStyles(styles)(DeletePost));
