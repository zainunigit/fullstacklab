import { calculateAverage, calculateGPA } from './gradeUtils.js';

export default class Student {
  constructor(id, name, courses = []) {
    this.id = id;
    this.name = name;
    this.courses = courses;
  }

  get average() {
    return calculateAverage(this.courses.map((course) => course.marks));
  }

  get gpa() {
    return calculateGPA(this.courses);
  }
}
