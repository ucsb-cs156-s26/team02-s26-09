import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import RecommendationRequestCreatePage from "main/pages/RecommendationRequest/RecommendationRequestCreatePage";
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

describe("RecommendationRequestCreatePage tests", () => {
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
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /recommendationrequest", async () => {
    const queryClient = new QueryClient();
    const recommendationRequest = {
      id: 7,
      requesterEmail: "student4@ucsb.edu",
      professorEmail: "professor4@ucsb.edu",
      explanation: "Requesting a recommendation for graduate school.",
      dateRequested: "2026-04-23T11:30:00",
      dateNeeded: "2026-05-15T17:00:00",
      done: true,
    };

    axiosMock
      .onPost("/api/recommendationrequests/post")
      .reply(202, recommendationRequest);

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Requester Email")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Requester Email"), {
      target: { value: "student4@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Professor Email"), {
      target: { value: "professor4@ucsb.edu" },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: "Requesting a recommendation for graduate school." },
    });
    fireEvent.change(screen.getByLabelText("Date Requested"), {
      target: { value: "2026-04-23T11:30" },
    });
    fireEvent.change(screen.getByLabelText("Date Needed"), {
      target: { value: "2026-05-15T17:00" },
    });
    fireEvent.click(screen.getByLabelText("Done"));
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      requesterEmail: "student4@ucsb.edu",
      professorEmail: "professor4@ucsb.edu",
      explanation: "Requesting a recommendation for graduate school.",
      dateRequested: "2026-04-23T11:30",
      dateNeeded: "2026-05-15T17:00",
      done: true,
    });

    expect(mockToast).toBeCalledWith("New RecommendationRequest Created - id: 7");
    expect(mockNavigate).toBeCalledWith({ to: "/recommendationrequest" });
  });

  test("invalid data does not submit", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <RecommendationRequestCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByLabelText("Requester Email");
    fireEvent.click(screen.getByText("Create"));

    await screen.findByText(/Requester Email is required/);
    expect(axiosMock.history.post.length).toBe(0);
  });
});
