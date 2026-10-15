var name = "Zain Raza";
var age = 20;
var isStudent = true;
var university = "Air University";
var cgpa = 3.5;

console.log("My Biography");
console.log("Name: " + name);
console.log("Age: " + age);
console.log("Student: " + isStudent);
console.log("University: " + university);
console.log("CGPA: " + cgpa);

var biography = {
    name: "Zain Raza",
    age: 20,
    isStudent: true,
    university: "Air University",
    address: {
        city: "Islamabad",
        country: "Pakistan"
    },
    degreeProgram: {
        degree: "BSCS",
        semester: 3
    }
};

console.log("Name: " + biography.name);
console.log("Age: " + biography.age);
console.log("University: " + biography.university);
console.log("City: " + biography.address.city);
console.log("Country: " + biography.address.country);
console.log("Degree: " + biography.degreeProgram.degree);
console.log("Semester: " + biography.degreeProgram.semester);
