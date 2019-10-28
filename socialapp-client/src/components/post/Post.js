import React, { Component } from 'react';
import withStyles from '@material-ui/core/styles/withStyles';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Util components
import TooltipButton from '../../util/myTooltipButton';

import DeletePost from './DeletePost';
import LikeButton from './LikeButton';

// MUI
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';

// Icons
import ChatIcon from '@material-ui/icons/Chat';

import PostDialog from './PostDialog';

// Redux
import { connect } from 'react-redux';

const styles = {
  card: {
    position: 'relative',
    display: 'flex',
    marginBottom: 20
  },
  image: {
    minWidth: 200
  },
  content: {
    padding: 25,
    objectFit: 'cover'
  }
};

class Post extends Component {
  render() {
    dayjs.extend(relativeTime);
    const {
      classes,
      post: {
        postId,
        body,
        createdAt,
        userHandle,
        userImage,
        likeCount,
        commentCount
      },
      user: {
        authenticated,
        credentials: { handle }
      }
    } = this.props;

    const deleteButton =
      authenticated && userHandle === handle ? (
        <DeletePost postId={postId} />
      ) : null;

    return (
      <Card className={classes.card}>
        <CardMedia
          image={userImage}
          title='Profile Image'
          className={classes.image}
        />
        <CardContent className={classes.content}>
          <Typography
            variant='h5'
            component={Link}
            to={`/user/${userHandle}`}
            color='primary'
          >
            {userHandle}
          </Typography>

          {deleteButton}

          <Typography variant='body2' color='textSecondary'>
            {dayjs(createdAt).fromNow()}
          </Typography>
          <Typography variant='body1'>{body}</Typography>
          <PostDialog
            postId={postId}
            userHandle={userHandle}
            openDialog={this.props.openDialog}
          />
          <LikeButton postId={postId} />
          <span>{likeCount} Links </span>

          <TooltipButton tip='comments'>
            <ChatIcon color='primary' />
          </TooltipButton>
          <span>{commentCount} Comments </span>
        </CardContent>
      </Card>
    );
  }
}

Post.propTypes = {
  user: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
  post: PropTypes.object.isRequired,
  openDialog: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withStyles(styles)(Post));
