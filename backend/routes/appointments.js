const express = require('express');
const router = express.Router();
const { 
  listAppointments, 
  findAppointmentById, 
  createAppointment, 
  updateAppointmentByIndex, 
  deleteAppointmentByIndex 
} = require('../models/appointment');
const { findPatientById } = require('../models/patient');

// Get all appointments - NO RESTRICTIONS
router.get('/', (req, res) => {
  const appointments = listAppointments();
  res.json({
    appointments,
    count: appointments.length
  });
});

// Get appointment by ID - NO RESTRICTIONS
router.get('/:id', (req, res) => {
  const appointment = findAppointmentById(req.params.id);
  
  if (!appointment) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  res.json({ appointment });
});

// Create appointment - NO RESTRICTIONS
router.post('/', (req, res) => {
  const { patientId, patientName, doctorId, doctorName, date, time, type, notes } = req.body;
  
  if (!patientId || !date || !time || !type) {
    return res.status(400).json({ 
      error: 'Patient ID, date, time, and type are required'
    });
  }

  const patient = findPatientById(patientId);
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const appointments = listAppointments();
  const newAppointment = {
    id: (appointments.length + 1).toString(),
    patientId,
    patientName: patientName || patient.name,
    department: patient.department,
    doctorId: doctorId || 'N/A',
    doctorName: doctorName || 'Dr. Unknown',
    date,
    time,
    type,
    status: 'Scheduled',
    notes: notes || '',
    createdAt: new Date().toISOString()
  };

  createAppointment(newAppointment);

  res.status(201).json({
    appointment: newAppointment,
    message: 'Appointment created successfully'
  });
});

// Update appointment - NO RESTRICTIONS
router.put('/:id', (req, res) => {
  const appointments = listAppointments();
  const appointmentIndex = appointments.findIndex(a => a.id === req.params.id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  const updatedAppointment = {
    ...appointments[appointmentIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  updateAppointmentByIndex(appointmentIndex, updatedAppointment);

  res.json({
    appointment: updatedAppointment,
    message: 'Appointment updated successfully'
  });
});

// Delete appointment - NO RESTRICTIONS
router.delete('/:id', (req, res) => {
  const appointments = listAppointments();
  const appointmentIndex = appointments.findIndex(a => a.id === req.params.id);
  
  if (appointmentIndex === -1) {
    return res.status(404).json({ error: 'Appointment not found' });
  }

  deleteAppointmentByIndex(appointmentIndex);

  res.json({ message: 'Appointment deleted successfully' });
});

module.exports = router;