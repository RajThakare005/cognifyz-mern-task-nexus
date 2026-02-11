import { addSubmission, getSubmissions } from "../services/tempStorage.js";

export const renderHome = (_req, res) => {
  res.render("index", {
    title: "Cognifyz Internship Form Tasks",
    submissions: getSubmissions(),
    errors: [],
    values: {},
  });
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateForm = ({ name, email, password, age, role }) => {
  const errors = [];

  if (!name || name.trim().length < 2) errors.push("Name must be at least 2 characters.");
  if (!emailRegex.test(String(email || ""))) errors.push("Valid email is required.");

  const pwd = String(password || "");
  const strong = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  if (!strong.test(pwd)) {
    errors.push("Password must be 8+ chars and include upper, lower, number, and symbol.");
  }

  const ageNum = Number(age);
  if (!Number.isFinite(ageNum) || ageNum < 18 || ageNum > 80) {
    errors.push("Age must be between 18 and 80.");
  }

  if (!["frontend", "backend", "fullstack"].includes(role)) {
    errors.push("Role must be frontend, backend, or fullstack.");
  }

  return errors;
};

export const submitForm = (req, res) => {
  const values = {
    name: req.body.name || "",
    email: req.body.email || "",
    password: req.body.password || "",
    age: req.body.age || "",
    role: req.body.role || "frontend",
    notes: req.body.notes || "",
  };

  const errors = validateForm(values);

  if (errors.length) {
    return res.status(400).render("index", {
      title: "Cognifyz Internship Form Tasks",
      submissions: getSubmissions(),
      errors,
      values,
    });
  }

  addSubmission({
    name: values.name,
    email: values.email,
    age: Number(values.age),
    role: values.role,
    notes: values.notes,
  });

  res.redirect("/");
};
