import React from "react";

interface SessionDetails {
  day: string;
  date: string;
  time: string;
  location: string;
}

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  experience: string;
  notes: string;
}

interface RegistrationFormProps {
  selectedSession: number;
  sessionDetails: SessionDetails;
  registrationData: RegistrationData;
  handleInputChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => void;
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  isSubmitting: boolean;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  selectedSession,
  sessionDetails,
  registrationData,
  handleInputChange,
  handleSubmit,
  isSubmitting,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-8">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-nyu-purple mb-2">
          You're registering for:
        </h3>
        <p className="text-gray-700">
          {sessionDetails.day} - {sessionDetails.date} at {sessionDetails.time}
        </p>
        <p className="text-gray-700">Location: {sessionDetails.location}</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-gray-700 mb-2" htmlFor="name">
              Full Name *
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={registrationData.name}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nyu-purple"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="email">
              NYU Email *
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={registrationData.email}
              onChange={handleInputChange}
              required
              pattern=".+@nyu\.edu"
              title="Please enter a valid NYU email address"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nyu-purple"
              placeholder="your.name@nyu.edu"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="phone">
              Phone Number
            </label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={registrationData.phone}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nyu-purple"
              placeholder="(123) 456-7890"
            />
          </div>

          <div>
            <label className="block text-gray-700 mb-2" htmlFor="experience">
              Tennis Experience *
            </label>
            <select
              id="experience"
              name="experience"
              value={registrationData.experience}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nyu-purple"
            >
              <option value="">Select your experience level</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-gray-700 mb-2" htmlFor="notes">
              Additional Notes
            </label>
            <textarea
              id="notes"
              name="notes"
              value={registrationData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-nyu-purple"
              placeholder="Any specific requests or information we should know..."
            ></textarea>
          </div>
        </div>

        <div className="mt-8 flex justify-end">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`px-6 py-3 bg-nyu-purple text-white font-medium rounded-md hover:bg-purple-800 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 ${
              isSubmitting ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {isSubmitting ? "Submitting..." : "Complete Registration"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default RegistrationForm;
