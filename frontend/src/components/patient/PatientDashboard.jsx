import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useApi, useMutation } from '../../hooks/useApi';
import { appointmentService } from '../../services/appointmentService';
import { authService } from '../../services/authService';

const PatientDashboard = () => {
  const { user, logout, isPatient } = useAuth();
  const [selectedTab, setSelectedTab] = useState('overview');

  // Fetch patient's appointments
  const {
    data: appointments,
    loading: appointmentsLoading,
    error: appointmentsError,
    refresh: refreshAppointments,
  } = useApi(
    () => appointmentService.getPatientAppointments(),
    [],
    {
      onSuccess: (result) => {
        console.log('Appointments loaded:', result);
      },
      onError: (error) => {
        console.error('Failed to load appointments:', error);
      },
    }
  );

  // Fetch doctors list
  const {
    data: doctors,
    loading: doctorsLoading,
    error: doctorsError,
  } = useApi(
    () => authService.getAllDoctors(),
    [],
    { cacheDuration: 10 * 60 * 1000 } // Cache for 10 minutes
  );

  // Create appointment mutation
  const {
    execute: createAppointment,
    loading: creatingAppointment,
    error: createAppointmentError,
  } = useMutation(appointmentService.createAppointment, {
    onSuccess: (result) => {
      console.log('Appointment created:', result);
      refreshAppointments(); // Refresh the appointments list
      setShowAppointmentForm(false);
    },
    onError: (error) => {
      console.error('Failed to create appointment:', error);
    },
  });

  // Logout mutation
  const { execute: handleLogout, loading: loggingOut } = useMutation(logout, {
    onSuccess: () => {
      // Navigation will be handled by AuthContext
    },
  });

  // Form state
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [appointmentForm, setAppointmentForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: user?.phone || '',
    nic: user?.nic || '',
    dob: user?.dob ? user.dob.split('T')[0] : '', // Format date for input
    gender: user?.gender || '',
    appointmentDate: '',
    department: '',
    doctorFirstName: '',
    doctorLastName: '',
    hasVisited: false,
    address: user?.address || '',
  });

  // Handle appointment form submission
  const handleAppointmentSubmit = async (e) => {
    e.preventDefault();
    
    try {
      await createAppointment(appointmentForm);
    } catch (error) {
      // Error handled by mutation hook
    }
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAppointmentForm(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // Handle doctor selection
  const handleDoctorSelect = (doctorName) => {
    const [firstName, lastName] = doctorName.split(' ');
    setAppointmentForm(prev => ({
      ...prev,
      doctorFirstName: firstName || '',
      doctorLastName: lastName || '',
    }));
  };

  if (!isPatient()) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-red-500 mt-2">This page is only accessible to patients.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Patient Dashboard</h1>
              <p className="text-gray-600">Welcome back, {user?.firstName} {user?.lastName}</p>
            </div>
            <button
              onClick={() => handleLogout()}
              disabled={loggingOut}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {loggingOut ? 'Logging out...' : 'Logout'}
            </button>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {['overview', 'appointments', 'doctors', 'profile'].map((tab) => (
              <button
                key={tab}
                onClick={() => setSelectedTab(tab)}
                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                  selectedTab === tab
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          
          {/* Overview Tab */}
          {selectedTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Quick Stats */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Total Appointments</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {appointmentsLoading ? '...' : appointments?.appointments?.length || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 16c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0zm6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <dl>
                        <dt className="text-sm font-medium text-gray-500 truncate">Available Doctors</dt>
                        <dd className="text-lg font-medium text-gray-900">
                          {doctorsLoading ? '...' : doctors?.doctors?.length || 0}
                        </dd>
                      </dl>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="p-5">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <button
                      onClick={() => setShowAppointmentForm(true)}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Book Appointment
                    </button>
                    <button
                      onClick={() => setSelectedTab('appointments')}
                      className="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      View Appointments
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Appointments Tab */}
          {selectedTab === 'appointments' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Your Appointments</h3>
                <button
                  onClick={() => setShowAppointmentForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                >
                  Book New Appointment
                </button>
              </div>
              
              {appointmentsLoading ? (
                <div className="p-4 text-center">Loading appointments...</div>
              ) : appointmentsError ? (
                <div className="p-4 text-center text-red-600">
                  Error: {appointmentsError.message}
                </div>
              ) : appointments?.appointments?.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No appointments found. Book your first appointment!
                </div>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {appointments?.appointments?.map((appointment) => (
                    <li key={appointment._id} className="px-4 py-4 sm:px-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center">
                          <div className="ml-4">
                            <p className="text-sm font-medium text-gray-900">
                              Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                            </p>
                            <p className="text-sm text-gray-500">{appointment.department}</p>
                            <p className="text-sm text-gray-500">
                              {new Date(appointment.appointment_date).toLocaleDateString()} at{' '}
                              {new Date(appointment.appointment_date).toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            appointment.status === 'Pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : appointment.status === 'Accepted'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {appointment.status}
                          </span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* Doctors Tab */}
          {selectedTab === 'doctors' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-md">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Available Doctors</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Browse our medical professionals and book appointments.
                </p>
              </div>
              
              {doctorsLoading ? (
                <div className="p-4 text-center">Loading doctors...</div>
              ) : doctorsError ? (
                <div className="p-4 text-center text-red-600">
                  Error: {doctorsError.message}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                  {doctors?.doctors?.map((doctor) => (
                    <div key={doctor._id} className="bg-gray-50 rounded-lg p-6">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                          <span className="text-blue-600 font-semibold text-lg">
                            {doctor.firstName[0]}{doctor.lastName[0]}
                          </span>
                        </div>
                        <h4 className="text-lg font-medium text-gray-900">
                          Dr. {doctor.firstName} {doctor.lastName}
                        </h4>
                        <p className="text-sm text-gray-500">{doctor.doctorDepartment}</p>
                        <p className="text-sm text-gray-500 mt-1">{doctor.email}</p>
                        <button
                          onClick={() => {
                            handleDoctorSelect(`${doctor.firstName} ${doctor.lastName}`);
                            setAppointmentForm(prev => ({
                              ...prev,
                              department: doctor.doctorDepartment,
                            }));
                            setShowAppointmentForm(true);
                          }}
                          className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
                        >
                          Book Appointment
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Profile Tab */}
          {selectedTab === 'profile' && (
            <div className="bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:px-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                  Your personal details and contact information.
                </p>
              </div>
              <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                <dl className="sm:divide-y sm:divide-gray-200">
                  {[
                    ['Full Name', `${user?.firstName} ${user?.lastName}`],
                    ['Email Address', user?.email],
                    ['Phone Number', user?.phone],
                    ['NIC', user?.nic],
                    ['Date of Birth', user?.dob ? new Date(user.dob).toLocaleDateString() : 'Not provided'],
                    ['Gender', user?.gender],
                    ['Role', user?.role],
                  ].map(([label, value]) => (
                    <div key={label} className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                      <dt className="text-sm font-medium text-gray-500">{label}</dt>
                      <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                        {value || 'Not provided'}
                      </dd>
                    </div>
                  ))}
                </dl>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Appointment Form Modal */}
      {showAppointmentForm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 md:w-3/4 lg:w-1/2 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">Book New Appointment</h3>
                <button
                  onClick={() => setShowAppointmentForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              {createAppointmentError && (
                <div className="mb-4 bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-md">
                  <p className="text-sm">{createAppointmentError.message}</p>
                </div>
              )}

              <form onSubmit={handleAppointmentSubmit} className="space-y-4">
                {/* Form fields here - showing a few key ones */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Department</label>
                    <select
                      name="department"
                      value={appointmentForm.department}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    >
                      <option value="">Select Department</option>
                      <option value="Cardiology">Cardiology</option>
                      <option value="Neurology">Neurology</option>
                      <option value="Orthopedics">Orthopedics</option>
                      <option value="Pediatrics">Pediatrics</option>
                      <option value="General Medicine">General Medicine</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">Appointment Date & Time</label>
                    <input
                      type="datetime-local"
                      name="appointmentDate"
                      value={appointmentForm.appointmentDate}
                      onChange={handleInputChange}
                      className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end space-x-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowAppointmentForm(false)}
                    className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creatingAppointment}
                    className="px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md disabled:opacity-50"
                  >
                    {creatingAppointment ? 'Booking...' : 'Book Appointment'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientDashboard;
