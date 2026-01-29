import React, { useState } from 'react';
import { FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const newErrors: { [key: string]: string } = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[\w-.]+@[\w-]+\.[a-z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.message.trim()) newErrors.message = 'Message is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // For demo, just mark submitted
      setSubmitted(true);
      setFormData({ name: '', email: '', message: '' });
      setErrors({});
    }
  };

  return (
    <section
      id="contact"
      className="max-w-7xl mx-auto px-6 py-20 text-white"
      aria-labelledby="contact-title"
    >
      <h2 id="contact-title" className="text-4xl font-bold mb-12 font-sans text-center">
        Contact
      </h2>
      <div className="max-w-3xl mx-auto">
        {submitted && (
          <div
            className="mb-6 p-4 bg-yellow-400 text-black rounded"
            role="alert"
            aria-live="polite"
          >
            Thank you for your message! I will get back to you soon.
          </div>
        )}
        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-6">
            <label htmlFor="name" className="block mb-2 font-semibold">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-black bg-opacity-50 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white ${
                errors.name ? 'border-red-500' : ''
              }`}
              aria-invalid={errors.name ? 'true' : 'false'}
              aria-describedby={errors.name ? 'name-error' : undefined}
            />
            {errors.name && (
              <p id="name-error" className="mt-1 text-red-500 text-sm">
                {errors.name}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="email" className="block mb-2 font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-black bg-opacity-50 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white ${
                errors.email ? 'border-red-500' : ''
              }`}
              aria-invalid={errors.email ? 'true' : 'false'}
              aria-describedby={errors.email ? 'email-error' : undefined}
            />
            {errors.email && (
              <p id="email-error" className="mt-1 text-red-500 text-sm">
                {errors.email}
              </p>
            )}
          </div>
          <div className="mb-6">
            <label htmlFor="message" className="block mb-2 font-semibold">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              value={formData.message}
              onChange={handleChange}
              className={`w-full px-4 py-2 rounded bg-black bg-opacity-50 border border-yellow-400 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-white resize-none ${
                errors.message ? 'border-red-500' : ''
              }`}
              aria-invalid={errors.message ? 'true' : 'false'}
              aria-describedby={errors.message ? 'message-error' : undefined}
            />
            {errors.message && (
              <p id="message-error" className="mt-1 text-red-500 text-sm">
                {errors.message}
              </p>
            )}
          </div>
          <button
            type="submit"
            className="bg-yellow-400 text-black font-semibold px-6 py-3 rounded hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            Send Message
          </button>
        </form>
        <div className="mt-12 flex justify-center space-x-8 text-yellow-400 text-2xl" aria-label="Social media links">
          <a href="https://facebook.com/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <FaFacebookF />
          </a>
          <a href="https://twitter.com/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
            <FaTwitter />
          </a>
          <a href="https://instagram.com/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <FaInstagram />
          </a>
          <a href="https://linkedin.com/in/alexrivera" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <FaLinkedinIn />
          </a>
        </div>
      </div>
    </section>
  );
};
