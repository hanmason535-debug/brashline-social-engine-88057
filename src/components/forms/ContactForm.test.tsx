import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { ContactForm } from './ContactForm';

vi.mock('@/hooks/use-toast', () => {
  const toastMock = vi.fn();
  return {
    useToast: () => ({ toast: toastMock }),
    toast: toastMock,
  };
});

describe('ContactForm', () => {
  it('validates required fields and shows errors', async () => {
    render(<ContactForm lang="en" />);

    const button = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(button);

    await waitFor(() => {
      expect(screen.getByText(/Name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/Invalid email address/i)).toBeInTheDocument();
      expect(screen.getByText(/Please select a service type/i)).toBeInTheDocument();
      expect(screen.getByText(/Message must be at least 10 characters/i)).toBeInTheDocument();
    });
  });

  it('submits the form and triggers Toast and window.open', async () => {
    const winOpen = vi.spyOn(window, 'open').mockImplementation(() => null as any);
    const onSuccess = vi.fn();

    const { container } = render(<ContactForm lang="en" onSuccess={onSuccess} />);

    fireEvent.input(screen.getByLabelText(/Full Name/i), { target: { value: 'John Doe' } });
    fireEvent.input(screen.getByLabelText(/Email Address/i), { target: { value: 'john@example.com' } });
    fireEvent.input(screen.getByLabelText(/Phone Number/i), { target: { value: '1234567890' } });

    // Select a service using the native select fallback used by tests (radix renders a hidden select)
    const select = container.querySelector('select') as HTMLSelectElement;
    fireEvent.change(select, { target: { value: 'social' } });

    fireEvent.input(screen.getByLabelText(/Your Message|Tu Mensaje/i), { target: { value: 'This is my message with enough length.' } });

    const submit = screen.getByRole('button', { name: /Send Message/i });
    fireEvent.click(submit);

    await waitFor(() => {
      // Ensure window was opened to WhatsApp
      expect(winOpen).toHaveBeenCalled();
      // Verify onSuccess was called
      expect(onSuccess).toHaveBeenCalled();
    });

    winOpen.mockRestore();
  });
});
