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

// redux
import { connect } from 'react-redux';
import { loginUser } from '../redux/actions/userActions';

const styles = theme => ({
  ...theme.signUpLoginStyle
});

class login extends Component {
  constructor() {
    super();
    this.state = {
      email: '',
      password: '',
      showPassword: false,
      errors: {}
    };
  }

  componentWillReceiveProps(nextProp) {
    console.log(nextProp);
    if (nextProp.ui.errors) {
      this.setState({ errors: nextProp.ui.errors });
    }
  }

  handleSubmit = event => {
    event.preventDefault();
    this.setState({
      loading: true
    });
    const userData = {
      email: this.state.email,
      password: this.state.password
    };
    this.props.loginUser(userData, this.props.history);
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  handleClickShowPassword = event => {
    this.setState({ showPassword: !this.state.showPassword });
  };

  render() {
    const {
      classes,
      ui: { loading }
    } = this.props;
    const { errors, showPassword } = this.state;

    return (
      <Grid container className={classes.form} justify='center'>
        <Grid item md />
        <Grid item xs={10} sm={5} md>
          <img src={AppIcon} alt='Logo' className={classes.logo} />
          <Typography variant='h2' className={classes.pageTitle}>
            Login
          </Typography>
          <form noValidate onSubmit={this.handleSubmit}>
            {errors.general && (
              <Typography variant='body2' className={classes.customError}>
                {errors.general}
              </Typography>
            )}
            <TextField
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
              margin='dense'
            />
            <TextField
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
              margin='dense'
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      aria-label='Toggle password visibility'
                      onClick={this.handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <div className={classes.guidingText}>
              <small>
                Don't have an account?{' '}
                <Button href='/signup' color='secondary'>
                  Sign up
                </Button>
              </small>
            </div>
            <br />
            <Button
              type='submit'
              variant='outlined'
              color='primary'
              className={classes.button}
              disabled={loading}
            >
              Login
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

login.propTypes = {
  classes: PropTypes.object.isRequired,
  loginUser: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  user: state.user,
  ui: state.ui
});

const mapActionsToProps = {
  loginUser
};
export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(login));
