const functions = require('firebase-functions');
const bodyParser = require('body-parser');
const express = require('express');
const app = express();
const cors = require('cors');
const {
  getAllPosts,
  createNewPost,
  getPost,
  commentOnPost,
  likePost,
  unlikePost,
  deletePost
} = require('./handlers/posts');
const {
  signup,
  login,
  uploadImage,
  addUserDetails,
  getAuthenticatedUser,
  getUserDetails,
  markNotificationRead
} = require('./handlers/users');
const { signupValidator, loginValidator } = require('./utils/input-validators');
const firebaseAuth = require('./utils/firebase-auth');
const {
  db,
  postsRef,
  likesRef,
  commentsRef,
  notificationsRef
} = require('./utils/admin');

// middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

// Posts Routes
app.get('/posts', getAllPosts);
app.post('/post', firebaseAuth, createNewPost);
app.get('/post/:postId', getPost);
app.delete('/post/:postId', firebaseAuth, deletePost);
app.get('/post/:postId/like', firebaseAuth, likePost);
app.get('/post/:postId/unlike', firebaseAuth, unlikePost);
app.post('/post/:postId/comment', firebaseAuth, commentOnPost);

// Users Routes
app.post('/signup', signupValidator, signup);
app.post('/login', loginValidator, login);
app.post('/user/image', firebaseAuth, uploadImage);
app.post('/user', firebaseAuth, addUserDetails);
app.get('/user', firebaseAuth, getAuthenticatedUser);
app.get('/user/:handle', getUserDetails);
app.post('/notifications', firebaseAuth, markNotificationRead);

exports.api = functions.region('europe-west1').https.onRequest(app);

exports.createNotificationOnLike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onCreate(likeSnapshot => {
    return db
      .doc(`/posts/${likeSnapshot.data().postId}`)
      .get()
      .then(postSnapshot => {
        if (
          postSnapshot.exists &&
          postSnapshot.data().userHandle !== likeSnapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${likeSnapshot.id}`).set({
            recipient: postSnapshot.data().userHandle,
            sender: likeSnapshot.data().userHandle,
            postId: postSnapshot.id,
            type: 'like',
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      })
      .catch(err => console.error(err));
  });

exports.createNotificationOnComment = functions
  .region('europe-west1')
  .firestore.document('comments/{id}')
  .onCreate(commentSnapshot => {
    return db
      .doc(`/posts/${commentSnapshot.data().postId}`)
      .get()
      .then(postSnapshot => {
        if (
          postSnapshot.exists &&
          commentSnapshot.data().userHandle !== postSnapshot.data().userHandle
        ) {
          return db.doc(`/notifications/${commentSnapshot.id}`).set({
            recipient: postSnapshot.data().userHandle,
            sender: commentSnapshot.data().userHandle,
            postId: postSnapshot.id,
            type: 'comment',
            read: false,
            createdAt: new Date().toISOString()
          });
        }
      })

      .catch(err => console.error(err));
  });

exports.deleteNotificationOnUnlike = functions
  .region('europe-west1')
  .firestore.document('likes/{id}')
  .onDelete(likeSnapshot => {
    return db
      .doc(`/notifications/${likeSnapshot.id}`)
      .delete()
      .catch(err => console.error(err));
  });

exports.onUserImageChang = functions
  .region('europe-west1')
  .firestore.document('users/{userId}')
  .onUpdate(change => {
    if (change.before.data().imageUrl !== change.after.data().imageUrl) {
      console.log('image has changed');
      let batch = db.batch();
      return postsRef
        .where('userHandle', '==', change.before.data().handle)
        .get()
        .then(postsSnapshot => {
          postsSnapshot.forEach(doc => {
            batch.update(db.doc(`/posts/${doc.id}`), {
              userImage: change.after.data().imageUrl
            });
          });
          return commentsRef
            .where('userHandle', '==', change.before.data().handle)
            .get();
        })
        .then(commentsSnapshot => {
          commentsSnapshot.forEach(doc => {
            batch.update(db.doc(`/comments/${doc.id}`), {
              userImage: change.after.data().imageUrl
            });
          });
          return batch.commit();
        });
    } else return true;
  });

exports.onPostDelete = functions
  .region('europe-west1')
  .firestore.document('posts/{postId}')
  .onDelete((postSnapshot, context) => {
    const postId = context.params.postId;
    const batch = db.batch();

    return likesRef
      .where('postId', '==', postId)
      .get()
      .then(likesSnapshot => {
        likesSnapshot.forEach(doc => {
          batch.delete(db.doc(`/likes/${doc.id}`));
        });
        return commentsRef.where('postId', '==', postId).get();
      })
      .then(commentsSnapshot => {
        commentsSnapshot.forEach(doc => {
          batch.delete(db.doc(`/comments/${doc.id}`));
        });
        return notificationsRef.where('postId', '==', postId).get();
      })
      .then(notificationsSnapshot => {
        notificationsSnapshot.forEach(doc => {
          batch.delete(db.doc(`/notifications/${doc.id}`));
        });
        return batch.commit();
      })
      .catch(err => console.error(err.coe));
  });
