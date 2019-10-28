import React, { Component } from 'react';
import PropTypes from 'prop-types';

// MUI
import Grid from '@material-ui/core/Grid';

// Components
import Post from '../components/post/Post';
import Profile from '../components/profile/Profile';
import PostSkeleton from '../util/PostSkeleton';

// redux
import { connect } from 'react-redux';
import { getPosts } from '../redux/actions/dataActions';

class home extends Component {
  componentDidMount() {
    this.props.getPosts();
  }

  render() {
    const {
      data: { posts, loading }
    } = this.props;
    let recentPostsMarkup = !loading ? (
      posts.map(post => <Post key={post.postId} post={post} />)
    ) : (
      <PostSkeleton />
    );
    return (
      <Grid container spacing={4} style={{ margin: '10% auto 10% auto' }}>
        <Grid item sm={8} xs={12}>
          {recentPostsMarkup}
        </Grid>
        <Grid item sm={4} xs={12}>
          <Profile />
        </Grid>
      </Grid>
    );
  }
}

home.propTypes = {
  data: PropTypes.object.isRequired,
  getPosts: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  data: state.data
});

const mapActionsToProps = {
  getPosts
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(home);
