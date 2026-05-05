import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import ArticlesCreatePage from "main/pages/Articles/ArticlesCreatePage";
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

describe("ArticlesCreatePage tests", () => {
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
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });
  });

  test("on submit, makes request to backend, and redirects to /articles", async () => {
    const localQueryClient = new QueryClient();
    const article = {
      id: 3,
      title: "Ocean Cleanup Milestone",
      url: "https://example.org/ocean-cleanup",
      explanation: "Reports on a major milestone for ocean cleanup efforts.",
      email: "author@example.org",
      dateAdded: "2026-04-30T14:15",
    };

    axiosMock.onPost("/api/Articles/post").reply(202, article);

    render(
      <QueryClientProvider client={localQueryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await waitFor(() => {
      expect(screen.getByLabelText("Title")).toBeInTheDocument();
    });

    fireEvent.change(screen.getByLabelText("Title"), {
      target: { value: article.title },
    });
    fireEvent.change(screen.getByLabelText("URL"), {
      target: { value: article.url },
    });
    fireEvent.change(screen.getByLabelText("Explanation"), {
      target: { value: article.explanation },
    });
    fireEvent.change(screen.getByLabelText("Email"), {
      target: { value: article.email },
    });
    fireEvent.change(screen.getByLabelText("Date Added"), {
      target: { value: article.dateAdded },
    });
    fireEvent.click(screen.getByText("Create"));

    await waitFor(() => expect(axiosMock.history.post.length).toBe(1));

    expect(axiosMock.history.post[0].params).toEqual({
      title: "Ocean Cleanup Milestone",
      url: "https://example.org/ocean-cleanup",
      explanation: "Reports on a major milestone for ocean cleanup efforts.",
      email: "author@example.org",
      dateAdded: "2026-04-30T14:15",
    });

    expect(mockToast).toBeCalledWith(
      "New article Created - id: 3 title: Ocean Cleanup Milestone",
    );
    expect(mockNavigate).toBeCalledWith({ to: "/articles" });
  });

  test("invalid data does not submit", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>
          <ArticlesCreatePage />
        </MemoryRouter>
      </QueryClientProvider>,
    );

    await screen.findByLabelText("Title");
    fireEvent.click(screen.getByText("Create"));

    await screen.findByText(/Title is required/);
    expect(axiosMock.history.post.length).toBe(0);
    expect(mockNavigate).not.toHaveBeenCalled();
  });
});
