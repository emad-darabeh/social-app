let db = {
  users: [
    {
      userId: 'id-example',
      email: 'example@email.com',
      handle: 'user',
      createdAt: '00:00 example',
      imageUrl: 'https://example/img.png',
      bio: 'bio-example',
      website: 'www.userwebsite.com',
      location: 'London, UK'
    }
  ],
  posts: [
    {
      userHandle: 'this is a user',
      body: 'this is a body',
      createdAt: '2019-07-07T17:29:14.356Z',
      likeCount: 5,
      commentCount: 2
    }
  ],
  comment: [
    {
      userHandle: 'user',
      postId: 'postId',
      body: 'comment body',
      createdAt: '2019-07-07T17:29:14.356Z'
    }
  ],
  notification: [
    {
      recipient: 'user',
      sender: 'user2',
      read: 'true | false',
      postId: '',
      type: 'like | comment',
      createdAt: ''
    }
  ]
};

const userDetails = {
  credentials: {
    bio: 'this is my bio',
    createdAt: '2019-07-08T09:48:36.075Z',
    email: 'user@email.com',
    handle: 'user',
    imageUrl:
      'https://firebasestorage.googleapis.com/v0/b/socialapp-187a2.appspot.com/o/389593607773.jpg?alt=media',
    location: 'London,, UK',
    userId: 'zr6gBoa3ZUg8DDmT2B5aae8mALv2',
    website: 'https://www.example.com'
  },
  likes: [
    {
      userHandle: 'user',
      postId: ''
    },
    {
      userHandle: 'user',
      postId: ''
    }
  ]
};
