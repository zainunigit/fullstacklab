class Person {
  constructor(name, email) {
    this.name = name;
    this.email = email;
  }

  introduce() {
    return 'Hello, I am ' + this.name + ' (' + this.email + ').';
  }
}

class Student extends Person {
  constructor(name, email, rollNo, marks) {
    super(name, email);
    this.rollNo = rollNo;
    this.marks = marks;
  }

  introduce() {
    return super.introduce() + ' I am a student, roll no ' + this.rollNo + '.';
  }

  getResult() {
    const result = this.marks >= 50 ? 'PASS' : 'FAIL';
    return this.name + ': ' + result + ' (' + this.marks + ')';
  }
}

class FacultyMember extends Person {
  constructor(name, email, employeeId, department) {
    super(name, email);
    this.employeeId = employeeId;
    this.department = department;
  }

  introduce() {
    return super.introduce() + ' I teach in ' + this.department + ' (employee ' + this.employeeId + ').';
  }
}

const users = [
  new Student('Ali', 'ali@au.edu.pk', '23-1001', 82),
  new FacultyMember('Dr. Sana', 'sana@au.edu.pk', 'E-77', 'CS'),
  new Student('Sara', 'sara@au.edu.pk', '23-1002', 41),
  new FacultyMember('Dr. Omar', 'omar@au.edu.pk', 'E-90', 'SE'),
  new Person('Registrar Office', 'registrar@au.edu.pk'),
];

console.log('Polymorphism');
users.forEach((user) => console.log(user.introduce()));

console.log('\ninstanceof');
users.forEach((user) => {
  console.log(user.name, '| Person:', user instanceof Person, '| Student:', user instanceof Student, '| Faculty:', user instanceof FacultyMember);
});

console.log('\nResults');
users.filter((user) => user instanceof Student).forEach((s) => console.log(s.getResult()));

const guest = {
  name: 'Dr. Ahmed',
  email: 'ahmed@example.com',
};

console.log('\ncall()');
console.log(Person.prototype.introduce.call(guest));

const student = users[0];

console.log('\nDetached method');
const fn = student.introduce;
try {
  console.log(fn());
} catch (error) {
  console.log('fn() failed:', error.name, '-', error.message);
}
console.log('this depends on how the function is called. student.introduce() has student before the dot,');
console.log('but fn() has nothing before it, and class code is strict, so this is undefined.');

console.log('\nbind()');
const safeIntroduce = student.introduce.bind(student);
console.log(safeIntroduce());
