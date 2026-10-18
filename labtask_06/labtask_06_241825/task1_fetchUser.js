const dummyUsers = {
  1: { id: 1, name: 'Leanne Graham', username: 'Bret', email: 'leanne@example.com' },
  2: { id: 2, name: 'Ervin Howell', username: 'Antonette', email: 'ervin@example.com' },
  3: { id: 3, name: 'Broken Record', username: 'broken' },
};

function dummyFetch(url) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (url.includes('offline')) {
        reject(new TypeError('Network request failed'));
        return;
      }

      const id = Number(url.split('/').pop());

      if (dummyUsers[id]) {
        resolve({ ok: true, status: 200, json: async () => dummyUsers[id] });
      } else if (url.includes('badjson')) {
        resolve({ ok: true, status: 200, json: async () => JSON.parse('{oops') });
      } else {
        resolve({ ok: false, status: 404, json: async () => ({}) });
      }
    }, 200);
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

async function fetchUser(id, fetchFunction = dummyFetch) {
  const url = 'https://dummy-api.test/users/' + id;

  let response;
  try {
    response = await fetchFunction(url);
  } catch (error) {
    throw new Error('Network error while fetching user ' + id + ': ' + error.message);
  }

  if (!response.ok) {
    throw new Error('Could not fetch user ' + id + ' (HTTP ' + response.status + ')');
  }

  let user;
  try {
    user = await response.json();
  } catch (error) {
    throw new Error('Server sent invalid JSON for user ' + id);
  }

  if (!isValidUser(user)) {
    throw new Error('User ' + id + ' came back with incomplete or invalid data');
  }

  return user;
}

async function main() {
  console.log('Fetch a valid user');
  try {
    const user = await fetchUser(1);
    console.log('Success:', user);
  } catch (error) {
    console.log('Error:', error.message);
  }

  const failingCases = [
    { label: 'user that does not exist', id: 99 },
    { label: 'user with missing email', id: 3 },
    { label: 'network failure', id: 'offline' },
    { label: 'invalid JSON', id: 'badjson' },
  ];

  for (const testCase of failingCases) {
    console.log('\nFetch ' + testCase.label);
    try {
      const user = await fetchUser(testCase.id);
      console.log('Success:', user);
    } catch (error) {
      console.log('Error:', error.message);
    }
  }
}

main();

