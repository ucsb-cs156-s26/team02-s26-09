import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { articlesFixtures } from "fixtures/articlesFixtures";
import ArticlesForm from "main/components/Articles/ArticlesForm";
import { BrowserRouter as Router } from "react-router";

const mockedNavigate = vi.fn();
vi.mock("react-router", async () => {
  const originalModule = await vi.importActual("react-router");
  return {
    ...originalModule,
    useNavigate: () => mockedNavigate,
  };
});

describe("ArticlesForm tests", () => {
  const queryClient = new QueryClient();

  const expectedHeaders = [
    "Title",
    "URL",
    "Explanation",
    "Email",
    "Date Added",
  ];
  const testId = "ArticlesForm";

  test("renders correctly with no initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();

    expectedHeaders.forEach((headerText) => {
      const header = screen.getByText(headerText);
      expect(header).toBeInTheDocument();
    });

    expect(screen.getByTestId(`${testId}-title`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-url`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-explanation`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-email`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-dateAdded`)).toBeInTheDocument();
    expect(screen.getByTestId(`${testId}-submit`)).toBeInTheDocument();
  });

  test("renders correctly when passing in initialContents", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm initialContents={articlesFixtures.oneArticle} />
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
    expect(screen.getByTestId(`${testId}-title`)).toHaveValue(
      articlesFixtures.oneArticle.title,
    );
    expect(screen.getByTestId(`${testId}-dateAdded`)).toHaveValue(
      "2024-01-02T03:04",
    );
  });

  test("that navigate(-1) is called when Cancel is clicked", async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Router>
          <ArticlesForm />
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
          <ArticlesForm />
        </Router>
      </QueryClientProvider>,
    );

    expect(await screen.findByText(/Create/)).toBeInTheDocument();
    const submitButton = screen.getByText(/Create/);
    fireEvent.click(submitButton);

    await screen.findByText(/Title is required/);
    expect(screen.getByText(/URL is required/)).toBeInTheDocument();
    expect(screen.getByText(/Explanation is required/)).toBeInTheDocument();
    expect(screen.getByText(/Email is required/)).toBeInTheDocument();
    expect(screen.getByText(/Date Added is required/)).toBeInTheDocument();

    fireEvent.change(screen.getByTestId(`${testId}-title`), {
      target: { value: "A valid title" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-url`), {
      target: { value: "not-a-url" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-explanation`), {
      target: { value: "A helpful explanation" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-email`), {
      target: { value: "not-an-email" },
    });
    fireEvent.change(screen.getByTestId(`${testId}-dateAdded`), {
      target: { value: "2024-01-02T03:04" },
    });
    fireEvent.click(submitButton);

    await screen.findByText(/URL must be valid/);
    expect(screen.getByText(/Email must be valid/)).toBeInTheDocument();
  });
});
