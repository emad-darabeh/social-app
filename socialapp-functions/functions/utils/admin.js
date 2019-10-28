const admin = require('firebase-admin');
const serviceAccount = require('../firebase-credentials.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://social-app-4f940.firebaseio.com'
});

const db = admin.firestore();
const postsRef = db.collection('posts');
const usersRef = db.collection('users');
const likesRef = db.collection('likes');
const commentsRef = db.collection('comments');
const notificationsRef = db.collection('notifications');

module.exports = {
  admin,
  db,
  postsRef,
  usersRef,
  likesRef,
  commentsRef,
  notificationsRef
};
