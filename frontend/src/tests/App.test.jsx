import { render, screen } from "@testing-library/react";
import App from "../App";

test("renders RRRS title", () => {
  render(<App />);
  expect(screen.getByText(/RRRS/i)).toBeInTheDocument();
});