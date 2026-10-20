import Student from './Student.js';
import { calculateGrade, calculateGPA as gpaOf } from './gradeUtils.js';
import { processTranscript } from './transcriptService.js';

const goodData = `
[
  { "id": 101, "name": "Ali",  "courses": [ { "code": "CS301", "marks": 81 }, { "code": "CS302", "marks": 74 } ] },
  { "id": 102, "name": "Sara", "courses": [ { "code": "CS301", "marks": 92 }, { "code": "CS302", "marks": 55 } ] }
]`;

const testCases = [
  { label: 'valid data', data: goodData },
  { label: 'malformed JSON', data: '[ { "id": 1, "name": "Ali", ' },
  { label: 'not an array', data: '{"id":1}' },
  { label: 'missing id', data: '[{"name":"Ali","courses":[]}]' },
  { label: 'duplicate id', data: '[{"id":1,"name":"A","courses":[]},{"id":1,"name":"B","courses":[]}]' },
  { label: 'marks above 100', data: '[{"id":1,"name":"A","courses":[{"code":"CS1","marks":101}]}]' },
  { label: 'marks below 0', data: '[{"id":1,"name":"A","courses":[{"code":"CS1","marks":-1}]}]' },
  { label: 'missing course code', data: '[{"id":1,"name":"A","courses":[{"marks":80}]}]' },
  { label: 'boundary marks 0 and 100', data: '[{"id":1,"name":"A","courses":[{"code":"X1","marks":0},{"code":"X2","marks":100}]}]' },
];

for (const testCase of testCases) {
  console.log('\n=== ' + testCase.label + ' ===');
  try {
    console.log(processTranscript(testCase.data));
  } catch (error) {
    console.log(error.name + ': ' + error.message);
  } finally {
    console.log('(finished this test)');
  }
}

const demo = new Student(7, 'Demo', [{ code: 'CS1', marks: 90 }]);
console.log('\nDemo student:', demo.name, '| grade', calculateGrade(90), '| GPA', gpaOf(demo.courses), '| average', demo.average);
