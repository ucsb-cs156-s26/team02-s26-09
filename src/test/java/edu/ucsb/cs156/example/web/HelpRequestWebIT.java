package edu.ucsb.cs156.example.web;

import static com.microsoft.playwright.assertions.PlaywrightAssertions.assertThat;

import edu.ucsb.cs156.example.WebTestCase;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.annotation.DirtiesContext;
import org.springframework.test.annotation.DirtiesContext.ClassMode;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.context.junit.jupiter.SpringExtension;

@ExtendWith(SpringExtension.class)
@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.DEFINED_PORT)
@ActiveProfiles("integration")
@DirtiesContext(classMode = ClassMode.BEFORE_EACH_TEST_METHOD)
public class HelpRequestWebIT extends WebTestCase {
  @Test
  public void admin_user_can_create_edit_delete_help_request() throws Exception {
    setupUser(true);

    page.getByText("Help Requests").click();

    page.getByText("Create HelpRequest").click();
    assertThat(page.getByText("Create New HelpRequest")).isVisible();
    page.getByTestId("HelpRequestForm-requesterEmail").fill("student@ucsb.edu");
    page.getByTestId("HelpRequestForm-teamId").fill("s26-09");
    page.getByTestId("HelpRequestForm-tableOrBreakoutRoom").fill("Table 5");
    page.getByTestId("HelpRequestForm-requestTime").fill("2024-01-15T10:30");
    page.getByTestId("HelpRequestForm-explanation").fill("Need help with Swagger");
    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
        .hasText("Need help with Swagger");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Edit-button").click();
    assertThat(page.getByText("Edit HelpRequest")).isVisible();
    page.getByTestId("HelpRequestForm-explanation").fill("Fixed the issue");
    page.getByTestId("HelpRequestForm-submit").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation"))
        .hasText("Fixed the issue");

    page.getByTestId("HelpRequestTable-cell-row-0-col-Delete-button").click();

    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-explanation")).not().isVisible();
  }

  @Test
  public void regular_user_cannot_create_help_request() throws Exception {
    setupUser(false);

    page.getByText("Help Requests").click();

    assertThat(page.getByText("Create HelpRequest")).not().isVisible();
    assertThat(page.getByTestId("HelpRequestTable-cell-row-0-col-requesterEmail"))
        .not()
        .isVisible();
  }
}
