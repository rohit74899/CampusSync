const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    marks: {
        type: Number,
        default: 0 // Default marks for a subject
    }
});

// Define your default subjects
const defaultSubjects = [
    { name: "Math", marks: 0 },
    { name: "Science", marks: 0 },
    { name: "History", marks: 0 }
    // Add more subjects as needed
];

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    Roll_no: {
        type: String,
        unique: true
    },
    address: {
        type: String
    },
    class: {
        type: String
    },
    subjects: {
        type: [subjectSchema],
        default: defaultSubjects // Set the default subjects array
    }
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
