import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import MenuItemReviewCreatePage from "main/pages/MenuItemReview/MenuItemReviewCreatePage";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MemoryRouter } from "react-router";

import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";

import axios from "axios";
import AxiosMockAdapter from "axios-mock-adapter";

const mockToast = vi.fn();
vi.mock("react-toastify", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    toast: vi.fn((x) => mockToast(x)),
  };
});

const mockNavigate = vi.fn();
vi.mock("react-router", async (importOriginal) => {
  const originalModule = await importOriginal();
  return {
    ...originalModule,
    Navigate: vi.fn((x) => {
      mockNavigate(x);
      return null;
    }),
  };
});

describe("MenuItemReviewCreatePage tests", () => {
  const axiosMock = new AxiosMockAdapter(axios);

  beforeEach(() => {
    vi.clearAllMocks();
    axiosMock.reset();
    axiosMock.resetHistory();
    axiosMock
      .onGet("/api/currentUser")
      .reply(200, apiCurrentUserFixtures.userOnly);
    axiosMock
      .onGet("/api/systemInfo")
      .reply(200, systemInfoFixtures.showingNeither);
  });

  const queryClient = new QueryClient();
  test("renders without crashing", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /menuitemreview", async () => {
    const queryClient = new QueryClient();
    const review = {
      id: 7,
      itemId: 1004,
      reviewerEmail: "reviewer4@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-04-23T11:30:00",
      comments: "Fresh and delicious.",
    };

    axiosMock.onPost("/api/menuitemreview/post").reply(202, review);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Item Id")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Item Id"), {
      target: { value: "1004" },
    });
    fireEvent.change(screen.getByLabelText("Reviewer Email"), {
      target: { value: "reviewer4@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Stars"), {
      target: { value: "5" },
    });
    fireEvent.change(screen.getByLabelText("Date Reviewed"), {
      target: { value: "2026-04-23T11:30" },
    });
    fireEvent.change(screen.getByLabelText("Comments"), {
      target: { value: "Fresh and delicious." },
    });
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      itemId: "1004",
      reviewerEmail: "reviewer4@ucsb.edu",
      stars: "5",
      dateReviewed: "2026-04-23T11:30",
      comments: "Fresh and delicious.",
    });

    expect(mockToast).toBeCalledWith("New MenuItemReview Created - id: 7");
    expect(mockNavigate).toBeCalledWith({ to: "/menuitemreview" });
  });

  test("invalid data does not submit", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <MenuItemReviewCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByLabelText("Item Id");
    fireEvent.click(screen.getByText("Create"));

    await screen.findByText(/Item Id is required/);
    expect(axiosMock.history.post.length).toBe(0);
  });
});
