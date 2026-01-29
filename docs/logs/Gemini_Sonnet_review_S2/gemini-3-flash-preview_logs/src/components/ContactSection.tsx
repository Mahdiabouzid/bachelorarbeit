import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import SectionContainer from './SectionContainer';
import Button from './Button';
import SocialIcon from './SocialIcon';
import { socialLinks } from '../data/portfolioData';
import useScrollAnimation from '../hooks/useScrollAnimation';


const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type ContactFormData = z.infer<typeof contactSchema>;

const ContactSection: React.FC = () => {
  const { elementRef: leftRef, isVisible: leftVisible } = useScrollAnimation(0.2);
  const { elementRef: rightRef, isVisible: rightVisible } = useScrollAnimation(0.2);

  const {
    register,

    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: ContactFormData) => {
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Form submitted:', data);
    alert('Thank you for your message! I will get back to you soon.');
    reset();
  };

  return (
    <SectionContainer id="contact" backgroundColor="white">
      <div className="grid md:grid-cols-2 gap-16 overflow-hidden">
        <div 
          ref={leftRef}
          className={`transition-all duration-1000 transform ${leftVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-[50px]'}`}
        >
          <h2 className="text-[#D4AF37] text-sm font-bold tracking-widest uppercase mb-4">Contact</h2>

          <h3 className="text-4xl font-bold mb-8">Let's work together.</h3>
          <p className="text-gray-600 mb-12 leading-relaxed">
            Have a project in mind or just want to say hi? Feel free to reach out using the form or connect with me on social media.
          </p>

          <div className="flex gap-4">
            {socialLinks.map((link) => (
              <SocialIcon key={link.platform} {...link} />
            ))}
          </div>
        </div>

        <div 
          ref={rightRef}
          className={`transition-all duration-1000 transform ${rightVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-[50px]'}`}
        >
          <form 
            onSubmit={handleSubmit(onSubmit)} 
            className="space-y-6"
          >

          <div>

            <label htmlFor="name" className="block text-sm font-bold uppercase tracking-wider mb-2">
              Name
            </label>
            <input
              id="name"
              {...register('name')}
              className={`w-full px-4 py-3 bg-gray-50 border-2 focus:outline-none transition-colors ${
                errors.name ? 'border-red-500' : 'border-transparent focus:border-[#D4AF37]'
              }`}
              placeholder="Your Name"
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-bold uppercase tracking-wider mb-2">
              Email
            </label>
            <input
              id="email"
              type="email"
              {...register('email')}
              className={`w-full px-4 py-3 bg-gray-50 border-2 focus:outline-none transition-colors ${
                errors.email ? 'border-red-500' : 'border-transparent focus:border-[#D4AF37]'
              }`}
              placeholder="your@email.com"
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-bold uppercase tracking-wider mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={5}
              {...register('message')}
              className={`w-full px-4 py-3 bg-gray-50 border-2 focus:outline-none transition-colors resize-none ${
                errors.message ? 'border-red-500' : 'border-transparent focus:border-[#D4AF37]'
              }`}
              placeholder="Tell me about your project..."
            />
            {errors.message && <p className="mt-1 text-xs text-red-500">{errors.message.message}</p>}
          </div>

          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </Button>
          </form>
        </div>
      </div>

    </SectionContainer>
  );
};

export default ContactSection;