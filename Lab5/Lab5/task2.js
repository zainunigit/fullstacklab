const results = [
  { id: 1, name: 'Ali', department: 'CS', course: 'FSWD', marks: 82 },
  { id: 2, name: 'Sara', department: 'CS', course: 'FSWD', marks: 91 },
  { id: 3, name: 'Usman', department: 'SE', course: 'FSWD', marks: 47 },
  { id: 4, name: 'Hina', department: 'AI', course: 'FSWD', marks: 73 },
  { id: 5, name: 'Ahmed', department: 'SE', course: 'FSWD', marks: 64 },
  { id: 6, name: 'Zoya', department: 'AI', course: 'FSWD', marks: 91 },
];

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

function getGrade(marks) {
  if (marks >= 85) return 'A';
  if (marks >= 80) return 'A-';
  if (marks >= 75) return 'B+';
  if (marks >= 70) return 'B';
  if (marks >= 65) return 'B-';
  if (marks >= 60) return 'C+';
  if (marks >= 50) return 'C';
  return 'F';
}

function round(num) {
  return Math.round(num * 100) / 100;
}

function processResults(list) {
  return list.map((student) => {
    const grade = getGrade(student.marks);
    return {
      ...student,
      grade,
      status: student.marks >= 50 ? 'PASS' : 'FAIL',
      gradePoints: gradePointsTable[grade],
    };
  });
}

function rankStudents(list) {
  const copy = [...list];
  copy.sort((a, b) => {
    if (b.marks !== a.marks) return b.marks - a.marks;
    return a.name.localeCompare(b.name);
  });
  return copy;
}

function departmentStats(list) {
  const totals = list.reduce((acc, student) => {
    const dept = acc[student.department] || { students: 0, total: 0, highest: 0, passed: 0 };
    return {
      ...acc,
      [student.department]: {
        students: dept.students + 1,
        total: dept.total + student.marks,
        highest: Math.max(dept.highest, student.marks),
        passed: dept.passed + (student.marks >= 50 ? 1 : 0),
      },
    };
  }, {});

  const stats = {};
  Object.keys(totals).forEach((dept) => {
    const d = totals[dept];
    stats[dept] = {
      students: d.students,
      average: round(d.total / d.students),
      highest: d.highest,
      passed: d.passed,
    };
  });
  return stats;
}

function runQueries(list) {
  const average = list.reduce((sum, s) => sum + s.marks, 0) / list.length;
  const ranked = rankStudents(list);

  return {
    firstAbove85: list.find((s) => s.marks > 85),
    firstFailedIndex: list.findIndex((s) => s.marks < 50),
    someoneFailed: list.some((s) => s.marks < 50),
    allMarksValid: list.every((s) => s.marks >= 0 && s.marks <= 100),
    overallAverage: round(average),
    aboveAverage: list.filter((s) => s.marks > average).map((s) => s.name),
    topThree: ranked.slice(0, 3).map((s) => s.name),
  };
}

const before = JSON.stringify(results);

console.log('Processed results');
processResults(results).forEach((s) => {
  console.log(s.name, s.marks, s.grade, s.status, s.gradePoints);
});

console.log('\nRanked list');
rankStudents(results).forEach((s, i) => console.log(i + 1, s.name, s.marks));

console.log('\nDepartment stats');
console.log(departmentStats(results));

console.log('\nWith a new department DS');
const extra = [...results, { id: 7, name: 'Bilal', department: 'DS', course: 'FSWD', marks: 58 }];
console.log(departmentStats(extra));

console.log('\nQueries');
console.log(runQueries(results));

console.log('\nOriginal array unchanged:', JSON.stringify(results) === before);
