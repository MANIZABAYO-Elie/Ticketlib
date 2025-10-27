
import React, { useState } from 'react';
import { Mail, Phone, MapPin, User } from 'lucide-react';

interface InputFieldProps {
  label: string;
  type: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  icon?: React.ReactNode;
}

const InputField: React.FC<InputFieldProps> = ({ 
  label, 
  type, 
  placeholder, 
  value, 
  onChange, 
  icon 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          className={`w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${
            icon ? 'pl-10' : ''
          }`}
        />
      </div>
    </div>
  );
};

interface TextAreaFieldProps {
  label: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
}

const TextAreaField: React.FC<TextAreaFieldProps> = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  rows = 4 
}) => {
  return (
    <div className="mb-4">
      <label className="block text-gray-700 text-sm font-medium mb-2">
        {label}
      </label>
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
      />
    </div>
  );
};

interface ContactInfoCardProps {
  icon: React.ReactNode;
  title: string;
  info: string;
}

const ContactInfoCard: React.FC<ContactInfoCardProps> = ({ icon, title, info }) => {
  return (
    <div className="flex flex-col items-center text-center text-white mb-6">
      <div className="mb-2">{icon}</div>
      <p className="text-sm font-medium">{info}</p>
    </div>
  );
};

interface FormData {
  name: string;
  email: string;
  phone: string;
  message: string;
}

const ContactPage: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: 'philos@gmail.com',
    phone: '+278238478',
    message: ''
  });

  const handleInputChange = (field: keyof FormData) => (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setFormData(prev => ({
      ...prev,
      [field]: e.target.value
    }));
  };

  const handleSubmit = () => {
    console.log('Form submitted:', formData);
  };

  return (
    <div className="min-h-screen bg-linear-to-r from-[#1e3a8a] to-[#3b82f6]  flex items-center justify-center p-4">
       
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-3">Get In touch</h1>
          <p className="text-blue-100 text-lg">
            Contact Us for a quote, help or to join the team.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <ContactInfoCard
            icon={<MapPin size={24} />}
            title="Address"
            info="102 Street 2714 don"
          />
          <ContactInfoCard
            icon={<Phone size={24} />}
            title="Phone"
            info="+250786879574"
          />
          <ContactInfoCard
            icon={<Mail size={24} />}
            title="Email"
            info="philos@gmail.com"
          />
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Contact Form</h2>
          
          <div>
            <InputField
              label="Your Name"
              type="text"
              placeholder="Your Name"
              value={formData.name}
              onChange={handleInputChange('name')}
              icon={<User size={18} />}
            />

            <InputField
              label="Mail"
              type="email"
              placeholder="philos@gmail.com"
              value={formData.email}
              onChange={handleInputChange('email')}
              icon={<Mail size={18} />}
            />

            <InputField
              label="Phone"
              type="tel"
              placeholder="+278238478"
              value={formData.phone}
              onChange={handleInputChange('phone')}
              icon={<Phone size={18} />}
            />

            <TextAreaField
              label="Message"
              placeholder="please write your message.."
              value={formData.message}
              onChange={handleInputChange('message')}
              rows={5}
            />

            <button
              onClick={handleSubmit}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition duration-200 shadow-lg hover:shadow-xl transform hover:scale-105"
            >
              Send Message
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;