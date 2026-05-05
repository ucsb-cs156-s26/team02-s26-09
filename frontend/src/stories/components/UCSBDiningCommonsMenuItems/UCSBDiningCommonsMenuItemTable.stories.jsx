import React from "react";
import UCSBDiningCommonsMenuItemsTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable";
import { ucsbDiningCommonsMenuItemFixtures } from "fixtures/ucsbDiningCommonsMenuItemFixtures";
import { currentUserFixtures } from "fixtures/currentUserFixtures";
import { http, HttpResponse } from "msw";

export default {
  title:
    "components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemsTable",
  component: UCSBDiningCommonsMenuItemsTable,
};

const Template = (args) => {
  return <UCSBDiningCommonsMenuItemsTable {...args} />;
};

export const Empty = Template.bind({});

Empty.args = {
  menuItems: [],
};

export const ThreeItemsOrdinaryUser = Template.bind({});

ThreeItemsOrdinaryUser.args = {
  menuItems: ucsbDiningCommonsMenuItemFixtures.threeucsbDiningCommonsMenuItems,
  currentUser: currentUserFixtures.userOnly,
};

export const ThreeItemsAdminUser = Template.bind({});
ThreeItemsAdminUser.args = {
  menuItems: ucsbDiningCommonsMenuItemFixtures.threeucsbDiningCommonsMenuItems,
  currentUser: currentUserFixtures.adminUser,
};

ThreeItemsAdminUser.parameters = {
  msw: [
    http.delete("/api/ucsbdiningcommonsmenuitem", () => {
      return HttpResponse.json({}, { status: 200 });
    }),
  ],
};
