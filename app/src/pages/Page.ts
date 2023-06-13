// TODO fill in the types for this to remove `any` types.
export type Page = {
  // The component that renders this page (isomorphic).
  (props: { pageData: any }): JSX.Element;

  // A server-side-only async function that returns the data for this page.
  getPageData?: (any) => Promise<any>;

  // The path to this page, with parameters.
  // e.g. '/:userName/:id';
  path: string;
};
