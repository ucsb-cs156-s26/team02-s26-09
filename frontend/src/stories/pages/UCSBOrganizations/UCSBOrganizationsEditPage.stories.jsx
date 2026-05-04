import React from "react";
import { apiCurrentUserFixtures } from "fixtures/currentUserFixtures";
import { systemInfoFixtures } from "fixtures/systemInfoFixtures";
import { http, HttpResponse } from "msw";

import UCSBOrganizationsEditPage from "main/pages/UCSBOrganizations/UCSBOrganizationsEditPage";
import { ucsbOrganizationsFixtures } from "fixtures/ucsbOrganizationsFixtures";

export default {
  title: "pages/UCSBOrganizations/UCSBOrganizationsEditPage",
  component: UCSBOrganizationsEditPage,
};

const Template = () => <UCSBOrganizationsEditPage storybook={true} />;

export const Default = Template.bind({});
Default.parameters = {
  msw: [
    http.get("/api/currentUser", () => {
      return HttpResponse.json(apiCurrentUserFixtures.userOnly, {
        status: 200,
      });
    }),
    http.get("/api/systemInfo", () => {
      return HttpResponse.json(systemInfoFixtures.showingNeither, {
        status: 200,
      });
    }),
    http.get("/api/ucsborganizations", () => {
      return HttpResponse.json(ucsbOrganizationsFixtures.threeOrganizations[0], {
        status: 200,
      });
    }),
    http.put("/api/ucsborganizations", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
    http.put("/api/ucsborganizations", (req) => {
      window.alert("PUT: " + req.url + " and body: " + req.body);
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
