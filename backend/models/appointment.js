// In-memory appointment store
const appointments = [
    {
      id: '1',
      patientId: '1',
      patientName: 'John Doe',
      department: 'Cardiology',
      doctorId: '2',
      doctorName: 'Dr. Smith',
      date: '2024-12-15',
      time: '10:00 AM',
      type: 'Consultation',
      status: 'Scheduled',
      notes: 'Regular checkup',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      patientId: '2',
      patientName: 'Jane Smith',
      department: 'Emergency',
      doctorId: '2',
      doctorName: 'Dr. Smith',
      date: '2024-12-16',
      time: '2:00 PM',
      type: 'Follow-up',
      status: 'Scheduled',
      notes: 'Post-surgery follow-up',
      createdAt: new Date().toISOString()
    }
  ];
  
  function listAppointments() {
    return appointments;
  }
  
  function findAppointmentById(id) {
    return appointments.find(a => a.id === id) || null;
  }
  
  function createAppointment(appointment) {
    appointments.push(appointment);
    return appointment;
  }
  
  function updateAppointmentByIndex(index, updated) {
    appointments[index] = updated;
    return updated;
  }
  
  function deleteAppointmentByIndex(index) {
    appointments.splice(index, 1);
  }
  
  module.exports = {
    appointments,
    listAppointments,
    findAppointmentById,
    createAppointment,
    updateAppointmentByIndex,
    deleteAppointmentByIndex
  };