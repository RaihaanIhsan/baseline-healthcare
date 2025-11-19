const express = require('express');
const router = express.Router();
const { 
  listPatients, 
  findPatientById, 
  createPatient, 
  updatePatientByIndex, 
  deletePatientByIndex 
} = require('../models/patient');

// Get all patients - NO RESTRICTIONS
router.get('/', (req, res) => {
  const patients = listPatients();
  res.json({
    patients,
    count: patients.length
  });
});

// Get patient by ID - NO RESTRICTIONS
router.get('/:id', (req, res) => {
  const patient = findPatientById(req.params.id);
  
  if (!patient) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  res.json({ patient });
});

// Create patient - NO RESTRICTIONS
router.post('/', (req, res) => {
  const { name, age, gender, medicalRecordNumber, bloodType, allergies, chronicConditions, department } = req.body;
  
  if (!name || !age || !medicalRecordNumber) {
    return res.status(400).json({ 
      error: 'Name, age, and medical record number are required'
    });
  }

  const patients = listPatients();
  const newPatient = {
    id: (patients.length + 1).toString(),
    name,
    age,
    gender,
    medicalRecordNumber,
    bloodType,
    allergies: allergies || [],
    chronicConditions: chronicConditions || [],
    department: department || 'General',
    createdAt: new Date().toISOString()
  };

  createPatient(newPatient);

  res.status(201).json({
    patient: newPatient,
    message: 'Patient created successfully'
  });
});

// Update patient - NO RESTRICTIONS
router.put('/:id', (req, res) => {
  const patients = listPatients();
  const patientIndex = patients.findIndex(p => p.id === req.params.id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  const updatedPatient = {
    ...patients[patientIndex],
    ...req.body,
    updatedAt: new Date().toISOString()
  };

  updatePatientByIndex(patientIndex, updatedPatient);

  res.json({
    patient: updatedPatient,
    message: 'Patient updated successfully'
  });
});

// Delete patient - NO RESTRICTIONS
router.delete('/:id', (req, res) => {
  const patients = listPatients();
  const patientIndex = patients.findIndex(p => p.id === req.params.id);
  
  if (patientIndex === -1) {
    return res.status(404).json({ error: 'Patient not found' });
  }

  deletePatientByIndex(patientIndex);

  res.json({ message: 'Patient deleted successfully' });
});

module.exports = router;