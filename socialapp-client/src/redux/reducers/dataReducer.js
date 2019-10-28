import {
  SET_POSTS,
  LIKE_POST,
  UNLIKE_POST,
  LOADING_DATA,
  DELETE_POST,
  CREATE_POST,
  SET_POST,
  SUBMIT_COMMENT,
  SET_PROFILE,
  SET_PROFILE_ERROR
} from '../types';

const initialState = {
  posts: [],
  post: {},
  loading: false,
  profile: {}
};

export default function(state = initialState, action) {
  switch (action.type) {
    case LOADING_DATA:
      return {
        ...state,
        loading: true
      };
    case SET_POSTS:
      return {
        ...state,
        posts: action.payload,
        loading: false
      };
    case LIKE_POST:
    case UNLIKE_POST:
      let index = state.posts.findIndex(
        post => post.postId === action.payload.postId
      );
      state.posts[index] = action.payload;
      if (state.post.postId === action.payload.postId) {
        state.post = { ...action.payload, comments: state.post.comments };
      }
      return {
        ...state
      };
    case DELETE_POST:
      return {
        ...state,
        posts: state.posts.filter(post => post.postId !== action.payload)
      };
    case CREATE_POST:
      return {
        ...state,
        posts: [action.payload, ...state.posts]
      };
    case SET_POST:
      return {
        ...state,
        post: action.payload
      };
    case SUBMIT_COMMENT:
      let commentIndex = state.posts.findIndex(
        post => post.postId === action.payload.postId
      );
      state.posts[commentIndex] = {
        ...state.posts[commentIndex],
        commentCount: state.posts[commentIndex].commentCount + 1
      };
      return {
        ...state,
        post: {
          ...state.post,
          commentCount: ++state.post.commentCount,
          comments: [action.payload, ...state.post.comments]
        }
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.payload.userDetails,
        posts: action.payload.userPosts,
        loading: false
      };
    case SET_PROFILE_ERROR:
      return {
        ...initialState,
        profile: action.payload
      };
    default:
      return state;
  }
}
