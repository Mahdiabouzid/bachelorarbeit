import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Header from '../components/Header';
import Footer from '../components/Footer';
import FormInput from '../components/FormInput';
import Button from '../components/Button';

// Define validation schema
const contactSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().min(1, 'Email is required').email('Invalid email format'),
  message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactPage: React.FC = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    console.log('Form Data:', data);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    
    toast.success('Message sent successfully', {
      position: 'top-right',

      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
    });
    
    reset();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">Contact Us</h1>
            <p className="text-lg text-gray-600">
              Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
            </p>
          </div>

          <div className="bg-white shadow-sm rounded-lg p-8 border border-gray-200">
            <form 
              onSubmit={handleSubmit(onSubmit)} 
              aria-label="Contact form" 
              noValidate
            >
              <FormInput
                label="Name"
                name="name"
                placeholder="Your full name"
                register={register('name')}
                error={errors.name?.message}
              />

              <FormInput
                label="Email"
                name="email"
                type="email"
                placeholder="your.email@example.com"
                register={register('email')}
                error={errors.email?.message}
              />

              <FormInput
                label="Message"
                name="message"
                isTextArea
                placeholder="How can we help you?"
                register={register('message')}
                error={errors.message?.message}
              />

              <div className="mt-6">
                <Button
                  type="submit"
                  variant="primary"
                  className="w-full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />
      <ToastContainer />
    </div>
  );
};

export default ContactPage;
