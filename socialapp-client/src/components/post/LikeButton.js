import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';

// Components
import TooltipButton from '../../util/myTooltipButton';

// Icons
import FavoriteIcon from '@material-ui/icons/Favorite';
import FavoriteBorderIcon from '@material-ui/icons/FavoriteBorder';

// Redux
import { connect } from 'react-redux';
import { likePost, unlikePost } from '../../redux/actions/dataActions';

export class LikeButton extends Component {
  likedPost = () => {
    if (
      this.props.user.likes &&
      this.props.user.likes.find(like => like.postId === this.props.postId)
    ) {
      return true;
    } else return false;
  };

  likePost = () => {
    this.props.likePost(this.props.postId);
  };

  unlikePost = () => {
    this.props.unlikePost(this.props.postId);
  };
  render() {
    const { authenticated } = this.props.user;
    const likeButton = authenticated ? (
      this.likedPost() ? (
        <TooltipButton tip='Unlike' onClick={this.unlikePost}>
          <FavoriteIcon color='secondary' />
        </TooltipButton>
      ) : (
        <TooltipButton tip='Like' onClick={this.likePost}>
          <FavoriteBorderIcon color='primary' />
        </TooltipButton>
      )
    ) : (
      <Link to='/login'>
        <TooltipButton tip='Like'>
          <FavoriteBorderIcon color='primary' />
        </TooltipButton>
      </Link>
    );

    return likeButton;
  }
}

LikeButton.propTypes = {
  user: PropTypes.object.isRequired,
  postId: PropTypes.string.isRequired,
  likePost: PropTypes.func.isRequired,
  unlikePost: PropTypes.func.isRequired
};
const mapStateToProps = state => ({
  user: state.user
});

const mapActionsToProps = {
  likePost,
  unlikePost
};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(LikeButton);
