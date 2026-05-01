import { Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router";

function ArticlesForm({
  initialContents,
  submitAction,
  buttonLabel = "Create",
}) {
  const defaultValues = initialContents
    ? {
        ...initialContents,
        dateAdded: initialContents.dateAdded?.slice(0, 16),
      }
    : undefined;

  // Stryker disable Regex
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
  // Stryker restore Regex

  // Stryker disable all
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });
  // Stryker restore all

  const navigate = useNavigate();

  const testIdPrefix = "ArticlesForm";

  return (
    <Form onSubmit={handleSubmit(submitAction)}>
      {initialContents && (
        <Form.Group className="mb-3">
          <Form.Label htmlFor="id">Id</Form.Label>
          <Form.Control
            data-testid={testIdPrefix + "-id"}
            id="id"
            type="text"
            {...register("id")}
            value={initialContents.id}
            disabled
          />
        </Form.Group>
      )}

      <Form.Group className="mb-3">
        <Form.Label htmlFor="title">Title</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-title"}
          id="title"
          type="text"
          isInvalid={Boolean(errors.title)}
          {...register("title", {
            required: "Title is required.",
            maxLength: {
              value: 255,
              message: "Title must be 255 characters or fewer.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.title?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="url">URL</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-url"}
          id="url"
          type="url"
          isInvalid={Boolean(errors.url)}
          {...register("url", {
            required: "URL is required.",
            validate: (value) => {
              try {
                new URL(value);
                return true;
              } catch {
                return "URL must be valid.";
              }
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.url?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="explanation">Explanation</Form.Label>
        <Form.Control
          as="textarea"
          data-testid={testIdPrefix + "-explanation"}
          id="explanation"
          rows={3}
          isInvalid={Boolean(errors.explanation)}
          {...register("explanation", {
            required: "Explanation is required.",
            maxLength: {
              value: 255,
              message: "Explanation must be 255 characters or fewer.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.explanation?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="email">Email</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-email"}
          id="email"
          type="email"
          isInvalid={Boolean(errors.email)}
          {...register("email", {
            required: "Email is required.",
            pattern: {
              value: emailRegex,
              message: "Email must be valid.",
            },
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.email?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Form.Group className="mb-3">
        <Form.Label htmlFor="dateAdded">Date Added</Form.Label>
        <Form.Control
          data-testid={testIdPrefix + "-dateAdded"}
          id="dateAdded"
          type="datetime-local"
          isInvalid={Boolean(errors.dateAdded)}
          {...register("dateAdded", {
            required: "Date Added is required.",
          })}
        />
        <Form.Control.Feedback type="invalid">
          {errors.dateAdded?.message}
        </Form.Control.Feedback>
      </Form.Group>

      <Button type="submit" data-testid={testIdPrefix + "-submit"}>
        {buttonLabel}
      </Button>
      <Button
        variant="Secondary"
        onClick={() => navigate(-1)}
        data-testid={testIdPrefix + "-cancel"}
      >
        Cancel
      </Button>
    </Form>
  );
}

export default ArticlesForm;
