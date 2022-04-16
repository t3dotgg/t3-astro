export const getSlugFromPath = (path: string): string => {
  return path.split("/").at(-1).replace(".md", "");
};
