import { Header } from './Header';
import { Footer } from './Footer';

interface LayoutProps {
  children: React.ReactNode;
  fullWidth?: boolean;
  hideFooter?: boolean;
}

export const PageLayout = ({
  children,
  fullWidth = false,
  hideFooter = false,
}: LayoutProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main
        className={`flex-grow pt-16 ${
          !fullWidth && 'container mx-auto px-4'
        }`}
      >
        {children}
      </main>
      {!hideFooter && <Footer />}
    </div>
  );
};
