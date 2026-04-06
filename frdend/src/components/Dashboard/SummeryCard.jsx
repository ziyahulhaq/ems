import React from "react";
import { Link } from "react-router-dom";
import "./DashboardSummary.css";

const SummeryCard = ({
  icon,
  text,
  number,
  iconColor = "#0f766e",
  iconBg = "#ecfeff",
  variant = "default",
  to,
}) => {
  const cardContent = (
    <>
      <div
        className="summary-card__icon"
        style={{ color: iconColor, background: iconBg }}
      >
        {icon}
      </div>

      <div className="summary-card__content">
        <p className="summary-card__label">{text}</p>
        <p className="summary-card__number">{number}</p>
      </div>
    </>
  );

  if (to) {
    return (
      <Link className={`summary-card summary-card--${variant} summary-card--link`} to={to}>
        {cardContent}
      </Link>
    );
  }

  return <div className={`summary-card summary-card--${variant}`}>{cardContent}</div>;
};

export default SummeryCard;
