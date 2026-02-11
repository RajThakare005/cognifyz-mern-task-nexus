const submissions = [];

export const addSubmission = (entry) => {
  submissions.unshift({
    ...entry,
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 8)}`,
    createdAt: new Date().toISOString(),
  });
  if (submissions.length > 100) submissions.pop();
};

export const getSubmissions = () => submissions;
