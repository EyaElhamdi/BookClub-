import { render, screen } from '@testing-library/react';
import App from './App';

test('renders header with navigation', () => {
  render(<App />);
  const linkElement = screen.getByText(/accueil/i);
  expect(linkElement).toBeInTheDocument();
});
