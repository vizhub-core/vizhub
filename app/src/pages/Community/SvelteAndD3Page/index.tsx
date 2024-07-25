import './styles.scss';
import { Page, PageData } from '../../Page';

export type SvelteAndD3PageData = PageData;

export const SvelteAndD3Page: Page = ({
  pageData,
}: {
  pageData: SvelteAndD3PageData;
}) => {
  return <div>Test</div>;
};

SvelteAndD3Page.path = '/community/svelte-and-d3';
