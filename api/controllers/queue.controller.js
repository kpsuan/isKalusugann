import Queue from '../models/queue.model.js'; // Import your Queue model
import mongoose from 'mongoose';
import User from '../models/user.model.js';


export const addToQueue = async (req, res) => {
  const { studentId, studentNumber, firstName, lastName, isGeneral, isDental, college, yearLevel, degreeProgram, step, isPriority } = req.body;
  const today = new Date().toDateString();

  try {
    let queue = await Queue.findOne({ step, date: today });

    if (!queue) {
      queue = await Queue.create({ step, date: today, students: [] });
    }

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
      isGeneral,
      isDental,
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
  const { step, studentId } = req.query; // Optionally filter by step and studentId

  try {
    // Construct the query to filter by step or date
    const query = step ? { step, date: today } : { date: today };

    // Find the queue for today
    const queue = await Queue.findOne(query);

    if (!queue) {
      return res.status(404).json({ error: 'No queue found for today.' });
    }

    if (studentId) {
      // If studentId is provided, find the specific student
      const student = queue.students.find(student => String(student.studentId) === String(studentId));

      if (!student) {
        return res.status(404).json({ error: 'Student not found in the queue.' });
      }

      return res.json({ student });
    } else {
      // Return all students if no studentId is provided
      return res.json({ students: queue.students });
    }

  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};




export const moveToNextStep = async (req, res) => {
    const { studentId, currentStep, nextStep } = req.body;
  
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
  
      if (currentStep === "General PE") {
        const updatedUser =  await User.updateOne(
          { _id: studentId },  
          {
            $set: {
              isGeneral: true,
            },
          },
          { new: true }
        );
    
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found.' });
        }
      } 
      
      
      else if (currentStep === "Dental") {
        const updatedUser =  await User.updateOne(
          { _id: studentId },  
          {
            $set: {
              isDental: true,
            },
          },
          { new: true }
        );
    
        if (!updatedUser) {
          return res.status(404).json({ error: 'User not found.' });
        }
      } 
  
      // Remove the student from the current queue
      currentQueue.students = currentQueue.students.filter(
        (s) => !s.studentId.equals(studentId)
      );
  
      await currentQueue.save(); 
  
      // Handle the next step queue
      let nextQueue = await Queue.findOne({ step: nextStep, date: today });
      if (!nextQueue) {
        nextQueue = await Queue.create({ step: nextStep, date: today, students: [] });
      }
  
      const newQueueNumber = nextQueue.students.length + 1;
  
      nextQueue.students.push({
        studentId: studentId,
        queueNumber: newQueueNumber,
        studentNumber: student.studentNumber,
        firstName: student.firstName,
        lastName: student.lastName,
        yearLevel: student.yearLevel,
        degreeProgram: student.degreeProgram,
        college: student.college,
        isGeneral: student.isGeneral,
        isDental: student.isDental,
        isDoctor: student.isDoctor,
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

    const updatedUser =  await User.updateOne(
      { _id: studentId },  
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

export const getQueueSummary = async (req, res) => {
  const today = new Date().toDateString(); // Get today's date as a string

  try {
    // Find all queue records for today
    const queues = await Queue.find({ date: today });

    if (!queues.length) {
      return res.status(404).json({ error: 'No queue found for today.' });
    }

    // Compute the total number of students queued
    let totalUsers = 0;
    const stepCounts = {
      "General PE": 0,
      "Dental": 0,
      "Doctor": 0
    };

    queues.forEach(queue => {
      totalUsers += queue.students.length; // Count all students in this step

      if (stepCounts.hasOwnProperty(queue.step)) {
        stepCounts[queue.step] += queue.students.length;
      }
    });

    return res.json({ totalUsers, stepCounts });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};
