const recommendationRequestFixtures = {
  oneRecommendationRequest: {
    id: 1,
    requesterEmail: "student@ucsb.edu",
    professorEmail: "professor@ucsb.edu",
    explanation: "Requesting a recommendation for graduate school.",
    dateRequested: "2026-04-15T10:30:00",
    dateNeeded: "2026-05-01T17:00:00",
    done: false,
  },
  threeRecommendationRequests: [
    {
      id: 1,
      requesterEmail: "student1@ucsb.edu",
      professorEmail: "professor1@ucsb.edu",
      explanation: "Requesting a recommendation for graduate school.",
      dateRequested: "2026-04-15T10:30:00",
      dateNeeded: "2026-05-01T17:00:00",
      done: false,
    },
    {
      id: 2,
      requesterEmail: "student2@ucsb.edu",
      professorEmail: "professor2@ucsb.edu",
      explanation: "Requesting a recommendation for a summer internship.",
      dateRequested: "2026-04-16T09:00:00",
      dateNeeded: "2026-05-10T12:00:00",
      done: true,
    },
    {
      id: 3,
      requesterEmail: "student3@ucsb.edu",
      professorEmail: "professor3@ucsb.edu",
      explanation: "Requesting a recommendation for a scholarship application.",
      dateRequested: "2026-04-20T14:15:00",
      dateNeeded: "2026-05-15T23:59:00",
      done: false,
    },
  ],
};

export { recommendationRequestFixtures };
