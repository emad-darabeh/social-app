const { db, postsRef, likesRef, commentsRef } = require('../utils/admin');

// GET all posts
exports.getAllPosts = (req, res) => {
  postsRef
    .orderBy('createdAt', 'desc')
    .get()
    .then(snapshot => {
      const posts = [];
      snapshot.forEach(doc => {
        posts.push({
          postId: doc.id,
          userHandle: doc.data().userHandle,
          body: doc.data().body,
          commentCount: doc.data().commentCount,
          likeCount: doc.data().likeCount,
          createdAt: doc.data().createdAt,
          userImage: doc.data().userImage
        });
      });
      return res.json(posts);
    })
    .catch(err => console.error(err));
};

// POST Create new post
exports.createNewPost = (req, res) => {
  if (req.body.body.trim() === '') {
    return res.status(400).json({ body: 'Post body must not be empty' });
  }
  const newPost = {
    userHandle: req.user.handle,
    body: req.body.body,
    userImage: req.user.imageUrl,
    createdAt: new Date().toISOString(),
    likeCount: 0,
    commentCount: 0
  };

  postsRef
    .add(newPost)
    .then(doc => {
      const resPost = newPost;
      resPost.postId = doc.id;
      res.json(resPost);
    })
    .catch(err => {
      console.error(err);
      return res
        .status(500)
        .json({ error: 'something went wrong, the post has not been created' });
    });
};

// GET a particular post
exports.getPost = (req, res) => {
  let postData = {};

  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(snapshot => {
      if (!snapshot.exists) {
        return res.status(404).json({ error: 'this post dose not exist' });
      }
      postData = snapshot.data();
      postData.postId = snapshot.id;
      return commentsRef
        .orderBy('createdAt', 'desc')
        .where('postId', '==', req.params.postId)
        .get();
    })
    .then(commentsSnapshot => {
      postData.comments = [];
      commentsSnapshot.forEach(doc => postData.comments.push(doc.data()));
      return res.json(postData);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// POST comment on a post
exports.commentOnPost = (req, res) => {
  // check if the comment is empty
  if (req.body.body.trim() === '')
    return res.status(400).json({ comment: 'Must not be empty' });

  // create the comment object
  const newComment = {
    userHandle: req.user.handle,
    body: req.body.body,
    userImage: req.user.imageUrl,
    postId: req.params.postId,
    createdAt: new Date().toISOString()
  };

  // check if the post still exists
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(snapshot => {
      if (!snapshot.exists) {
        return res
          .status(404)
          .json({ error: 'This post dose not exist anymore' });
      }
      return snapshot.ref.update({
        commentCount: ++snapshot.data().commentCount
      });
    })
    .then(() => {
      // add the comment to the database
      return commentsRef.add(newComment);
    })
    .then(() => {
      return res.json(newComment);
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// GET like a post
exports.likePost = (req, res) => {
  let postData;
  // check if the post still exists
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res
          .status(404)
          .json({ error: 'This post dose not exist anymore' });
      }
      postData = doc.data();
      postData.postId = doc.id;
      return likesRef
        .where('postId', '==', req.params.postId)
        .where('userHandle', '==', req.user.handle)
        .limit(1)
        .get();
    })
    .then(doc => {
      if (!doc.empty) {
        return res.status(400).json({ error: 'you already liked this image' });
      } else {
        return likesRef
          .add({
            userHandle: req.user.handle,
            postId: req.params.postId
          })
          .then(() => {
            postData.likeCount++;
            return db
              .doc(`/posts/${req.params.postId}`)
              .update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// GET unlike a post
exports.unlikePost = (req, res) => {
  let postData;
  // check if the post still exists
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(doc => {
      if (!doc.exists) {
        return res
          .status(404)
          .json({ error: 'This post dose not exist anymore' });
      }
      postData = doc.data();
      postData.postId = doc.id;
      return likesRef
        .where('postId', '==', req.params.postId)
        .where('userHandle', '==', req.user.handle)
        .limit(1)
        .get();
    })
    .then(doc => {
      if (doc.empty) {
        return res.status(400).json({ error: 'you did not like this image' });
      } else {
        return db
          .doc(`/likes/${doc.docs[0].id}`)
          .delete()
          .then(() => {
            postData.likeCount--;
            return db
              .doc(`/posts/${req.params.postId}`)
              .update({ likeCount: postData.likeCount });
          })
          .then(() => {
            return res.json(postData);
          });
      }
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};

// DELETE post
exports.deletePost = (req, res) => {
  // check if the post exists
  db.doc(`/posts/${req.params.postId}`)
    .get()
    .then(snapshot => {
      if (!snapshot.exists) {
        return res
          .status(404)
          .json({ error: 'This post dose not exist anymore' });
      }
      if (snapshot.data().userHandle !== req.user.handle) {
        return res
          .status(403)
          .json({ error: 'User is not authorized to delete this post' });
      }
      return snapshot.ref.delete();
    })
    .then(() => {
      return res.json({ message: 'Post deleted successfully' });
    })
    .catch(err => {
      console.error(err);
      return res.status(500).json({ error: err.code });
    });
};
