const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const Staff = require("./models/login");
const Project = require("./models/project");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


/*
   --------------------------------------------------------------------------
   STAFF CRUD & AUTHENTICATION ROUTES
   ---------------------------------------------------------------------------   
   */

// 1. CREATE
app.post("/api/staff", async (req, res) => {
  try {
    const {
      staffId,
      password,
      staffName,
      phone,
      email,
      location,
      role,
      isAdmin,
    } = req.body;

    const existingStaff = await Staff.findOne({ staffId });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff ID already exists" });
    }

    const newStaff = new Staff({
      staffId,
      password,
      staffName,
      phone,
      email,
      location,
      role,
      isAdmin,
    });

    await newStaff.save();
    res
      .status(201)
      .json({ message: "Staff member created successfully", staff: newStaff });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create staff", error: error.message });
  }
});

// 2. READ ALL
app.get("/api/staff", async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password");
    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 3. READ ONE
app.get("/api/staff/:id", async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 4. UPDATE
app.put("/api/staff/:id", async (req, res) => {
  try {
    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    ).select("-password");

    if (!updatedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }

    res
      .status(200)
      .json({ message: "Staff updated successfully", staff: updatedStaff });
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
});

// 5. DELETE
app.delete("/api/staff/:id", async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

// 6. LOGIN
app.post("/api/staff/login", async (req, res) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res
        .status(400)
        .json({ message: "Please provide staffId and password" });
    }

    const staff = await Staff.findOne({ staffId });
    if (!staff) {
      return res.status(404).json({ message: "Invalid staff ID or password" });
    }

    if (!staff.isActive) {
      return res
        .status(403)
        .json({ message: "Account is inactive. Please contact your admin." });
    }

    if (staff.password !== password) {
      return res.status(401).json({ message: "Invalid staff ID or password" });
    }

    res.status(200).json({
      message: "Login successful",
      staff: {
        _id: staff._id,
        staffId: staff.staffId,
        staffName: staff.staffName,
        email: staff.email,
        role: staff.role,
        isAdmin: staff.isAdmin,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login error", error: error.message });
  }
}); 




/* 
   -------------------------------------------------------------------------
   PROJECT CRUD ROUTES
   --------------------------------------------------------------------------
    */

// 1. CREATE
app.post("/api/projects", async (req, res) => {
  try {
    const project = new Project(req.body);
    const savedProject = await project.save();
    res.status(201).json({
      message: "Project created successfully",
      project: savedProject,
    });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create project", error: error.message });
  }
});

// 2. READ ALL
app.get("/api/projects", async (req, res) => {
  try {
    const filter = {};
    if (req.query.staffId) {
      filter.staffId = req.query.staffId;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch projects", error: error.message });
  }
});

// 3. READ ONE
app.get("/api/projects/:id", async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// 4. UPDATE
app.put("/api/projects/:id", async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true },
    );

    if (!updatedProject) {
      return res.status(404).json({ message: "Project not found" });
    }

    res.status(200).json({
      message: "Project updated successfully",
      project: updatedProject,
    });
  } catch (error) {
    res.status(400).json({ message: "Update failed", error: error.message });
  }
});

// 5. DELETE
app.delete("/api/projects/:id", async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed", error: error.message });
  }
});

 
// Connect to Database and start Server safely
mongoose
  .connect("mongodb://127.0.0.1:27017/taskflow")
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });