/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

export interface DemoResponse { message: string }

export interface MedicalHistory {
  bloodGroup: string;
  conditions: string[];
  allergies: string[];
  medications: string[];
}

export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string; // ISO date string or human readable
  address: string;
  medical: MedicalHistory;
}

export interface Centre {
  id: string;
  name: string;
  address: string;
  location: { lat: number; lng: number };
  rating?: number;
  user_ratings_total?: number;
  phone?: string;
  website?: string;
}

export interface Appointment {
  id: string;
  patientId: string;
  centre: Centre;
  slotISO: string; // ISO date time
}
