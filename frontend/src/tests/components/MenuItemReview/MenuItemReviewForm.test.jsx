import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { BrowserRouter as Router } from "react-router";

import MenuItemReviewForm from "main/components/MenuItemReview/MenuItemReviewForm";
import { menuItemReviewFixtures } from "fixtures/menuItemReviewFixtures";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("MenuItemReviewForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Item Id",
    "Stars",
    "Reviewer Email",
    "Date Reviewed",
    "Comments",
  ];
  const testId = "MenuItemReviewForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.queryByTestId(`${testId}-id`)).not.toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-itemId`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-stars`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-reviewerEmail`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-dateReviewed`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-comments`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm
            initialContents={menuItemReviewFixtures.oneReview}
          />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(await screen.findByTestId(`${testId}-id`)).toBeInTheDocument();
    expect(screen.getByText("Id")).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-id`)).toHaveValue("1");
    expect(screen.getByTestId(`${testId}-itemId`)).toHaveValue(1001);
    expect(screen.getByTestId(`${testId}-stars`)).toHaveValue(5);
    expect(screen.getByTestId(`${testId}-reviewerEmail`)).toHaveValue(
      "reviewer1@ucsb.edu",
    );
    expect(screen.getByTestId(`${testId}-dateReviewed`)).toHaveValue(
      "2026-04-20T12:30",
    );
    expect(screen.getByTestId(`${testId}-comments`)).toHaveValue(
      "Excellent flavor and generous portion size.",
    );
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );
    expect(await screen.findByTestId(`${testId}-cancel`)).toBeInTheDocument();
    const cancelButton = screen.getByTestId(`${testId}-cancel`);

    fireEvent.click(cancelButton);

    await waitFor(() => expect(mockedNavigate).toHaveBeenCalledWith(-1));
  });

  test("that the correct validations are performed", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <MenuItemReviewForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByTestId(`${testId}-submit`);
    fireEvent.click(submitButton);

    expect(await screen.findByText(/Item Id is required/)).toBeInTheDocument();
    expect(screen.getByText(/Stars is required/)).toBeInTheDocument();
    expect(screen.getByText(/Reviewer Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Reviewed is required/)).toBeInTheDocument();
    expect(screen.getByText(/Comments is required/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId(`${testId}-itemId`), {
      target: { value: "0" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-stars`), {
      target: { value: "0" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/Stars must be at least 1/)).toBeInTheDocument();
    });

    fireEvent.change(screen.getByTestId(`${testId}-stars`), {
      target: { value: "6" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-reviewerEmail`), {
      target: { value: "not-an-email" },
    });
    fireEvent.click(submitButton);

    await waitFor(() => {
      expect(
        screen.getByText(/Item Id must be at least 1/),
      ).toBeInTheDocument();
    });
    expect(screen.getByText(/Stars must be at most 5/)).toBeInTheDocument();
    expect(
      screen.getByText(/Reviewer Email must be a valid email address/),
    ).toBeInTheDocument();
  });
});
