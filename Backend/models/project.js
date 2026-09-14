const mongoose = require("mongoose");

const projectSchema = new mongoose.Schema(
  {
    staffId: {
      type: String,
      required: true,
    },
    projectName: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Description is required"],
      trim: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: true,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: [0, "Completion percentage cannot be less than 0"],
      max: [100, "Completion percentage cannot exceed 100"],
    },
    status: {
      type: String,
      enum: ["Not Started", "In Progress", "Completed", "On Hold"],
      default: "Not Started",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
  },
  {
    timestamps: true,
  },
);

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
