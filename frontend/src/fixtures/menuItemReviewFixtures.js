const menuItemReviewFixtures = {
  oneReview: {
    id: 1,
    itemId: 1001,
    reviewerEmail: "reviewer1@ucsb.edu",
    stars: 5,
    dateReviewed: "2026-04-20T12:30:00",
    comments: "Excellent flavor and generous portion size.",
  },
  threeReviews: [
    {
      id: 1,
      itemId: 1001,
      reviewerEmail: "reviewer1@ucsb.edu",
      stars: 5,
      dateReviewed: "2026-04-20T12:30:00",
      comments: "Excellent flavor and generous portion size.",
    },
    {
      id: 2,
      itemId: 1002,
      reviewerEmail: "reviewer2@ucsb.edu",
      stars: 4,
      dateReviewed: "2026-04-21T18:45:00",
      comments: "Good option, but it could use more seasoning.",
    },
    {
      id: 3,
      itemId: 1003,
      reviewerEmail: "reviewer3@ucsb.edu",
      stars: 2,
      dateReviewed: "2026-04-22T09:15:00",
      comments: "The item was cold by the time it was served.",
    },
  ],
};

export { menuItemReviewFixtures };
