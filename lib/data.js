export const ROLES = { admin: 'Administrator', hod: 'Head of Department', lecturer: 'Lecturer', student: 'Student' };

export const seed = {
  departments: [
    { id: 'd1', name: 'Computing', code: 'CMP', hodId: 'u2', description: 'Computer science, software engineering and data.' },
    { id: 'd2', name: 'Civil Engineering', code: 'CVL', hodId: null, description: 'Structures, surveying and construction.' },
  ],
  users: [
    { id: 'u1', name: 'Amara Perera', email: 'admin@uni.edu', password: 'admin123', role: 'admin', deptId: null, batchId: null, phone: '+94 11 200 0001' },
    { id: 'u2', name: 'Dr. Nuwan Silva', email: 'hod@uni.edu', password: 'hod123', role: 'hod', deptId: 'd1', batchId: null, phone: '+94 11 200 0002' },
    { id: 'u3', name: 'Ms. Ishara Fernando', email: 'lecturer@uni.edu', password: 'lec123', role: 'lecturer', deptId: 'd1', batchId: null, phone: '+94 11 200 0003' },
    { id: 'u4', name: 'Mr. Kavindu Jayasuriya', email: 'kavindu@uni.edu', password: 'lec123', role: 'lecturer', deptId: 'd1', batchId: null, phone: '' },
    { id: 'u5', name: 'Sanduni Weerasinghe', email: 'student@uni.edu', password: 'stu123', role: 'student', deptId: 'd1', batchId: 'b1', phone: '' },
    { id: 'u6', name: 'Dilshan Rathnayake', email: 'dilshan@uni.edu', password: 'stu123', role: 'student', deptId: 'd1', batchId: 'b1', phone: '' },
    { id: 'u7', name: 'Tharushi Gunawardena', email: 'tharushi@uni.edu', password: 'stu123', role: 'student', deptId: 'd1', batchId: 'b2', phone: '' },
    { id: 'u8', name: 'Hasitha Bandara', email: 'hasitha@uni.edu', password: 'stu123', role: 'student', deptId: 'd1', batchId: 'b3', phone: '' },
  ],
  courses: [
    { id: 'c1', name: 'BSc (Hons) Computer Science', code: 'BSC-CS', deptId: 'd1', years: 4, description: 'Core computing theory with a final-year project.' },
    { id: 'c2', name: 'BSc (Hons) Software Engineering', code: 'BSC-SE', deptId: 'd1', years: 4, description: 'Building and maintaining large software systems.' },
    { id: 'c3', name: 'BEng Civil Engineering', code: 'BENG-CE', deptId: 'd2', years: 4, description: 'Design and delivery of civil infrastructure.' },
  ],
  batches: [
    { id: 'b1', name: 'CS 2024', courseId: 'c1', intakeYear: 2024 },
    { id: 'b2', name: 'CS 2025', courseId: 'c1', intakeYear: 2025 },
    { id: 'b3', name: 'SE 2025', courseId: 'c2', intakeYear: 2025 },
  ],
  modules: [
    {
      id: 'm1', courseId: 'c1', code: 'CS1012', title: 'Data Structures', credits: 4, semester: 1, lecturerId: 'u3',
      weeks: [
        { id: 'w1', week: 1, title: 'Arrays and linked lists', note: 'Read chapter 2 before the lecture.', files: [{ id: 'f1', name: 'week1-slides.pdf', size: 482113, url: null }] },
        { id: 'w2', week: 2, title: 'Stacks and queues', note: '', files: [] },
      ]
    },
    {
      id: 'm2', courseId: 'c1', code: 'CS1022', title: 'Database Systems', credits: 3, semester: 1, lecturerId: 'u4',
      weeks: [{ id: 'w3', week: 1, title: 'Relational model', note: 'Lab 1 sheet attached.', files: [] }]
    },
    { id: 'm3', courseId: 'c2', code: 'SE1012', title: 'Software Design', credits: 3, semester: 1, lecturerId: 'u3', weeks: [] },
  ],
};
