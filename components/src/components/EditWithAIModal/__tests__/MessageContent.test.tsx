import { render, screen } from '@testing-library/react';
import { MessageContent } from '../MessageContent';

describe('MessageContent', () => {
  it('renders markdown content correctly', () => {
    const markdownContent =
      '# Hello World\n\nThis is a **test** with some *italic* text.';

    render(<MessageContent markdown={markdownContent} />);

    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toHaveTextContent('Hello World');
    expect(screen.getByText('test')).toBeInTheDocument();
    expect(screen.getByText('italic')).toBeInTheDocument();
  });

  it('returns null when no markdown is provided', () => {
    const { container } = render(<MessageContent />);
    expect(container.firstChild).toBeNull();
  });

  it('renders children when provided', () => {
    const markdownContent = '# Hello World';

    render(
      <MessageContent markdown={markdownContent}>
        <div data-testid="child-content">Child content</div>
      </MessageContent>,
    );

    expect(
      screen.getByRole('heading', { level: 1 }),
    ).toHaveTextContent('Hello World');
    expect(
      screen.getByTestId('child-content'),
    ).toHaveTextContent('Child content');
  });
});
