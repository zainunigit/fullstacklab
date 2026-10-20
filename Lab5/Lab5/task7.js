const studentsDb = {
  101: { id: 101, name: 'Ali', completed: ['CS301'] },
  102: { id: 102, name: 'Sara', completed: [] },
};

const coursesDb = {
  CS401: { code: 'CS401', prerequisites: ['CS301'], seats: 3 },
  CS402: { code: 'CS402', prerequisites: [], seats: 0 },
};

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getStudent(id) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (studentsDb[id]) resolve(studentsDb[id]);
      else reject(new Error('Student ' + id + ' not found'));
    }, 30);
  });
}

function getCourse(code) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (coursesDb[code]) resolve(coursesDb[code]);
      else reject(new Error('Course ' + code + ' not found'));
    }, 30);
  });
}

function checkPrerequisites(data) {
  return wait(30).then(() => {
    const missing = data.course.prerequisites.filter((c) => !data.student.completed.includes(c));
    if (missing.length > 0) throw new Error('Missing prerequisites: ' + missing.join(', '));
    return data;
  });
}

function checkSeats(data) {
  return wait(30).then(() => {
    if (data.course.seats <= 0) throw new Error(data.course.code + ' is full');
    return data;
  });
}

function registerStudent(data) {
  return wait(30).then(() => {
    return { studentId: data.student.id, course: data.course.code, status: 'REGISTERED' };
  });
}

function sendEmail(confirmation) {
  return wait(20).then(() => 'email sent for student ' + confirmation.studentId);
}

function sendSMS() {
  return wait(40).then(() => {
    throw new Error('SMS gateway unavailable');
  });
}

function writeAuditLog(confirmation) {
  return wait(10).then(() => 'audit written for ' + confirmation.course);
}

function registrationChain(studentId, courseCode) {
  return getStudent(studentId)
    .then((student) => {
      return getCourse(courseCode).then((course) => {
        return { student, course };
      });
    })
    .then(checkPrerequisites)
    .then(checkSeats)
    .then(registerStudent)
    .finally(() => console.log('   chain finished for', studentId, courseCode));
}

function brokenChain() {
  return getStudent(101)
    .then((student) => {
      getCourse('CS401');
    })
    .then((value) => 'next step received: ' + value);
}

function postRegistration(confirmation) {
  const names = ['Email', 'SMS', 'Audit'];
  return Promise.allSettled([
    sendEmail(confirmation),
    sendSMS(confirmation),
    writeAuditLog(confirmation),
  ]).then((outcomes) => {
    return outcomes.map((outcome, i) => ({ service: names[i], status: outcome.status }));
  });
}

function serverA() {
  return wait(50).then(() => {
    throw new Error('Server A is down');
  });
}

function serverB(code) {
  return wait(150).then(() => ({ ...coursesDb[code], source: 'Server B' }));
}

function serverC() {
  return wait(200).then(() => {
    throw new Error('Server C is down');
  });
}

async function main() {
  console.log('Part A: successful registration');
  const confirmation = await registrationChain(101, 'CS401');
  console.log('   ', confirmation);

  console.log('\nPart B: post registration services');
  console.log(await postRegistration(confirmation));

  console.log('\nPart A: failures stop the chain');
  const failures = [[999, 'CS401'], [101, 'CS999'], [102, 'CS401'], [101, 'CS402']];
  for (const [id, code] of failures) {
    await registrationChain(id, code).catch((error) => console.log('    FAILED:', error.message));
  }

  console.log('\nMissing return demo');
  console.log(await brokenChain());

  console.log('\nPart C: race vs any');
  await Promise.race([serverA(), serverB('CS401')])
    .then((course) => console.log('race:', course))
    .catch((error) => console.log('race rejected:', error.message));

  const first = await Promise.any([serverA(), serverB('CS401')]);
  console.log('any:', first.source, 'returned', first.code);

  await Promise.any([serverA(), serverC()]).catch((error) => {
    console.log('any when all fail:', error.name, error.errors.map((e) => e.message));
  });

  console.log('\nWhy these combinators:');
  console.log('allSettled for the post registration services, because they are independent and I want the status of every one even if SMS fails.');
  console.log('any for the two servers, because I want the first successful answer. race would give me the first settled one, which could be a failure.');
}

main();
