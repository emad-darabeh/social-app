import React, { Component } from 'react';

import PropTypes from 'prop-types';

// components
import Post from '../components/post/Post';
import StaticProfile from '../components/profile/StaticProfile';
import PostSkeleton from '../util/PostSkeleton';

// MUI
import Grid from '@material-ui/core/Grid';

// redux
import { connect } from 'react-redux';
import { getUserData } from '../redux/actions/dataActions';

class user extends Component {
  state = {
    postIdParam: null
  };

  componentDidMount() {
    const handle = this.props.match.params.handle;
    const postId = this.props.match.params.postId;
    if (postId) this.setState({ postIdParam: postId });
    this.props.getUserData(handle);
  }
  render() {
    const { posts, loading } = this.props.data;

    const { postIdParam } = this.state;

    let postsMarkup = !loading ? (
      posts === null ? (
        <p>No posts yet</p>
      ) : postIdParam ? (
        posts.map(post => {
          if (post.postId !== postIdParam)
            return <Post key={post.postId} post={post} />;
          else return <Post key={post.postId} post={post} openDialog />;
        })
      ) : (
        posts.map(post => <Post key={post.postId} post={post} />)
      )
    ) : (
      <PostSkeleton />
    );
    return (
      <Grid container spacing={4} style={{ margin: '10% auto 10% auto' }}>
        <Grid item sm={8} xs={12}>
          {postsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <StaticProfile />
        </Grid>
      </Grid>
    );
  }
}

user.propTypes = {
  data: PropTypes.object.isRequired,
  getUserData: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

const mapActionsToProps = {
  getUserData
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(user);
