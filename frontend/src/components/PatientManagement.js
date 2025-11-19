import React, { useState, useEffect } from 'react';
import { getPatients, createPatient, updatePatient, deletePatient } from '../services/api';
import './PatientManagement.css';

const PatientManagement = ({ user }) => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingPatient, setEditingPatient] = useState(null);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: 'Male',
    medicalRecordNumber: '',
    bloodType: 'O+',
    allergies: '',
    chronicConditions: '',
    department: 'General'
  });

  useEffect(() => {
    loadPatients();
  }, []);

  const loadPatients = async () => {
    try {
      setLoading(true);
      const data = await getPatients();
      setPatients(data.patients || []);
    } catch (error) {
      showMessage('error', 'Failed to load patients');
      console.error('Error loading patients:', error);
    } finally {
      setLoading(false);
    }
  };

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage({ type: '', text: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData({
      name: '',
      age: '',
      gender: 'Male',
      medicalRecordNumber: '',
      bloodType: 'O+',
      allergies: '',
      chronicConditions: '',
      department: 'General'
    });
    setEditingPatient(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const patientData = {
        ...formData,
        age: parseInt(formData.age),
        allergies: formData.allergies ? formData.allergies.split(',').map(a => a.trim()) : [],
        chronicConditions: formData.chronicConditions ? formData.chronicConditions.split(',').map(c => c.trim()) : []
      };

      if (editingPatient) {
        await updatePatient(editingPatient.id, patientData);
        showMessage('success', 'Patient updated successfully');
      } else {
        await createPatient(patientData);
        showMessage('success', 'Patient created successfully');
      }

      resetForm();
      loadPatients();
    } catch (error) {
      showMessage('error', error.response?.data?.error || 'Failed to save patient');
    }
  };

  const handleEdit = (patient) => {
    setFormData({
      name: patient.name,
      age: patient.age.toString(),
      gender: patient.gender,
      medicalRecordNumber: patient.medicalRecordNumber,
      bloodType: patient.bloodType,
      allergies: patient.allergies.join(', '),
      chronicConditions: patient.chronicConditions.join(', '),
      department: patient.department
    });
    setEditingPatient(patient);
    setShowForm(true);
  };

  const handleDelete = async (patientId) => {
    if (!window.confirm('Are you sure you want to delete this patient?')) {
      return;
    }

    try {
      await deletePatient(patientId);
      showMessage('success', 'Patient deleted successfully');
      loadPatients();
    } catch (error) {
      showMessage('error', 'Failed to delete patient');
    }
  };

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.medicalRecordNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return <div className="loading">Loading patients...</div>;
  }

  return (
    <div className="patient-management">
      <div className="page-header">
        <h2>Patient Management</h2>
        <button 
          className="btn btn-primary" 
          onClick={() => setShowForm(!showForm)}
        >
          {showForm ? 'Cancel' : '+ Add Patient'}
        </button>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type}`}>
          {message.text}
        </div>
      )}

      {showForm && (
        <div className="card">
          <h3>{editingPatient ? 'Edit Patient' : 'Add New Patient'}</h3>
          <form onSubmit={handleSubmit} className="patient-form">
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Age *</label>
                <input
                  type="number"
                  name="age"
                  value={formData.age}
                  onChange={handleInputChange}
                  required
                  min="0"
                  max="150"
                />
              </div>

              <div className="form-group">
                <label>Gender</label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleInputChange}
                >
                  <option>Male</option>
                  <option>Female</option>
                  <option>Other</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Medical Record Number *</label>
                <input
                  type="text"
                  name="medicalRecordNumber"
                  value={formData.medicalRecordNumber}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label>Blood Type</label>
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleInputChange}
                >
                  <option>O+</option>
                  <option>O-</option>
                  <option>A+</option>
                  <option>A-</option>
                  <option>B+</option>
                  <option>B-</option>
                  <option>AB+</option>
                  <option>AB-</option>
                </select>
              </div>

              <div className="form-group">
                <label>Department</label>
                <select
                  name="department"
                  value={formData.department}
                  onChange={handleInputChange}
                >
                  <option>General</option>
                  <option>Cardiology</option>
                  <option>Emergency</option>
                  <option>Pediatrics</option>
                  <option>Orthopedics</option>
                  <option>Neurology</option>
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Allergies (comma-separated)</label>
              <input
                type="text"
                name="allergies"
                value={formData.allergies}
                onChange={handleInputChange}
                placeholder="e.g., Penicillin, Latex"
              />
            </div>

            <div className="form-group">
              <label>Chronic Conditions (comma-separated)</label>
              <input
                type="text"
                name="chronicConditions"
                value={formData.chronicConditions}
                onChange={handleInputChange}
                placeholder="e.g., Hypertension, Diabetes"
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                {editingPatient ? 'Update Patient' : 'Create Patient'}
              </button>
              <button type="button" className="btn btn-secondary" onClick={resetForm}>
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="card">
        <div className="table-header">
          <h3>Patient List ({filteredPatients.length})</h3>
          <input
            type="text"
            className="search-input"
            placeholder="Search by name, MRN, or department..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {filteredPatients.length === 0 ? (
          <p className="no-data">No patients found</p>
        ) : (
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>MRN</th>
                  <th>Age</th>
                  <th>Gender</th>
                  <th>Blood Type</th>
                  <th>Department</th>
                  <th>Allergies</th>
                  <th>Conditions</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredPatients.map(patient => (
                  <tr key={patient.id}>
                    <td><strong>{patient.name}</strong></td>
                    <td>{patient.medicalRecordNumber}</td>
                    <td>{patient.age}</td>
                    <td>{patient.gender}</td>
                    <td>{patient.bloodType}</td>
                    <td>{patient.department}</td>
                    <td>{patient.allergies.join(', ') || 'None'}</td>
                    <td>{patient.chronicConditions.join(', ') || 'None'}</td>
                    <td className="action-buttons">
                      <button 
                        className="btn btn-sm btn-primary" 
                        onClick={() => handleEdit(patient)}
                      >
                        Edit
                      </button>
                      <button 
                        className="btn btn-sm btn-danger" 
                        onClick={() => handleDelete(patient.id)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientManagement;