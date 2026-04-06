import "./FeaturePlaceholder.css";

const FeaturePlaceholder = ({ eyebrow, title, description }) => {
  return (
    <section className="feature-placeholder">
      <div className="feature-placeholder__panel">
        <p className="feature-placeholder__eyebrow">{eyebrow}</p>
        <h1 className="feature-placeholder__title">{title}</h1>
        <p className="feature-placeholder__text">{description}</p>
      </div>
    </section>
  );
};

export default FeaturePlaceholder;
