import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

// redux
import { connect } from 'react-redux';
import { uploadImage, logoutUser } from '../../redux/actions/userActions';

// components
import EditDetails from './EditDetails';
import TooltipButton from '../../util/myTooltipButton';
import ProfileSkeleton from '../../util/ProfileSkeleton';

// MUI
import Paper from '@material-ui/core/Paper';
import MUILink from '@material-ui/core/Link';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// icons
import LocationOn from '@material-ui/icons/LocationOn';
import LinkIcon from '@material-ui/icons/Link';
import CalendarToday from '@material-ui/icons/CalendarToday';
import EditIcon from '@material-ui/icons/Edit';
import KeyboardReturn from '@material-ui/icons/KeyboardReturn';

const styles = theme => ({
  ...theme.profileStyle
});

class Profile extends Component {
  handleImageChange = event => {
    const image = event.target.files[0];
    const formData = new FormData();
    formData.append('image', image, image.name);
    this.props.uploadImage(formData);
  };

  handleEditPicture = () => {
    const fileInput = document.getElementById('imageInput');
    fileInput.click();
  };

  handleLogout = () => {
    this.props.logoutUser();
  };

  render() {
    const {
      classes,
      user: {
        authenticated,
        loading,
        credentials: { handle, createdAt, imageUrl, bio, website, location }
      }
    } = this.props;

    let profileMarkup = !loading ? (
      authenticated ? (
        <Paper className={classes.paper}>
          <div className={classes.profile}>
            <div className='image-wrapper'>
              <img src={imageUrl} alt='profile' className='profile-image' />
              <input
                type='file'
                id='imageInput'
                hidden='hidden'
                onChange={this.handleImageChange}
              />
              <TooltipButton
                tip='Change profile picture'
                onClick={this.handleEditPicture}
                btnClassName='button'
              >
                <EditIcon color='primary' />
              </TooltipButton>
            </div>
            <hr />
            <div className='profile-details'>
              <MUILink
                component={Link}
                to={`/user/${handle}`}
                color='primary'
                variant='h5'
              >
                @{handle}
              </MUILink>
              <hr />
              {bio && <Typography variant='body2'>{bio}</Typography>}
              <hr />
              {location && (
                <Fragment>
                  <LocationOn color='primary' /> <span>{location}</span>
                  <hr />
                </Fragment>
              )}
              {website && (
                <Fragment>
                  <LinkIcon color='primary' />
                  <a href={website} target='_blank' rel='noopener noreferrer'>
                    {' '}
                    {website}
                  </a>
                  <hr />
                </Fragment>
              )}
              <CalendarToday color='primary' />{' '}
              <span>Joined {dayjs(createdAt).format('MMM YYYY')}</span>
            </div>
          </div>

          <TooltipButton tip='Logout' onClick={this.handleLogout}>
            <KeyboardReturn color='primary' />
          </TooltipButton>

          <EditDetails />
        </Paper>
      ) : (
        <Paper className={classes.paper}>
          <Typography variant='body2' align='center'>
            No profile found, please login again
          </Typography>
          <div className={classes.buttons}>
            <Button
              variant='outlined'
              color='primary'
              component={Link}
              to='/login'
            >
              Login
            </Button>
            <Button
              variant='outlined'
              color='secondary'
              component={Link}
              to='/signup'
            >
              Sign up
            </Button>
          </div>
        </Paper>
      )
    ) : (
      <ProfileSkeleton />
    );

    return profileMarkup;
  }
}

Profile.propTypes = {
  classes: PropTypes.object.isRequired,
  user: PropTypes.object.isRequired,
  uploadImage: PropTypes.func.isRequired,
  logoutUser: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  user: state.user
});

const mapFunctionsToProps = {
  uploadImage,
  logoutUser
};

export default connect(
  mapStateToProps,
  mapFunctionsToProps
)(withStyles(styles)(Profile));
