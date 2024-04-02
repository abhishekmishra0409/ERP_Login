import marksModel from "../Models/marksModel.js";

// upload marks
export const uploadMarks = async (req, res) => {
  try {
    const { studentId, marks } = req.body;

    const mark = new marksModel({ studentId, marks });

    await mark.save();

    res.status(201).json({ message: "Marks uploaded successfully", mark });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// // view marks
// export const viewMarks = async (req, res) => {
//   try {
//     const { studentId } = req.query;

//     const marks = await marksModel.findOne({ studentId });

//     res.status(200).json({ marks });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

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
