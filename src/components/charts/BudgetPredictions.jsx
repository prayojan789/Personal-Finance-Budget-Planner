import React from 'react';
import './../BudgetPrediction.css';

const BudgetPredictions = ({ predictions = [] }) => {
  if (!predictions || predictions.length === 0) {
    return null;
  }

  return (
    <div className="budget-predictions">
      <h3 className="predictions-title">📊 Budget Predictions</h3>
      <div className="predictions-grid">
        {predictions.map((prediction) => {
          const progressPercent = Math.min(
            (prediction.spent / prediction.budget) * 100,
            100
          );
          const projectedPercent = Math.min(
            (prediction.projectedSpending / prediction.budget) * 100,
            100
          );

          return (
            <div
              key={prediction.category}
              className={`prediction-card prediction-${prediction.status}`}
            >
              <div className="prediction-header">
                <h4 className="prediction-category">{prediction.category}</h4>
                <span className={`status-badge status-${prediction.severity}`}>
                  {prediction.status === 'will-exceed' && '⚠️ Will Exceed'}
                  {prediction.status === 'at-risk' && '⚡ At Risk'}
                  {prediction.status === 'on-track' && '✅ On Track'}
                </span>
              </div>

              <div className="budget-stats">
                <div className="stat-row">
                  <span className="stat-label">Current Spent:</span>
                  <span className="stat-value">
                    ${prediction.spent.toFixed(2)} / ${prediction.budget.toFixed(2)}
                  </span>
                </div>
                <div className="stat-row">
                  <span className="stat-label">Percentage Used:</span>
                  <span className={`stat-value ${prediction.percentageUsed > 80 ? 'text-warning' : ''}`}>
                    {prediction.percentageUsed.toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Current progress bar */}
              <div className="progress-section">
                <label className="progress-label">Current Month Progress</label>
                <div className="progress-bar">
                  <div
                    className={`progress-fill progress-${
                      prediction.percentageUsed > 80 ? 'warning' : 'info'
                    }`}
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Projected progress bar */}
              <div className="progress-section">
                <label className="progress-label">Projected by Month End</label>
                <div className="progress-bar">
                  <div
                    className={`progress-fill progress-${
                      projectedPercent > 100 ? 'danger' : 'success'
                    }`}
                    style={{ width: `${Math.min(projectedPercent, 100)}%` }}
                  />
                  {projectedPercent > 100 && (
                    <span className="overflow-indicator">
                      +{(projectedPercent - 100).toFixed(0)}%
                    </span>
                  )}
                </div>
              </div>

              {/* Prediction message */}
              {prediction.prediction && (
                <div className="prediction-message">
                  <p>{prediction.prediction}</p>
                </div>
              )}

              {/* Daily spending info */}
              <div className="daily-spending">
                <div className="info-item">
                  <span className="info-label">Daily Average:</span>
                  <span className="info-value">
                    ${prediction.avgDaily.toFixed(2)}/day
                  </span>
                </div>
                <div className="info-item">
                  <span className="info-label">Remaining Days:</span>
                  <span className="info-value">{prediction.daysRemaining}</span>
                </div>
                {prediction.daysUntilExceeded && (
                  <div className="info-item warning">
                    <span className="info-label">Days Until Exceeded:</span>
                    <span className="info-value">{prediction.daysUntilExceeded}</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BudgetPredictions;
