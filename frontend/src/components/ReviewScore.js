import React from "react";
import {
  StarRate as StarRateIcon,
  StarHalf as StarHalfIcon,
  StarOutline as StarOutlineIcon,
} from "@mui/icons-material";

const ReviewScore = ({ value, text }) => {
  return (
    <div className="review-score" style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
      <div style={{ display: 'flex' }}>
        <span>
          {value >= 1 ? (
            <StarRateIcon />
          ) : value >= 0.5 ? (
            <StarHalfIcon />
          ) : (
            <StarOutlineIcon />
          )}
        </span>
        <span>
          {value >= 2 ? (
            <StarRateIcon />
          ) : value >= 1.5 ? (
            <StarHalfIcon />
          ) : (
            <StarOutlineIcon />
          )}
        </span>
        <span>
          {value >= 3 ? (
            <StarRateIcon />
          ) : value >= 2.5 ? (
            <StarHalfIcon />
          ) : (
            <StarOutlineIcon />
          )}
        </span>
        <span>
          {value >= 4 ? (
            <StarRateIcon />
          ) : value >= 3.5 ? (
            <StarHalfIcon />
          ) : (
            <StarOutlineIcon />
          )}
        </span>
        <span>
          {value >= 5 ? (
            <StarRateIcon />
          ) : value >= 4.5 ? (
            <StarHalfIcon />
          ) : (
            <StarOutlineIcon />
          )}
        </span>
      </div>
      {text && (
        <span className="review-score-text">
          {text}
        </span>
      )}
    </div>
  );
};

export default ReviewScore;
