import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import type { Appointment, Patient } from "@shared/api";

// In-memory store for demo purposes
const appointments: Appointment[] = [];

const samplePatient: Patient = {
  id: "patient-001",
  firstName: "Anaya",
  lastName: "Sharma",
  email: "anaya.sharma@example.com",
  phone: "+91 98765 43210",
  dob: "1994-08-22",
  address: "Bandra West, Mumbai, Maharashtra, India",
  medical: {
    bloodGroup: "B+",
    conditions: ["Migraine", "Hypothyroidism"],
    allergies: ["Penicillin"],
    medications: ["Levothyroxine 50mcg"],
  },
};

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // Patient profile
  app.get("/api/patient", (_req, res) => {
    res.json(samplePatient);
  });

  // Appointments
  app.get("/api/appointments", (_req, res) => {
    res.json(appointments.sort((a, b) => (a.slotISO < b.slotISO ? 1 : -1)));
  });

  app.post("/api/appointments", (req, res) => {
    const { centre, patientId, slotISO } = req.body as Appointment;
    if (!centre || !patientId || !slotISO) {
      res.status(400).json({ error: "centre, patientId and slotISO are required" });
      return;
    }
    const appt: Appointment = {
      id: `appt_${Date.now()}`,
      centre,
      patientId,
      slotISO,
    };
    appointments.push(appt);
    res.json(appt);
  });

  return app;
}
