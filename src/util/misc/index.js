export const delay = (seconds) => {
  return new Promise((resolve) =>
    setTimeout(() => {
      resolve();
    }, seconds * 1000)
  );
};
