import { useForm, FieldError } from 'react-hook-form';
import { ReactNode } from 'react';

import { toast } from 'react-toastify';

interface FormData {
  name: string;
  email: string;
  message: string;
}

const ContactPage = () => {

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>();

  const onSubmit = (data: FormData) => {
    console.log(data);
    toast.success('Message sent successfully');

  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-4">Contact Us</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg">
        <div className="mb-4">
          <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name</label>
          <input
            type="text"
            id="name"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('name', { required: 'Name is required' })}
            aria-invalid={errors.name ? 'true' : 'false'}
          />
          {errors.name && <p className="text-red-500 text-xs italic">{errors.name.message as ReactNode}</p>}
        </div>
        <div className="mb-4">

          <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email</label>
          <input
            type="email"
            id="email"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('email', {
              required: 'Email is required',
              pattern: { value: /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, message: 'Invalid email format' },
            })}
            aria-invalid={errors.email ? 'true' : 'false'}
          />
          {errors.email && <p className="text-red-500 text-xs italic">{errors.email.message as ReactNode}</p>}
        </div>
        <div className="mb-6">

          <label htmlFor="message" className="block text-gray-700 text-sm font-bold mb-2">Message</label>
          <textarea
            id="message"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            {...register('message', { required: 'Message is required', minLength: { value: 10, message: 'Message must be at least 10 characters' } })}
            aria-invalid={errors.message ? 'true' : 'false'}
          />
          {errors.message && <p className="text-red-500 text-xs italic">{errors.message.message as ReactNode}</p>}
        </div>
        <button className="bg-black text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline" type="submit">Submit</button>

      </form>
    </div>
  );
};

export default ContactPage;
