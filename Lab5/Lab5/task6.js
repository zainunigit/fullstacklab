const students = {
  101: { id: 101, name: 'Ali', completed: ['CS301'], registered: [] },
  102: { id: 102, name: 'Sara', completed: [], registered: [] },
};

const courses = {
  CS401: { code: 'CS401', prerequisites: ['CS301'], seats: 5 },
  CS402: { code: 'CS402', prerequisites: [], seats: 0 },
};

function loadStudent(studentId, callback) {
  setTimeout(() => {
    const student = students[studentId];
    if (!student) {
      callback(new Error('Student ' + studentId + ' does not exist'));
      return;
    }
    callback(null, student);
  }, 50);
}

function checkPrerequisites(student, courseCode, callback) {
  setTimeout(() => {
    const course = courses[courseCode];
    if (!course) {
      callback(new Error('Course ' + courseCode + ' does not exist'));
      return;
    }
    const missing = course.prerequisites.filter((code) => !student.completed.includes(code));
    if (missing.length > 0) {
      callback(new Error('Prerequisite not completed: ' + missing.join(', ')));
      return;
    }
    callback(null, course);
  }, 50);
}

function checkSeats(course, callback) {
  setTimeout(() => {
    if (course.seats <= 0) {
      callback(new Error('Course ' + course.code + ' is full'));
      return;
    }
    callback(null, course);
  }, 50);
}

function registerCourse(student, course, callback) {
  setTimeout(() => {
    if (student.registered.includes(course.code)) {
      callback(new Error('Student ' + student.id + ' is already registered in ' + course.code));
      return;
    }
    student.registered.push(course.code);
    course.seats -= 1;
    callback(null, { studentId: student.id, course: course.code, status: 'REGISTERED' });
  }, 50);
}

function registerForCourse(studentId, courseCode, done) {
  loadStudent(studentId, (err1, student) => {
    if (err1) return done(err1);

    checkPrerequisites(student, courseCode, (err2, course) => {
      if (err2) return done(err2);

      checkSeats(course, (err3, openCourse) => {
        if (err3) return done(err3);

        registerCourse(student, openCourse, (err4, confirmation) => {
          if (err4) return done(err4);
          done(null, confirmation);
        });
      });
    });
  });
}

const scenarios = [
  { label: 'success', studentId: 101, course: 'CS401' },
  { label: 'already registered', studentId: 101, course: 'CS401' },
  { label: 'student does not exist', studentId: 999, course: 'CS401' },
  { label: 'prerequisite missing', studentId: 102, course: 'CS401' },
  { label: 'course full', studentId: 101, course: 'CS402' },
  { label: 'unknown course', studentId: 101, course: 'CS999' },
];

function runScenario(index) {
  if (index >= scenarios.length) {
    console.log('\nAll scenarios finished.');
    console.log('\nWhy callbacks get hard to maintain:');
    console.log('1. Every extra dependent step adds another level of nesting, so the code drifts to the right.');
    console.log('2. Every level has to repeat the error check. Forget one and the workflow keeps going with bad data,');
    console.log('   forget a return and the callback can run twice.');
    console.log('3. try/catch cannot catch an error thrown inside a later setTimeout, so there is no single place for errors.');
    return;
  }

  const scenario = scenarios[index];
  registerForCourse(scenario.studentId, scenario.course, (error, result) => {
    if (error) {
      console.log('[' + scenario.label + '] FAILED:', error.message);
    } else {
      console.log('[' + scenario.label + '] OK:', result);
    }
    runScenario(index + 1);
  });
}

runScenario(0);
