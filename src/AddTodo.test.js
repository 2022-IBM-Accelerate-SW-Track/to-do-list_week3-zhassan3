import { render, screen, fireEvent } from '@testing-library/react';
import { unmountComponentAtNode } from 'react-dom';
import App from './App';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});




test('test that App component doesn\'t render dupicate Task', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: "Add New Item" });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";
  const sdueDate = "10/30/2021";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);
  ///second one
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: sdueDate } });
  fireEvent.click(element);
  const check = screen.getByText(/History Test/i);
  const checkDate = screen.getByText(new RegExp("5/30/2023", "i"));
  const scheckDate = screen.queryByText(new RegExp("10/23/2021", "i"));

  expect(check).toBeInTheDocument();
  expect(checkDate).toBeInTheDocument();
  expect(scheckDate).toBeNull();

});

test('test that App component doesn\'t add a task without task name', () => {
  render(<App />);
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "10/10/2010";
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);
  const check = screen.queryByText(new RegExp(dueDate, "i"));
  expect(check).toBeNull();

});

test('test that App component doesn\'t add a task without due date', () => {
  render(<App />);
  const inputItem = screen.getByRole("textbox", { name: /Add New Item/i });
  const element = screen.getByRole('button', { name: /Add/i });
  const inputText = "History Test";
  fireEvent.change(inputItem, { target: { value: inputText } });
  fireEvent.click(element);
  const check = screen.queryByText(/History Test/i);
  expect(check).toBeNull();
})



test('test that App component can be deleted thru checkbox', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";

  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);
  ///second one
  const checkbox = screen.getByTestId("checkbox");
  fireEvent.click(checkbox);

  const check = screen.queryByText(/History Test/i);
  expect(check).toBeNull();

});


test('test that App component renders different colors for past due events', () => {
  render(<App />);
  const inputTask = screen.getByRole('textbox', { name: /Add New Item/i });
  const inputDate = screen.getByPlaceholderText("mm/dd/yyyy");
  const element = screen.getByRole('button', { name: /Add/i });
  const dueDate = "05/30/2023";
  const sdueDate = "10/30/2021";
  fireEvent.change(inputTask, { target: { value: "History Test" } });
  fireEvent.change(inputDate, { target: { value: dueDate } });
  fireEvent.click(element);
  ///second one
  fireEvent.change(inputTask, { target: { value: "Math Test" } });
  fireEvent.change(inputDate, { target: { value: sdueDate } });
  fireEvent.click(element);
  const historyCheck = screen.getByTestId(/History Test/i).style.background
  const mathCheck = screen.getByTestId(/Math Test/i).style.background
  const equality = historyCheck == mathCheck;

  expect(equality).toBe(false);
});
