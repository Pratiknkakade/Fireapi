/* eslint-disable max-len */
/* eslint-disable no-undef */
/* eslint-disable no-unused-vars */
/* eslint-disable quotes */
/* eslint-disable object-curly-spacing */
const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp({ databaseURL: "http://flutter-chedo.firebaseio.com" });

const express = require("express");
const cors = require("cors");
const { error } = require("firebase-functions/logger");
const pratik = express();
pratik.use(cors({ origin: true }));
const db = admin.firestore();

// Routes
pratik.get("/", (req, res) => {
  return res.status(200).send("Hellow there");
});

pratik.get("/home", (req, res) => {
  return res.status(200).send("welcome to home");
});


pratik.post("/api/addstuddent", (req, res) => {
  (async () => {
    try {
      const { name, roll, phy, chem, math } = req.body;
      const total = phy + chem + math;
      const percentage = total / 3;
      let garde;

      if (percentage >= 90) {
        garde = 'A';
      } else if (percentage >= 80) {
        garde = 'B';
      } else if (percentage >= 70) {
        garde = 'C';
      } else if (percentage >= 60) {
        garde = 'D';
      } else {
        garde = 'F';
      }
      await db.collection("pratik").doc().set({
        name,
        roll,
        phy,
        chem,
        math,
        total,
        percentage,
        garde,
      });
      return res.status(200).send({ status: "success", msg: "student Data Saved" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", msg: error });
    }
  })();
});

pratik.post("/api/updatestuddent", (req, res) => {
  (async () => {
    try {
      const { id, name, roll, phy, chem, math } = req.body;
      const total = phy + chem + math;
      const percentage = total / 3;
      let garde;

      if (percentage >= 90) {
        garde = 'A';
      } else if (percentage >= 80) {
        garde = 'B';
      } else if (percentage >= 70) {
        garde = 'C';
      } else if (percentage >= 60) {
        garde = 'D';
      } else {
        garde = 'F';
      }
      await db.collection("pratik").doc(id).set({
        name,
        roll,
        phy,
        chem,
        math,
        total,
        percentage,
        garde,
      });
      return res.status(200).send({ status: "success", msg: "student Data Saved" });
    } catch (error) {
      console.log(error);
      res.status(500).send({ status: "failed", msg: error });
    }
  })();
});

pratik.post("/api/deletestudent/", async (req, res) => {
  try {
    const { id } = req.body;
    db.collection('pratik').doc(id).delete();
    return res.status(200).send({ status: "success", msg: "student Data Saved" });
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", msg: error });
  }
});

pratik.get("/api/getallstudent/", async (req, res) => {
  try {
    const studentQuerySnapshot = await db.collection('pratik').get();
    const students = [];

    studentQuerySnapshot.forEach((doc) => {
      // Include both data and document ID
      students.push({ id: doc.id, ...doc.data() });
    });

    return res.status(200).json(students);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", msg: error });
  }
});


pratik.get("/api/passedstudents", async (req, res) => {
  try {
    const snapshot = await db.collection("pratik").where("total", ">", 100).get();

    const passedStudents = [];
    snapshot.forEach((doc) => {
      passedStudents.push(doc.data());
    });

    return res.status(200).json(passedStudents);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", msg: error.message });
  }
});


pratik.get("/api/passedstudents", async (req, res) => {
  try {
    const snapshot = await db.collection("pratik").where("total", ">", 100).get();

    const passedStudents = [];
    snapshot.forEach((doc) => {
      passedStudents.push(doc.data());
    });

    return res.status(200).json(passedStudents);
  } catch (error) {
    console.log(error);
    res.status(500).send({ status: "failed", msg: error.message });
  }
});

pratik.get("/api/topper", async (req, res) => {
  try {
    const snapshot = await db.collection("pratik").get();
    let topperStudent = null;
    let maxTotal = 0;
    snapshot.forEach((doc) => {
      const studentData = doc.data();
      if (studentData.total > maxTotal) {
        maxTotal = studentData.total;
        topperStudent = studentData;
      }
    });
    return res.status(200).json(topperStudent);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", msg: error.message });
  }
});

pratik.get("/api/gettopper", async (req, res) => {
  try {
    const snapshot = await db.collection("pratik").orderBy("total", "desc").limit(1).get();

    let topperStudent = null;

    snapshot.forEach((doc) => {
      topperStudent = doc.data();
    });

    return res.status(200).json(topperStudent);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", msg: error.message });
  }
});

pratik.get("/api/getfailstudents", async (req, res) => {
  try {
    const snapshot = await db.collection("pratik").where("phy", "<", 20).get();

    const failStudents = [];
    snapshot.forEach((doc) => {
      const studentData = doc.data();
      failStudents.push(studentData);
    });

    return res.status(200).json(failStudents);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", msg: error.message });
  }
});

pratik.get("/api/failstudents", async (req, res) => {
  try {
    const snapshot = await db.collection("pratik").where("phy", "<", 20).get();

    const snapshotChem = await db.collection("pratik").where("chem", "<", 20).get();

    const snapshotMath = await db.collection("pratik").where("math", "<", 20).get();

    const failStudents = [];


    // Combine the results from all three subjects
    snapshot.forEach((doc) => {
      const studentData = doc.data();
      failStudents.push(studentData);
    });

    snapshotChem.forEach((doc) => {
      const studentData = doc.data();
      if (!failStudents.some((student) => student.roll === studentData.roll)) {
        failStudents.push(studentData);
      }
    });

    snapshotMath.forEach((doc) => {
      const studentData = doc.data();
      if (!failStudents.some((student) => student.roll === studentData.roll)) {
        failStudents.push(studentData);
      }
    });

    return res.status(200).json(failStudents);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", msg: error.message });
  }
});

pratik.get("/api/topstudents", async (req, res) => {
  try {
    const snapshot = await db.collection("pratik").orderBy("phy", "desc").limit(1).get();

    const snapshotChem = await db.collection("pratik").orderBy("chem", "desc").limit(1).get();

    const snapshotMath = await db.collection("pratik").orderBy("math", "desc").limit(1).get();

    const topStudents = [];

    snapshot.forEach((doc) => {
      const studentData = doc.data();
      topStudents.push(studentData, "phy");
    });

    snapshotChem.forEach((doc) => {
      const studentData = doc.data();
      if (!topStudents.some((student) => student.roll === studentData.roll)) {
        topStudents.push(studentData, "chem");
      }
    });

    snapshotMath.forEach((doc) => {
      const studentData = doc.data();
      if (!topStudents.some((student) => student.roll === studentData.roll)) {
        topStudents.push(studentData, "math");
      }
    });

    return res.status(200).json(topStudents);
  } catch (error) {
    console.error(error);
    res.status(500).send({ status: "failed", msg: error.message });
  }
});

exports.pratik = functions.https.onRequest(pratik);
