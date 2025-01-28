import Queue from '../models/queue.model.js'; // Import your Queue model
import mongoose from 'mongoose';
import User from '../models/user.model.js';


export const addToQueue = async (req, res) => {
  const { studentId, studentNumber, firstName, lastName, college, yearLevel, degreeProgram, step, isPriority } = req.body;
  const today = new Date().toDateString();

  try {
    let queue = await Queue.findOne({ step, date: today });

    if (!queue) {
      queue = await Queue.create({ step, date: today, students: [] });
    }

    // Use `new` to create an ObjectId instance
    const studentObjectId = new mongoose.Types.ObjectId(studentId);

    // Check if the student is already in the queue
    const isAlreadyQueued = queue.students.some(student => student.studentId.equals(studentObjectId));
    if (isAlreadyQueued) {
      return res.status(400).json({ error: 'Student is already in the queue' });
    }

    const newEntry = {
      studentId: studentObjectId,
      studentNumber,
      firstName,
      lastName,
      yearLevel,
      college,
      degreeProgram,
      queueNumber: queue.students.length + 1,
      priority: isPriority,
    };

    if (isPriority) {
      queue.students.unshift(newEntry);
    } else {
      queue.students.push(newEntry);
    }

    queue.students.forEach((student, index) => {
      student.queueNumber = index + 1;
    });

    await queue.save();

    const updatedUser = await User.findByIdAndUpdate(
      studentId,
      {
        $set: {
          isPresent: 'ARRIVED',
        },
        $push: {
          notifications: {
            message: `Arrived for Annual PE.`,
            type: 'success',
            timestamp: new Date(),
            link: '/status',
            isRead: false
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }

    return res.json({ queueNumber: newEntry.queueNumber });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};



export const getQueueStudents = async (req, res) => {
    const today = new Date().toDateString();
    const { step } = req.query; // Optionally filter by step
  
    try {
      // If step is provided, filter by step and today's date
      // If step is not provided, fetch all queues for today
      const query = step ? { step, date: today } : { date: today };
  
      const queue = await Queue.findOne(query);
      
      if (!queue) {
        return res.status(404).json({ error: 'No queue found for today.' });
      }
  
      // Return the students in the queue
      return res.json({ students: queue.students });
    } catch (error) {
      return res.status(500).json({ error: error.message });
    }
  };
  




export const moveToNextStep = async (req, res) => {
  const { studentId, currentStep, nextStep } = req.body;
  console.log(studentId);
  try {
    const today = new Date().toDateString();

    // Find the current queue
    let currentQueue = await Queue.findOne({ step: currentStep, date: today });
    if (!currentQueue) {
      return res.status(404).json({ error: `Queue for step "${currentStep}" not found.` });
    }

    // Find the student in the current queue
    const student = currentQueue.students.find((student) =>
      student.studentId.equals(studentId)
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found in the current queue." });
    }

    // Remove the student from the current queue
    currentQueue.students = currentQueue.students.filter(
      (student) => !student.studentId.equals(studentId)
    );
    await currentQueue.save();

    // Handle the next step queue 
    let nextQueue = await Queue.findOne({ step: nextStep, date: today });
    if (!nextQueue) {
      nextQueue = await Queue.create({ step: nextStep, date: today, students: [] });
    }

    const newQueueNumber = nextQueue.students.length + 1;

    // Add student details to the next queue, including the new queue number
    nextQueue.students.push({
      studentId: studentId,
      queueNumber: newQueueNumber,
      studentNumber: student.studentNumber,
      firstName: student.firstName,
      lastName: student.lastName,
      yearLevel: student.yearLevel,
      degreeProgram: student.degreeProgram,
      college: student.college,
    });

    await nextQueue.save();

    return res.status(200).json({
      message: `Student moved to "${nextStep}". Queue number: ${newQueueNumber}`,
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const completeStep = async (req, res) => {
  const { studentId, currentStep} = req.body;

  try {
    const today = new Date().toDateString();  

    // Find the current queue
    let currentQueue = await Queue.findOne({ step: currentStep, date: today });
    if (!currentQueue) {
      return res.status(404).json({ error: `Queue for step "${currentStep}" not found.` });
    }

    // Find the student in the current queue
    const student = currentQueue.students.find((student) =>
      student.studentId.equals(studentId)
    );
    if (!student) {
      return res.status(404).json({ error: "Student not found in the current queue." });
    }

    const updatedUser = await User.findByIdAndUpdate(
      studentId,
      console.log(studentId),
      {
        $set: {
          status: 'approved',
        },
        $push: {
          notifications: {
            message: `Annual PE Done.`,
            type: 'success',
            timestamp: new Date(),
            link: '/status',
            isRead: false
          }
        }
      },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found.' });
    }


    // Remove the student from the current queue
    currentQueue.students = currentQueue.students.filter(
      (student) => !student.studentId.equals(studentId)
    );
    
    await currentQueue.save();

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export const makeStudentPriority = async (req, res) => {
  const { studentId, currentStep } = req.body; // Accept studentId and step as inputs

  try {
    const today = new Date().toDateString();
    let queue = await Queue.findOne({ step: currentStep, date: today });

    if (!queue) {
      return res.status(404).json({ error: `Queue for step "${currentStep}" not found.` });
    }

    // Find the student in the current queue
    const studentIndex = queue.students.findIndex(student =>
      student.studentId.equals(studentId)
    );

    if (studentIndex === -1) {
      return res.status(404).json({ error: 'Student not found in the queue' });
    }

    // Update the student's priority to true
    queue.students[studentIndex].priority = true;

    // Move the student to the front of the queue (if they are made a priority)
    const student = queue.students.splice(studentIndex, 1)[0];
    queue.students.unshift(student);

    // Recalculate the queue numbers after updating
    queue.students.forEach((student, index) => {
      student.queueNumber = index + 1;
    });

    await queue.save();

    return res.status(200).json({ message: 'Student made priority', queueNumber: student.queueNumber });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};