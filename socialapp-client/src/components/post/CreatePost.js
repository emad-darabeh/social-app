import React, { Component, Fragment } from 'react';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// redux
import { connect } from 'react-redux';
import { createPost, clearErrors } from '../../redux/actions/dataActions';

// Util component
import TooltipButton from '../../util/myTooltipButton';

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import CircularProgress from '@material-ui/core/CircularProgress';

// Icons
import AddIcon from '@material-ui/icons/Add';
import CloseIcon from '@material-ui/icons/Close';

const styles = theme => ({
  ...theme.signUpLoginStyle,
  closeButton: {
    position: 'absolute',
    left: '90%',
    top: '5%'
  }
});

class CreatePost extends Component {
  state = {
    newPost: '',
    open: false,
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({
        errors: nextProps.ui.errors
      });
    }
    if (!nextProps.ui.errors && !nextProps.ui.loading) {
      this.setState({ open: false, newPost: '', errors: {} });
    }
  }
  handleCreatePost = () => {
    const newPost = {
      body: this.state.newPost
    };
    this.props.createPost(newPost);
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false, newPost: '', errors: {} });
    this.props.clearErrors();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { newPost, open, errors } = this.state;
    const {
      classes,
      ui: { loading }
    } = this.props;
    return (
      <Fragment>
        <TooltipButton tip='Create a post!' onClick={this.handleOpen}>
          <AddIcon />
        </TooltipButton>

        <Dialog open={open} onClose={this.handleClose} fullWidth maxWidth='sm'>
          <TooltipButton
            tip='close'
            onClick={this.handleClose}
            tipClassName={classes.closeButton}
          >
            <CloseIcon />
          </TooltipButton>
          <DialogTitle>Create a new post</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                variant='outlined'
                name='newPost'
                type='text'
                label='New post'
                multiline
                rows='5'
                placeholder="Write what's in your mind..."
                className={classes.textField}
                value={newPost}
                error={errors.body ? true : false}
                helperText={errors.body}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button
              variant='outlined'
              onClick={this.handleCreatePost}
              color='primary'
              className={classes.button}
              disabled={loading}
            >
              publish
              {loading && (
                <CircularProgress size={25} className={classes.progress} />
              )}
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

CreatePost.propTypes = {
  classes: PropTypes.object.isRequired,
  createPost: PropTypes.func.isRequired,
  clearErrors: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  ui: state.ui
});

const mapActionsToProps = {
  createPost,
  clearErrors
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(CreatePost));
