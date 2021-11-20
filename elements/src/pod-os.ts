export const createPodOS = () => {
  // @ts-ignore
  return window.PodOS ? new window.PodOS.PodOS() : new Error('PodOS missing');
};
