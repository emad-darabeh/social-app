import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import PropTypes from 'prop-types';
import AppIcon from '../images/icon.jpg';

// MUI
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CircularProgress from '@material-ui/core/CircularProgress';
import IconButton from '@material-ui/core/IconButton';
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';

// Redux
import { connect } from 'react-redux';
import { signupUser } from '../redux/actions/userActions';

const styles = theme => ({
  ...theme.signUpLoginStyle
});

class signup extends Component {
  constructor() {
    super();
    this.state = {
      handle: '',
      email: '',
      password: '',
      confirmPassword: '',
      showPassword: false,
      showConfirmPassword: false,
      errors: {}
    };
  }

  componentWillReceiveProps(nextProp) {
    if (nextProp.ui.errors) {
      this.setState({ errors: nextProp.ui.errors });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const newUserData = {
      handle: this.state.handle,
      email: this.state.email,
      password: this.state.password,
      confirmPassword: this.state.confirmPassword
    };
    this.props.signupUser(newUserData, this.props.history);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClickShowPassword = event => {
    this.setState({
      [event.currentTarget.name]: !this.state[event.currentTarget.name]
    });
  };

  render() {
    const {
      classes,
      ui: { loading }
    } = this.props;
    const { errors, showPassword, showConfirmPassword } = this.state;

    return (
      <Grid
        container
        className={classes.form}
        justify='center'
        // alignContent='flex-start'
      >
        <Grid item md />
        <Grid item xs={10} sm={5} md>
          <img src={AppIcon} alt='Logo' className={classes.logo} />
          <Typography variant='h2' className={classes.pageTitle}>
            Sign up
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            {errors.general && (
              <Typography variant='body2' className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <TextField
              margin='dense'
              id='handle'
              name='handle'
              type='text'
              label='User name'
              variant='outlined'
              className={classes.textField}
              helperText={errors.handle}
              error={errors.handle ? true : false}
              value={this.state.handle}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              margin='dense'
              id='email'
              name='email'
              type='email'
              label='Email'
              variant='outlined'
              className={classes.textField}
              helperText={errors.email}
              error={errors.email ? true : false}
              value={this.state.email}
              onChange={this.handleChange}
              fullWidth
            />
            <TextField
              margin='dense'
              id='password'
              name='password'
              type={showPassword ? 'text' : 'password'}
              label='Password'
              variant='outlined'
              className={classes.textField}
              helperText={errors.password}
              error={errors.password ? true : false}
              value={this.state.password}
              onChange={this.handleChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      name='showPassword'
                      aria-label='Toggle password visibility'
                      onClick={this.handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextField
              margin='dense'
              id='confirmPassword'
              name='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              label='Confirm password'
              variant='outlined'
              className={classes.textField}
              helperText={errors.confirmPassword}
              error={errors.confirmPassword ? true : false}
              value={this.state.confirmPassword}
              onChange={this.handleChange}
              fullWidth
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      name='showConfirmPassword'
                      aria-label='Toggle password visibility'
                      onClick={this.handleClickShowPassword}
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div className={classes.guidingText}>
              <small>
                Already have an account?{' '}
                <Button href='/login' color='secondary'>
                  Login
                </Button>
              </small>
            </div>

            <Button
              type='submit'
              variant='outlined'
              color='primary'
              className={classes.button}
              disabled={loading}
            >
              Sign up
              {loading && (
                <CircularProgress size={25} className={classes.progress} />
              )}
            </Button>
          </form>
        </Grid>
        <Grid item md />
      </Grid>
    );
  }
}

signup.propTypes = {
  classes: PropTypes.object.isRequired,
  signupUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ user: state.user, ui: state.ui });

const mapActionsToProps = {
  signupUser
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(signup));
