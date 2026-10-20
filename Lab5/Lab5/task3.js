const student = {
  id: 101,
  name: 'Ali',
  marks: 0,
  scholarship: false,
  address: { city: 'Islamabad', sector: 'F-10' },
  contact: { email: 'ali@university.edu' },
};

const update = {
  name: 'Ali Khan',
  address: { city: 'Rawalpindi' },
  contact: { phone: '03001234567' },
};

function removeUndefined(obj = {}) {
  const clean = {};
  for (const key of Object.keys(obj)) {
    if (obj[key] !== undefined) clean[key] = obj[key];
  }
  return clean;
}

function updateStudent(current, changes = {}) {
  const { address: oldAddress, contact: oldContact, ...oldRest } = current;
  const { address: newAddress, contact: newContact, ...newRest } = changes;

  return {
    ...oldRest,
    ...removeUndefined(newRest),
    address: { ...oldAddress, ...removeUndefined(newAddress) },
    contact: { ...oldContact, ...removeUndefined(newContact) },
  };
}

const before = JSON.stringify(student);
const updated = updateStudent(student, update);

console.log('Updated student:', updated);
console.log('Original unchanged:', JSON.stringify(student) === before);

const second = updateStudent(student, { marks: 0, scholarship: false, nickname: '', age: undefined });
console.log('\nFalsy values kept:', second);

const naive = { ...student, ...update };
console.log('\nNaive merge address:', naive.address);
console.log('Naive merge contact:', naive.contact);

const {
  name: studentName,
  address: { city: currentCity, sector, zip = 'N/A' },
  contact: { phone: phoneNumber = 'no phone' },
} = updated;
console.log('\nDestructured:', { studentName, currentCity, sector, zip, phoneNumber });

const [firstKey, , thirdKey, ...otherKeys] = Object.keys(updated);
console.log('Array destructuring:', firstKey, thirdKey, otherKeys);

function showChanges(label, ...fields) {
  return label + ': ' + fields.join(', ');
}
console.log(showChanges('Changed fields', ...Object.keys(update)));

const room = updated?.address?.room?.number ?? 'unknown';
const originalPhone = student.contact?.phone ?? 'no phone yet';
console.log('Optional chaining:', room, '|', originalPhone);

const marks = updated.marks;
console.log('marks || 50 =', marks || 50, '| marks ?? 50 =', marks ?? 50);

const { id } = updated;
const summary = { id, studentName, currentCity };
console.log('Shorthand object:', summary);

console.log('\nReference check');
console.log('original === updated:', student === updated);
console.log('original.address === updated.address:', student.address === updated.address);
console.log('original.contact === updated.contact:', student.contact === updated.contact);

const shallow = { ...student };
console.log('shallow copy address === original address:', shallow.address === student.address);

console.log('\nObjects are compared by reference, not by content.');
console.log('updateStudent builds a new top level object, a new address object and a new contact object,');
console.log('so all three comparisons are false and the original can never be changed by accident.');
console.log('A plain shallow copy keeps the same address and contact objects, so those would be shared.');
