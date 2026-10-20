import Student from './Student.js';
import { calculateGrade, calculateAverage as averageOf } from './gradeUtils.js';

function isMissing(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

export function parseTranscriptJSON(rawData) {
  if (typeof rawData !== 'string') {
    throw new TypeError('Transcript data must be a JSON string');
  }
  try {
    return JSON.parse(rawData);
  } catch (error) {
    throw new Error('Malformed JSON: ' + error.message, { cause: error });
  }
}

export function validateTranscript(records) {
  if (!Array.isArray(records)) {
    throw new TypeError('Transcript must be a JSON array of students');
  }

  const seenIds = new Set();
  const students = [];

  for (const record of records) {
    if (record === null || typeof record !== 'object') {
      throw new TypeError('Every student record must be an object');
    }

    const { id, name, courses } = record;

    if (isMissing(id)) throw new TypeError('A student record is missing its id');
    if (seenIds.has(id)) throw new Error('Duplicate student id: ' + id);
    seenIds.add(id);

    if (isMissing(name)) throw new TypeError('Student ' + id + ' has no name');
    if (!Array.isArray(courses)) throw new TypeError('Student ' + id + ' needs a courses array');

    for (const course of courses) {
      if (course === null || typeof course !== 'object' || isMissing(course.code)) {
        throw new TypeError('Student ' + id + ' has a course with no code');
      }
      if (typeof course.marks !== 'number' || Number.isNaN(course.marks)) {
        throw new TypeError('Student ' + id + ', course ' + course.code + ': marks must be a number');
      }
      if (course.marks < 0 || course.marks > 100) {
        throw new RangeError('Student ' + id + ', course ' + course.code + ': marks ' + course.marks + ' are outside 0-100');
      }
    }

    students.push(new Student(id, name, courses));
  }

  return students;
}

export function buildReport(students) {
  const studentReports = students.map((student) => ({
    id: student.id,
    name: student.name,
    courses: student.courses.map((course) => ({
      code: course.code,
      marks: course.marks,
      grade: calculateGrade(course.marks),
    })),
    average: student.average,
    gpa: student.gpa,
  }));

  return {
    totalStudents: students.length,
    classAverage: averageOf(studentReports.map((s) => s.average)),
    students: studentReports,
  };
}

export function reportToJSON(report) {
  return JSON.stringify(report, null, 2);
}

export function processTranscript(rawData) {
  const parsed = parseTranscriptJSON(rawData);
  const students = validateTranscript(parsed);
  const report = buildReport(students);
  return reportToJSON(report);
}
