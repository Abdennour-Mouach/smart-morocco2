import { fireEvent, render, screen } from '@testing-library/react';

jest.mock('./pages/Home', () => () => <main>Home</main>);

const App = require('./App').default;

beforeAll(() => {
  Object.defineProperty(window.HTMLMediaElement.prototype, 'play', {
    configurable: true,
    value: jest.fn(() => Promise.resolve()),
  });
});

beforeEach(() => {
  localStorage.clear();
});

test('renders the Smart Morocco app shell', () => {
  render(<App />);
  expect(screen.getByRole('navigation')).toBeInTheDocument();
  expect(screen.getAllByAltText(/smart morocco/i).length).toBeGreaterThan(0);
});

test('lets visitors choose Spanish from the language menu', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: /changer la langue/i }));
  fireEvent.click(screen.getByRole('option', { name: /es español/i }));

  expect(localStorage.getItem('language')).toBe('es');
  expect(screen.getByRole('link', { name: /inicio/i })).toBeInTheDocument();
});
