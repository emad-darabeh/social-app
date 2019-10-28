import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// redux
import { connect } from 'react-redux';
import { editUserDetails } from '../../redux/actions/userActions';

// Util component
import TooltipButton from '../../util/myTooltipButton';

// MUI
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

// Icons
import EditIcon from '@material-ui/icons/Edit';

const styles = theme => ({
  ...theme.signUpLoginStyle,
  ...theme.profileStyle,
  button: {
    float: 'right'
  }
});

class EditDetails extends Component {
  state = {
    bio: '',
    website: '',
    location: '',
    open: false
  };

  mapUserDetailsToState = () => {
    const {
      credentials: { bio, website, location }
    } = this.props;
    this.setState({
      bio: bio ? bio : '',
      website: website ? website : '',
      location: location ? location : ''
    });
  };

  componentDidMount() {
    this.mapUserDetailsToState();
  }

  handleOpen = () => {
    this.setState({ open: true });
    this.mapUserDetailsToState();
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    const newUserDetails = {
      bio: this.state.bio,
      website: this.state.website,
      location: this.state.location
    };
    this.props.editUserDetails(newUserDetails);
    this.handleClose();
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes } = this.props;
    const { open, bio, website, location } = this.state;
    return (
      <Fragment>
        <TooltipButton
          tip='Edit details'
          onClick={this.handleOpen}
          btnClassName={classes.button}
        >
          <EditIcon color='primary' />
        </TooltipButton>

        <Dialog open={open} onClose={this.handleClose} fullWidth maxWidth='sm'>
          <DialogTitle>Edit details</DialogTitle>
          <DialogContent>
            <form>
              <TextField
                variant='outlined'
                name='bio'
                type='text'
                label='Bio'
                multiline
                rows='3'
                placeholder='A short bio about yourself'
                className={classes.textField}
                value={bio}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                variant='outlined'
                name='website'
                type='text'
                label='Website'
                placeholder='Your personal/professional website'
                className={classes.textField}
                value={website}
                onChange={this.handleChange}
                fullWidth
              />

              <TextField
                variant='outlined'
                name='location'
                type='text'
                label='Location'
                placeholder='Where you live'
                className={classes.textField}
                value={location}
                onChange={this.handleChange}
                fullWidth
              />
            </form>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color='secondary'>
              cancel
            </Button>
            <Button onClick={this.handleSubmit} color='primary'>
              update
            </Button>
          </DialogActions>
        </Dialog>
      </Fragment>
    );
  }
}

EditDetails.propTypes = {
  classes: PropTypes.object.isRequired,
  editUserDetails: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  credentials: state.user.credentials
});

const mapActionsToProps = {
  editUserDetails
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(EditDetails));
