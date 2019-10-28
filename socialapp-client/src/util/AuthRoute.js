import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const AuthRoute = ({ component: Component, authenticated, ...rest }) => {
  console.log(rest['path']);
  return (
    <Route
      {...rest}
      render={props =>
        authenticated ? <Redirect to='/' /> : <Component {...props} />
      }
    />
  );
};

const mapStateToProps = state => ({
  authenticated: state.user.authenticated
});

AuthRoute.protoTypes = {
  user: PropTypes.object
};
export default connect(mapStateToProps)(AuthRoute);
