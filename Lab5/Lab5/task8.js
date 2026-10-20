class HttpError extends Error {
  constructor(status, url) {
    super('HTTP ' + status + ' for ' + url);
    this.name = 'HttpError';
    this.status = status;
  }
}

class NetworkError extends Error {
  constructor(message) {
    super(message);
    this.name = 'NetworkError';
  }
}

class InvalidJsonError extends Error {
  constructor(message) {
    super(message);
    this.name = 'InvalidJsonError';
  }
}

class TimeoutError extends Error {
  constructor(url) {
    super('Request to ' + url + ' timed out');
    this.name = 'TimeoutError';
  }
}

const fakeData = {
  '/users': [
    { id: 1, name: 'Ali', department: 'CS' },
    { id: 2, name: 'Sara', department: 'CS' },
    { id: 3, name: 'Usman', department: 'SE' },
    { id: 4, name: 'Hina', department: 'AI' },
    { id: 5, name: 'Ahmed', department: 'SE' },
  ],
  '/courses': [
    { code: 'FSWD', title: 'Full Stack Web Development' },
    { code: 'DSA', title: 'Data Structures' },
  ],
  '/results': [
    { studentId: 1, course: 'FSWD', marks: 82 },
    { studentId: 1, course: 'DSA', marks: 76 },
    { studentId: 2, course: 'FSWD', marks: 91 },
    { studentId: 2, course: 'DSA', marks: 88 },
    { studentId: 3, course: 'FSWD', marks: 47 },
    { studentId: 3, course: 'DSA', marks: 40 },
    { studentId: 4, course: 'FSWD', marks: 73 },
    { studentId: 5, course: 'FSWD', marks: 64 },
  ],
};

function makeAbortError() {
  return new DOMException('The operation was aborted.', 'AbortError');
}

function fakeFetch(url, options = {}) {
  const signal = options.signal;

  return new Promise((resolve, reject) => {
    if (signal && signal.aborted) {
      reject(makeAbortError());
      return;
    }

    const delay = url === '/slow' ? 3000 : 100;

    const timerId = setTimeout(() => {
      if (url === '/network-failure') {
        reject(new TypeError('fetch failed'));
      } else if (url === '/not-found') {
        resolve({ ok: false, status: 404, json: async () => ({ error: 'Not Found' }) });
      } else if (url === '/server-error') {
        resolve({ ok: false, status: 500, json: async () => ({ error: 'Server Error' }) });
      } else if (url === '/invalid-json') {
        resolve({ ok: true, status: 200, json: async () => JSON.parse('{ not valid json') });
      } else if (url === '/slow') {
        resolve({ ok: true, status: 200, json: async () => ({ message: 'finally done' }) });
      } else if (fakeData[url]) {
        resolve({ ok: true, status: 200, json: async () => fakeData[url] });
      } else {
        resolve({ ok: false, status: 404, json: async () => ({}) });
      }
    }, delay);

    if (signal) {
      signal.addEventListener('abort', () => {
        clearTimeout(timerId);
        reject(makeAbortError());
      }, { once: true });
    }
  });
}

async function getJSON(url, fetchImplementation, options) {
  let response;

  try {
    response = await fetchImplementation(url, options);
  } catch (error) {
    if (error.name === 'AbortError') throw new TimeoutError(url);
    throw new NetworkError('Network failure for ' + url + ': ' + error.message);
  }

  if (!response.ok) {
    throw new HttpError(response.status, url);
  }

  try {
    return await response.json();
  } catch (error) {
    if (error.name === 'AbortError') throw new TimeoutError(url);
    throw new InvalidJsonError('Invalid JSON from ' + url + ': ' + error.message);
  }
}

async function fetchWithTimeout(url, milliseconds, fetchImplementation = fakeFetch) {
  const controller = new AbortController();
  const timerId = setTimeout(() => controller.abort(), milliseconds);

  try {
    return await getJSON(url, fetchImplementation, { signal: controller.signal });
  } finally {
    clearTimeout(timerId);
  }
}

function round(num) {
  return Math.round(num * 100) / 100;
}

function buildDashboard(users, courses, results) {
  const students = users.map((user) => {
    const own = results.filter((r) => r.studentId === user.id);
    const total = own.reduce((sum, r) => sum + r.marks, 0);
    const average = own.length > 0 ? total / own.length : 0;
    return { ...user, average: round(average) };
  });

  const departments = {};
  for (const student of students) {
    if (!departments[student.department]) {
      departments[student.department] = { students: 0, total: 0, failed: 0 };
    }
    const dept = departments[student.department];
    dept.students += 1;
    dept.total += student.average;
    if (student.average < 50) dept.failed += 1;
  }

  const departmentStats = {};
  for (const name of Object.keys(departments)) {
    const dept = departments[name];
    departmentStats[name] = {
      students: dept.students,
      average: round(dept.total / dept.students),
      failed: dept.failed,
    };
  }

  const best = students.reduce((top, s) => (s.average > top.average ? s : top), students[0]);
  const allMarks = results.reduce((sum, r) => sum + r.marks, 0);

  return {
    totalStudents: users.length,
    totalCourses: courses.length,
    overallAverageMarks: round(allMarks / results.length),
    highestPerformingStudent: { name: best.name, average: best.average },
    failedStudents: students.filter((s) => s.average < 50).length,
    departmentStats,
  };
}

async function loadDashboard() {
  const start = Date.now();

  const [users, courses, results] = await Promise.all([
    fetchWithTimeout('/users', 1000),
    fetchWithTimeout('/courses', 1000),
    fetchWithTimeout('/results', 1000),
  ]);

  const dashboard = buildDashboard(users, courses, results);
  dashboard.loadTimeMs = Date.now() - start;
  return dashboard;
}

async function main() {
  const cases = [
    { label: '200 success', url: '/users', timeout: 1000 },
    { label: '404', url: '/not-found', timeout: 1000 },
    { label: '500', url: '/server-error', timeout: 1000 },
    { label: 'network failure', url: '/network-failure', timeout: 1000 },
    { label: 'invalid JSON', url: '/invalid-json', timeout: 1000 },
    { label: 'slow with 300ms timeout', url: '/slow', timeout: 300 },
  ];

  for (const testCase of cases) {
    try {
      const data = await fetchWithTimeout(testCase.url, testCase.timeout);
      console.log(testCase.label + ' -> OK', Array.isArray(data) ? data.length + ' records' : data);
    } catch (error) {
      console.log(testCase.label + ' -> ' + error.name + ': ' + error.message);
    }
  }

  console.log('\nDashboard');
  console.log(await loadDashboard());
  console.log('Load time is about 100ms, not 300ms, because the three requests ran together.');
}

main();
