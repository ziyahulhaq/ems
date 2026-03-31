import React from "react";
import "./DashboardSummary.css";

const SummeryCard = ({
  icon,
  text,
  number,
  iconColor = "#0f766e",
  iconBg = "#ecfeff",
  variant = "default",
}) => {
  return (
    <div className={`summary-card summary-card--${variant}`}>
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
    </div>
  );
};

export default SummeryCard;
