import marksModel from "../Models/marksModel.js";

// upload marks
export const uploadMarks = async (req, res) => {
  try {
    const { semester, exam, students } = req.body;

    if (!Array.isArray(students)) {
      return res.status(400).json({ error: 'Students data must be an array' });
    }
    const uploadedMarks = [];

    for (const { studentId, marks } of students) {
      let existingMark = await marksModel.findOneAndUpdate(
          { semester, exam, 'students.studentId': studentId },
          {
            $push: { 'students.$[student].marks': marks },
          },
          {
            arrayFilters: [{ 'student.studentId': studentId }],
            new: true,
          }
      );

      if (!existingMark) {

        const mark = new marksModel({ semester, exam, students: [{ studentId, marks }] });
        await mark.save();
        uploadedMarks.push(mark);
      } else {

        const existingStudent = existingMark.students.find(student => student.studentId === studentId);
        if (existingStudent) {
          marks.forEach(({ subject, marksObtained }) => {
            const existingSubject = existingStudent.marks.find(existing => existing.subject === subject);
            if (existingSubject) {

              existingSubject.marksObtained = marksObtained;
            } else {

              existingStudent.marks.push({ subject, marksObtained });
            }
          });

          await existingMark.save();
          uploadedMarks.push(existingMark);
        }
      }
    }

    res.status(201).json({ message: 'Marks uploaded successfully', uploadedMarks });


  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


//  update marks
export const updateMarks = async (req, res) => {
  try {
    const { studentId, marks } = req.body;

    // console.log("Received :", req.body);

    let mark = await marksModel.findOne({ studentId });

    // console.log("Existing mark ", mark);
    if (!mark) {
      return res.status(404).json({ error: "Marks not found for the student" });
    }
    marks.forEach(({ subject, marksObtained }) => {
      const existingMark = mark.marks.find((m) => m.subject === subject);
      if (existingMark) {
        existingMark.marksObtained = marksObtained;
      } else {
        mark.marks.push({ subject, marksObtained });
      }
    });

    // console.log("Updated mark ", mark);

    await mark.save();

    res.status(200).json({ message: "Marks updated successfully", mark });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

//  delete marks for a particular student
export const deleteMarks = async (req, res) => {
  try {
    const { studentId } = req.params;

    let mark = await marksModel.findOne({ studentId });

    if (!mark) {
      return res.status(404).json({ error: "Marks not found for the student" });
    }

    await marksModel.deleteOne({ _id: mark._id });

    res.status(200).json({ message: "Marks deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
