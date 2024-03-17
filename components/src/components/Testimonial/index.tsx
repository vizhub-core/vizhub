import './styles.scss';
export const Testimonial = ({
  link,
  quote,
  name,
  title,
  association,
  headshotImgSrc,
  style = {},
}) => (
  <div className="vh-testimonial" style={style}>
    <img
      className="headshot"
      src={headshotImgSrc}
      alt={`Headshot of ${name}`}
    />
    <div className="quote">{quote}</div>
    <a href={link} className="author">
      <h4 className="name">— {name}</h4>
      <div className="title">{title}</div>
      <div className="title">{association}</div>
    </a>
  </div>
);
