const gradePointsTable = {
  A: 4.0,
  'A-': 3.67,
  'B+': 3.33,
  B: 3.0,
  'B-': 2.67,
  'C+': 2.33,
  C: 2.0,
  F: 0,
};

function checkMarks(marks) {
  if (typeof marks !== 'number' || Number.isNaN(marks)) {
    throw new TypeError('marks must be a number');
  }
  if (marks < 0 || marks > 100) {
    throw new RangeError('marks must be between 0 and 100, got ' + marks);
  }
}

export function calculateGrade(marks) {
  checkMarks(marks);
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

export function calculateAverage(marksList) {
  if (!Array.isArray(marksList)) throw new TypeError('marksList must be an array');
  if (marksList.length === 0) return 0;

  let total = 0;
  for (const marks of marksList) {
    checkMarks(marks);
    total += marks;
  }
  return Math.round((total / marksList.length) * 100) / 100;
}

export function calculateGPA(courses) {
  if (!Array.isArray(courses)) throw new TypeError('courses must be an array');
  if (courses.length === 0) return 0;

  let points = 0;
  for (const course of courses) {
    points += gradePointsTable[calculateGrade(course.marks)];
  }
  return Math.round((points / courses.length) * 100) / 100;
}
