const applicants = [
  { id: 'A101', name: 'Sara Khan', age: '19', matricMarks: '91', intermediateMarks: '87', entryTest: '78', program: 'BSCS', feePaid: 'true' },
  { id: 'A102', name: 'Ahmed Ali', age: 'twenty', matricMarks: '88', intermediateMarks: '', entryTest: '72', program: 'BSSE', feePaid: 'false' },
  { id: 'A103', name: 'Hassan', age: '18', matricMarks: '76', intermediateMarks: '83', entryTest: '91', program: 'BSAI', feePaid: 'true' },
  { id: 'B201', name: 'Boundary Merit', age: '17', matricMarks: '85', intermediateMarks: '60', entryTest: '70', program: 'BSCS', feePaid: 'true' },
  { id: 'B202', name: 'Fee Pending', age: '30', matricMarks: '95', intermediateMarks: '90', entryTest: '90', program: 'BSSE', feePaid: 'false' },
  { id: 'B203', name: 'Low Entry', age: '20', matricMarks: '90', intermediateMarks: '90', entryTest: '55', program: 'BSAI', feePaid: 'true' },
  { id: 'B204', name: 'Zero Marks', age: '22', matricMarks: '0', intermediateMarks: '60', entryTest: '60', program: 'BSCS', feePaid: 'true' },
  { id: 'X301', name: 'Too Old', age: '31', matricMarks: '80', intermediateMarks: '80', entryTest: '80', program: 'BSCS', feePaid: 'true' },
  { id: 'X302', name: 'Bad Marks', age: '20', matricMarks: '101', intermediateMarks: '-5', entryTest: 'abc', program: 'BSSE', feePaid: 'true' },
  { id: 'X303', name: 'Bad Program', age: '20', matricMarks: '80', intermediateMarks: '80', entryTest: '80', program: 'BBA', feePaid: 'true' },
  { id: 'X304', name: '   ', age: '20', matricMarks: '80', intermediateMarks: '80', entryTest: '80', program: 'BSCS', feePaid: 'maybe' },
  null,
  {},
];

function isEmpty(value) {
  return value === undefined || value === null || String(value).trim() === '';
}

function toNumber(value, fieldName, errors) {
  if (isEmpty(value)) {
    errors.push(fieldName + ' is missing');
    return null;
  }
  const num = Number(value);
  if (Number.isNaN(num)) {
    errors.push(fieldName + ' is not a number');
    return null;
  }
  return num;
}

function toMark(value, fieldName, errors) {
  const mark = toNumber(value, fieldName, errors);
  if (mark !== null && (mark < 0 || mark > 100)) {
    errors.push(fieldName + ' must be between 0 and 100');
    return null;
  }
  return mark;
}

function toBoolean(value, fieldName, errors) {
  if (isEmpty(value)) {
    errors.push(fieldName + ' is missing');
    return null;
  }
  const text = String(value).trim().toLowerCase();
  switch (text) {
    case 'true':
      return true;
    case 'false':
      return false;
    default:
      errors.push(fieldName + ' must be true or false');
      return null;
  }
}

function checkApplicant(applicant) {
  const errors = [];

  if (applicant === null || typeof applicant !== 'object') {
    return { data: null, errors: ['applicant record is not an object'] };
  }

  const id = isEmpty(applicant.id) ? null : String(applicant.id).trim();
  const name = isEmpty(applicant.name) ? null : String(applicant.name).trim();
  if (id === null) errors.push('id is missing');
  if (name === null) errors.push('name is missing');

  const age = toNumber(applicant.age, 'age', errors);
  if (age !== null && (age < 17 || age > 30)) {
    errors.push('age must be between 17 and 30');
  }

  const matric = toMark(applicant.matricMarks, 'matricMarks', errors);
  const inter = toMark(applicant.intermediateMarks, 'intermediateMarks', errors);
  const entry = toMark(applicant.entryTest, 'entryTest', errors);
  const feePaid = toBoolean(applicant.feePaid, 'feePaid', errors);

  let program = null;
  if (isEmpty(applicant.program)) {
    errors.push('program is missing');
  } else {
    program = String(applicant.program).trim().toUpperCase();
    switch (program) {
      case 'BSCS':
      case 'BSSE':
      case 'BSAI':
        break;
      default:
        errors.push('program ' + program + ' is not supported');
    }
  }

  return { data: { id, name, matric, inter, entry, program, feePaid }, errors };
}

function calculateMerit(matric, inter, entry) {
  const merit = matric * 0.2 + inter * 0.3 + entry * 0.5;
  return Math.round(merit * 100) / 100;
}

function getStatus(merit, inter, entry, feePaid) {
  const eligible = merit >= 70 && entry >= 60 && inter >= 60;
  if (!eligible) return 'REJECTED';
  return merit >= 80 && feePaid ? 'SELECTED' : 'WAITING';
}

function processApplicant(applicant) {
  const { data, errors } = checkApplicant(applicant);

  if (errors.length > 0) {
    return {
      id: data ? data.id : null,
      name: data ? data.name : null,
      program: data && data.program ? data.program : 'UNKNOWN',
      merit: null,
      status: 'INVALID DATA',
      errors,
    };
  }

  const merit = calculateMerit(data.matric, data.inter, data.entry);
  return {
    id: data.id,
    name: data.name,
    program: data.program,
    merit,
    status: getStatus(merit, data.inter, data.entry, data.feePaid),
    errors: [],
  };
}

function summarize(results) {
  let valid = 0;
  let invalid = 0;
  let totalMerit = 0;
  let highest = null;
  let lowest = null;
  const programCount = {};

  for (const result of results) {
    programCount[result.program] = (programCount[result.program] || 0) + 1;

    if (result.status === 'INVALID DATA') {
      invalid++;
      continue;
    }

    valid++;
    totalMerit += result.merit;
    if (highest === null || result.merit > highest.merit) highest = result;
    if (lowest === null || result.merit < lowest.merit) lowest = result;
  }

  return {
    validApplicants: valid,
    invalidApplicants: invalid,
    highestMeritApplicant: highest ? { id: highest.id, name: highest.name, merit: highest.merit } : null,
    lowestMerit: lowest ? lowest.merit : null,
    averageMerit: valid > 0 ? Math.round((totalMerit / valid) * 100) / 100 : null,
    applicantsPerProgram: programCount,
  };
}

const before = JSON.stringify(applicants);
const results = [];
for (const applicant of applicants) {
  results.push(processApplicant(applicant));
}

for (const r of results) {
  console.log(r.id, '|', r.name, '|', r.program, '|', r.merit, '|', r.status);
  if (r.errors.length > 0) console.log('   problems:', r.errors.join(', '));
}

console.log('\nSummary');
console.log(summarize(results));
console.log('\nOriginal data unchanged:', JSON.stringify(applicants) === before);
