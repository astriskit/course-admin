import { render, screen } from "@testing-library/react";
import App from "./App";

test("renders welcome to home", () => {
  render(<App />);
  const linkElement = screen.getByText(/welcome to home/i);
  expect(linkElement).toBeInTheDocument();
});
