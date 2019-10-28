const firebase = require('firebase');
const { validationResult } = require('express-validator');
const firebaseConfig = require('../utils/firebase-config');
const {
  admin,
  db,
  postsRef,
  likesRef,
  notificationsRef
} = require('../utils/admin');
const { reduceUserDetails } = require('../utils/input-validators');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

exports.signup = (req, res) => {
  const errors = validationResult(req);
  const errMsg = {};
  if (!errors.isEmpty()) {
    errors.array().forEach(err => (errMsg[err.param] = err.msg));
    return res.status(422).json(errMsg);
  }

  const newUser = {
    email: req.body.email,
    password: req.body.password,
    confirmPassword: req.body.confirmPassword,
    handle: req.body.handle
  };

  let token, userId;
  const no_img = 'no-img.png';
  db.doc(`/users/${newUser.handle}`)
    .get()
    .then(doc => {
      if (doc.exists) {
        return res
          .status(400)
          .json({ handle: 'This username is already taken' });
      } else {
        return firebase
          .auth()
          .createUserWithEmailAndPassword(newUser.email, newUser.password);
      }
    })
    .then(userCredentials => {
      userId = userCredentials.user.uid;
      return userCredentials.user.getIdToken();
    })
    .then(idToken => {
      token = idToken;
      const myUserCredentials = {
        handle: newUser.handle,
        email: newUser.email,
        createdAt: new Date().toISOString(),
        imageUrl: `https://firebasestorage.googleapis.com/v0/b/${
          firebaseConfig.storageBucket
        }/o/${no_img}?alt=media`,
        userId
      };
      return db.doc(`/users/${newUser.handle}`).set(myUserCredentials);
    })
    .then(() => res.status(201).json({ token }))
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/email-already-in-use') {
        return res.status(400).json({ email: 'Email is already in use' });
      } else {
        return res
          .status(500)
          .json({ general: 'Something went wrong, please try again' });
      }
    });
};

// POST login
exports.login = (req, res) => {
  const errors = validationResult(req);
  const errMsg = {};
  if (!errors.isEmpty()) {
    errors.array().forEach(err => (errMsg[err.param] = err.msg));
    return res.status(422).json(errMsg);
  }

  const user = {
    email: req.body.email,
    password: req.body.password
  };

  firebase
    .auth()
    .signInWithEmailAndPassword(user.email, user.password)
    .then(userCredentials => userCredentials.user.getIdToken())
    .then(token => res.json({ token }))
    .catch(err => {
      console.error(err);
      if (err.code === 'auth/user-not-found') {
        return res.status(403).json({ general: 'The user is not registered' });
      } else if (err.code === 'auth/wrong-password') {
        return res.status(403).json({ general: 'The password is not correct' });
      }
      return res.status(500).json({ error: err.code });
    });
};

// upload profile image
exports.uploadImage = (req, res) => {
  const BusBoy = require('busboy');
  const path = require('path');
  const os = require('os');
  const fs = require('fs');

  const busboy = new BusBoy({ headers: req.headers });

  let imageFileName;
  let imageToBeUploaded = {};

  busboy.on('file', (fieldname, file, filename, encoding, mimetype) => {
    if (mimetype !== 'image/png' && mimetype !== 'image/jpeg') {
      return res.status(400).json({ error: 'Wrong type file submitted' });
    }
    console.log(fieldname);
    console.log(filename);
    console.log(mimetype);

    // file.on('data', function(data) {
    //   console.log('File [' + fieldname + '] got ' + data.length + ' bytes');
    // });

    // file.on('end', function() {
    //   console.log('File [' + fieldname + '] Finished');
    // });

    const imageExtension = filename.split('.')[filename.split('.').length - 1];

    imageFileName = `${Math.round(
      Math.random() * 1000000000000
    ).toString()}.${imageExtension}`;
    console.log(imageFileName);
    const filePath = path.join(os.tmpdir(), imageFileName);
    imageToBeUploaded = { filePath, mimetype };
    file.pipe(fs.createWriteStream(filePath));
  });

  busboy.on('finish', () => {
    console.log('here is finish');
    admin
      .storage()
      .bucket(firebaseConfig.storageBucket)
      .upload(imageToBeUploaded.filePath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: imageToBeUploaded.mimetype
          }
        }
      })
      .then(() => {
        console.log('file name >>>', imageFileName);
        const imageUrl = `https://firebasestorage.googleapis.com/v0/b/${
          firebaseConfig.storageBucket
        }/o/${imageFileName}?alt=media`;
        return db.doc(`/users/${req.user.handle}`).update({ imageUrl });
      })
      .then(() => {
        return res.json({ message: 'Image uploaded successfully' });
      })
      .catch(err => {
        console.error(err);
        return res.status(500).json({ error: err.code });
      });
  });

  busboy.end(req.rawBody);
};

// POST add user details
exports.addUserDetails = (req, res) => {
  let userDetails = reduceUserDetails(req.body);

  db.doc(`/users/${req.user.handle}`)
    .update(userDetails)
    .then(() => {
      return res.json({ message: 'Details added successfully' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ err: err.code });
    });
};

// GET own user details
exports.getAuthenticatedUser = (req, res) => {
  let userData = {};

  db.doc(`/users/${req.user.handle}`)
    .get()
    .then(userDoc => {
      if (userDoc.exists) {
        userData.credentials = userDoc.data();
        return likesRef.where('userHandle', '==', req.user.handle).get();
      }
    })
    .then(likesSnapshot => {
      userData.likes = [];
      likesSnapshot.forEach(doc => userData.likes.push(doc.data()));
      return notificationsRef
        .where('recipient', '==', req.user.handle)
        .orderBy('createdAt', 'desc')
        .limit(10)
        .get();
    })
    .then(notificationsSnapshot => {
      userData.notifications = [];
      let notification = {};
      notificationsSnapshot.forEach(doc => {
        notification = doc.data();
        notification.notificationId = doc.id;
        userData.notifications.push(notification);
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// GET public user
exports.getUserDetails = (req, res) => {
  const userData = {};
  db.doc(`/users/${req.params.handle}`)
    .get()
    .then(userDoc => {
      if (!userDoc.exists) {
        return res.status(404).json({ error: 'This user dose not exist' });
      }
      userData.userDetails = userDoc.data();
      return postsRef
        .where('userHandle', '==', req.params.handle)
        .orderBy('createdAt', 'desc')
        .get();
    })
    .then(postsSnapshot => {
      userData.userPosts = [];
      let post = {};
      postsSnapshot.forEach(doc => {
        post = doc.data();
        post.postId = doc.id;
        userData.userPosts.push(post);
      });
      return res.json(userData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

exports.markNotificationRead = (req, res) => {
  let batch = db.batch();
  req.body.forEach(notificationId => {
    const notification = db.doc(`/notifications/${notificationId}`);
    batch.update(notification, { read: true });
  });
  batch
    .commit()
    .then(() => {
      res.json({ message: 'Notifications marked read' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
