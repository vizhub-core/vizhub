import './styles.scss';
export const Testimonial = ({ quote, name, title }) => (
  <div className="vh-testimonial">
    <div className="quote">{quote}</div>
    <div className="author">
      <div className="name">{name}</div>
      <div className="title">{title}</div>
    </div>
  </div>
);
