require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const Staff = require("./models/login");
const Project = require("./models/project");

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET;

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
  }),
);
app.use(express.json({ limit: "10kb" }));
app.use(mongoSanitize());

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many login attempts. Please try again later." },
});

// ---- Auth middleware ----
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authentication required" });
  }
  const token = authHeader.split(" ")[1];
  try {
    req.user = jwt.verify(token, JWT_SECRET);
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

function requireAdmin(req, res, next) {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

/*
   --------------------------------------------------------------------------
   STAFF CRUD & AUTHENTICATION ROUTES
   ---------------------------------------------------------------------------
   */

// 1. CREATE (admin only)
app.post("/api/staff", authenticate, requireAdmin, async (req, res) => {
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

    if (!staffId || !password) {
      return res
        .status(400)
        .json({ message: "staffId and password are required" });
    }

    const existingStaff = await Staff.findOne({ staffId });
    if (existingStaff) {
      return res.status(400).json({ message: "Staff ID already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newStaff = new Staff({
      staffId,
      password: hashedPassword,
      staffName,
      phone,
      email,
      location,
      role,
      isAdmin,
    });

    await newStaff.save();
    const staffObj = newStaff.toObject();
    delete staffObj.password;

    res
      .status(201)
      .json({ message: "Staff member created successfully", staff: staffObj });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Failed to create staff", error: error.message });
  }
});

// 2. READ ALL (authenticated)
app.get("/api/staff", authenticate, async (req, res) => {
  try {
    const staffList = await Staff.find().select("-password");
    res.status(200).json(staffList);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 3. READ ONE (authenticated)
app.get("/api/staff/:id", authenticate, async (req, res) => {
  try {
    const staff = await Staff.findById(req.params.id).select("-password");
    if (!staff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json(staff);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. UPDATE (admin only)
app.put("/api/staff/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const updateData = { ...req.body };

    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 12);
    }

    const updatedStaff = await Staff.findByIdAndUpdate(
      req.params.id,
      updateData,
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

// 5. DELETE (admin only)
app.delete("/api/staff/:id", authenticate, requireAdmin, async (req, res) => {
  try {
    const deletedStaff = await Staff.findByIdAndDelete(req.params.id);
    if (!deletedStaff) {
      return res.status(404).json({ message: "Staff member not found" });
    }
    res.status(200).json({ message: "Staff member deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// 6. LOGIN (rate limited)
app.post("/api/staff/login", loginLimiter, async (req, res) => {
  try {
    const { staffId, password } = req.body;

    if (!staffId || !password) {
      return res
        .status(400)
        .json({ message: "Please provide staffId and password" });
    }

    const staff = await Staff.findOne({ staffId });
    if (!staff) {
      return res.status(401).json({ message: "Invalid staff ID or password" });
    }

    if (!staff.isActive) {
      return res
        .status(403)
        .json({ message: "Account is inactive. Please contact your admin." });
    }

    const isMatch = await bcrypt.compare(password, staff.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid staff ID or password" });
    }

    const token = jwt.sign(
      {
        id: staff._id,
        staffId: staff.staffId,
        isAdmin: staff.isAdmin,
        role: staff.role,
      },
      JWT_SECRET,
      { expiresIn: "8h" },
    );

    res.status(200).json({
      message: "Login successful",
      token,
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
    res.status(500).json({ message: "Login error" });
  }
});

/*
   -------------------------------------------------------------------------
   PROJECT CRUD ROUTES
   --------------------------------------------------------------------------
    */

// 1. CREATE (authenticated)
app.post("/api/projects", authenticate, async (req, res) => {
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

// 2. READ ALL (authenticated)
app.get("/api/projects", authenticate, async (req, res) => {
  try {
    const filter = {};
    if (req.query.staffId) {
      filter.staffId = req.query.staffId;
    }

    const projects = await Project.find(filter).sort({ createdAt: -1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch projects" });
  }
});

// 3. READ ONE (authenticated)
app.get("/api/projects/:id", authenticate, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json(project);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

// 4. UPDATE (authenticated)
app.put("/api/projects/:id", authenticate, async (req, res) => {
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

// 5. DELETE (authenticated)
app.delete("/api/projects/:id", authenticate, async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ message: "Project not found" });
    }
    res.status(200).json({ message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
});

// Connect to Database and start Server safely
mongoose
    .connect(process.env.MONGODB_URL)
  .then(() => {
    console.log("MongoDB connected successfully");
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });
