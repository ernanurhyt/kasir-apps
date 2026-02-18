import React from 'react';
import { AuthContext } from '../authentication/AuthContext';

const withAuth = (WrappedComponent) => {
  return class WithAuth extends React.Component {
    render() {
      return (
        <AuthContext.Consumer>
          {(auth) => <WrappedComponent {...this.props} auth={auth} />}
        </AuthContext.Consumer>
      );
    }
  };
};

export default withAuth;