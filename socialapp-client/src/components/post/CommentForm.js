import React, { Component } from 'react';

import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';

// MUI
import Grid from '@material-ui/core/Grid';

import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';

// redux
import { connect } from 'react-redux';
import { submitComment } from '../../redux/actions/dataActions';

const styles = theme => ({
  ...theme.signUpLoginStyle,
  ...theme.separators
});

export class CommentForm extends Component {
  state = {
    body: '',
    errors: {}
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.ui.errors) {
      this.setState({ errors: nextProps.ui.errors });
    }
    if (!nextProps.ui.errors && !nextProps.ui.loading) {
      this.setState({
        body: ''
      });
    }
  }
  handleSubmit = event => {
    event.preventDefault();

    this.props.submitComment(this.props.postId, { body: this.state.body });
  };

  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };

  render() {
    const { classes, authenticated } = this.props;
    const { errors } = this.state;
    const commentFormMarkup = authenticated ? (
      <Grid item sm={12} style={{ textAlign: 'center' }}>
        <form onSubmit={this.handleSubmit}>
          <TextField
            variant='outlined'
            name='body'
            type='text'
            label='Comment on post'
            error={errors.comment ? true : false}
            helperText={errors.comment}
            value={this.state.body}
            onChange={this.handleChange}
            fullWidth
            className={classes.TextField}
          />
          <Button
            type='submit'
            variant='outlined'
            color='primary'
            className={classes.button}
          >
            Submit
          </Button>
        </form>
        <hr className={classes.visibleSeparator} />
      </Grid>
    ) : null;
    return commentFormMarkup;
  }
}

CommentForm.propTypes = {
  submitComment: PropTypes.func.isRequired,
  classes: PropTypes.object.isRequired,
  ui: PropTypes.object.isRequired,
  authenticated: PropTypes.bool.isRequired,
  postId: PropTypes.string.isRequired
};

const mapStateToProps = state => ({
  ui: state.ui,
  authenticated: state.user.authenticated
});

const mapActionsToProps = {
  submitComment
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(withStyles(styles)(CommentForm));
