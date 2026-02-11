const jobs = [];

export const enqueueJob = (type, payload = {}) => {
  jobs.push({
    id: `${Date.now()}-${Math.random().toString(16).slice(2, 7)}`,
    type,
    payload,
    queuedAt: new Date().toISOString(),
  });
};

export const startJobWorker = () => {
  setInterval(() => {
    const job = jobs.shift();
    if (!job) return;
    console.log(`[job] processed ${job.type}`, job.payload);
  }, 5000);
};
