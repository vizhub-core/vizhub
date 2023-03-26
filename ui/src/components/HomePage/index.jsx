import { Header } from '../Header';
import '../index.scss';
import './home-page.scss';

export const HomePage = (props) => {
  return (
    <div className="vh-page vh-home-page">
      <Header {...props} />
      Join the waitlist
    </div>
  );
};
