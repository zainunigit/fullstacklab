const dummyUsers = {
  1: { id: 1, name: 'Leanne Graham', email: 'leanne@example.com' },
  2: { id: 2, name: 'Ervin Howell', email: 'ervin@example.com' },
  3: { id: 3, name: 'No Email Person' },
  4: { id: 4, name: 'Has No Posts', email: 'noposts@example.com' },
};

const dummyPosts = {
  1: [
    { id: 11, userId: 1, title: 'First post' },
    { id: 12, userId: 1, title: 'Second post' },
  ],
  2: [{ id: 21, userId: 2, title: 'Hello world' }],
  3: [{ id: 31, userId: 3, title: 'A post' }],
  4: [],
  5: [{ id: 51, userId: 999, title: 'Post that belongs to someone else' }],
};

function fetchUserDetails(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 'userServerDown') {
        reject(new Error('User service is down'));
      } else if (dummyUsers[id]) {
        resolve(dummyUsers[id]);
      } else {
        reject(new Error('User ' + id + ' not found'));
      }
    }, 300);
  });
}

function fetchUserPosts(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === 'postServerDown') {
        reject(new Error('Posts service is down'));
      } else if (dummyPosts[id]) {
        resolve(dummyPosts[id]);
      } else {
        reject(new Error('Posts for user ' + id + ' not found'));
      }
    }, 100);
  });
}

function isValidUser(user) {
  return (
    user !== null &&
    typeof user === 'object' &&
    Number.isInteger(user.id) &&
    typeof user.name === 'string' &&
    user.name.trim() !== '' &&
    typeof user.email === 'string' &&
    user.email.includes('@')
  );
}

function arePostsValid(posts, userId) {
  return (
    Array.isArray(posts) &&
    posts.length > 0 &&
    posts.every((post) => post.userId === userId && typeof post.title === 'string' && post.title !== '')
  );
}

function loadUserProfile(userId, postsId = userId) {
  return Promise.all([fetchUserDetails(userId), fetchUserPosts(postsId)]).then(([user, posts]) => {
    if (!isValidUser(user)) {
      throw new Error('Rejected: user details are invalid');
    }
    if (!arePostsValid(posts, user.id)) {
      throw new Error('Rejected: posts are empty or do not belong to this user');
    }
    return { user, posts, postCount: posts.length };
  });
}

const testCases = [
  { label: 'both operations valid', userId: 1 },
  { label: 'user details invalid (no email)', userId: 3 },
  { label: 'posts invalid (user has no posts)', userId: 4 },
  { label: 'posts belong to a different user', userId: 2, postsId: 5 },
  { label: 'user operation fails', userId: 'userServerDown', postsId: 1 },
  { label: 'posts operation fails', userId: 1, postsId: 'postServerDown' },
  { label: 'both operations fail', userId: 'userServerDown', postsId: 'postServerDown' },
];

async function main() {
  for (const testCase of testCases) {
    console.log('\n' + testCase.label);
    const start = Date.now();
    try {
      const result = await loadUserProfile(testCase.userId, testCase.postsId);
      console.log('ACCEPTED:', result.user.name, 'with', result.postCount, 'post(s)');
    } catch (error) {
      console.log('REJECTED:', error.message);
    } finally {
      console.log('took', Date.now() - start, 'ms');
    }
  }
}

main();
