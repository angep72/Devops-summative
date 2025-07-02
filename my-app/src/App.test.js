/* eslint-env jest */
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

test('renders heading', () => {
  render(<App />);
  const heading = screen.getByText(/Vite \+ React/i);
  expect(heading).toBeInTheDocument();
});

test('increments counter when button is clicked', () => {
  render(<App />);
  const button = screen.getByRole('button', { name: /count is/i });
  fireEvent.click(button);
  expect(button).toHaveTextContent('count is 1');
});