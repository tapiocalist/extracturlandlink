'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { ErrorMessage } from '@/components/ui/ErrorMessage';
import { trackFormSubmission } from '@/lib/analytics';

interface ContactForm {
  name: string;
  email: string;
  subject: string;
  message: string;
}

interface FormErrors {
  name?: string;
  email?: string;
  subject?: string;
  message?: string;
}

export default function Contact() {
  const [form, setForm] = useState<ContactForm>({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!form.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!form.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!form.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (!form.message.trim()) {
      newErrors.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      newErrors.message = 'Message must be at least 10 characters long';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof ContactForm, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Simulate form submission (in a real app, this would send to a backend)
      await new Promise(resolve => setTimeout(resolve, 1000));

      setIsSubmitted(true);
      setForm({ name: '', email: '', subject: '', message: '' });

      // Track successful form submission
      trackFormSubmission('contact', true);
    } catch (error) {
      console.error('Form submission error:', error);

      // Track failed form submission
      trackFormSubmission('contact', false);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSubmitted) {
    return (
      <main className="min-h-screen bg-apple-background">
        <section className="py-16">
          <div className="container-apple">
            <div className="max-w-2xl mx-auto text-center">
              <div className="card p-12">
                <div className="text-6xl mb-6">✅</div>
                <h1 className="text-4xl md:text-5xl font-bold text-black mb-4">
                  Thank You!
                </h1>
                <p className="text-xl text-content-gray mb-8">
                  Your message has been received. We'll get back to you as soon as possible.
                </p>
                <Button
                  onClick={() => setIsSubmitted(false)}
                  className="btn-primary"
                >
                  Send Another Message
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-apple-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-b from-white to-apple-background border-b border-apple-gray border-opacity-20">
        <div className="container-apple py-16">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-black mb-6 tracking-tight">
              Get in Touch
            </h1>
            <p className="text-xl text-content-gray mb-8 leading-relaxed max-w-2xl mx-auto">
              Have questions, feedback, or suggestions? We'd love to hear from you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-16">
        <div className="container-apple">
          <div className="max-w-2xl mx-auto">
            {/* Contact Form */}
            <div className="card p-6 sm:p-8">
              <h2 className="text-3xl font-bold text-black mb-8 tracking-tight">
                Send us a Message
              </h2>

              <form
                action="mailto:katrinaalhayek@gmail.com"
                method="post"
                encType="text/plain"
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="name" className="block text-lg font-semibold text-black mb-2">
                    Name *
                  </label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={form.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    placeholder="Your full name"
                    className={errors.name ? 'border-apple-red' : ''}
                  />
                  {errors.name && <ErrorMessage message={errors.name} />}
                </div>

                <div>
                  <label htmlFor="email" className="block text-lg font-semibold text-black mb-2">
                    Email *
                  </label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={form.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    placeholder="your.email@example.com"
                    className={errors.email ? 'border-apple-red' : ''}
                  />
                  {errors.email && <ErrorMessage message={errors.email} />}
                </div>

                <div>
                  <label htmlFor="subject" className="block text-lg font-semibold text-black mb-2">
                    Subject *
                  </label>
                  <Input
                    id="subject"
                    name="subject"
                    type="text"
                    value={form.subject}
                    onChange={(e) => handleInputChange('subject', e.target.value)}
                    placeholder="What's this about?"
                    className={errors.subject ? 'border-apple-red' : ''}
                  />
                  {errors.subject && <ErrorMessage message={errors.subject} />}
                </div>

                <div>
                  <label htmlFor="message" className="block text-lg font-semibold text-black mb-2">
                    Message *
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    value={form.message}
                    onChange={(e) => handleInputChange('message', e.target.value)}
                    placeholder="Tell us more about your question, feedback, or suggestion..."
                    rows={6}
                    className={errors.message ? 'border-apple-red' : ''}
                  />
                  {errors.message && <ErrorMessage message={errors.message} />}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="btn-primary w-full"
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </div>

          </div>
        </div>
      </section>
    </main>
  );
}