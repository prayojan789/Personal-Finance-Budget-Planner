import React from 'react';
import { useSmartFeatures } from '../../context/SmartFeaturesContext';
import BudgetPredictions from '../charts/BudgetPredictions';
import SmartInsights from '../charts/SmartInsights';
import './../SmartDashboard.css';

const SmartDashboard = () => {
  const smartFeatures = useSmartFeatures();

  const {
    budgetPredictions,
    insights,
    unusualTransactions,
    suggestions,
    spendingVelocity,
    criticalWarnings,
    highPrioritySuggestions,
  } = smartFeatures;

  return (
    <div className="smart-dashboard">
      {/* Critical Warnings */}
      {criticalWarnings && criticalWarnings.length > 0 && (
        <div className="critical-warnings">
          <div className="warning-header">
            <span className="warning-icon">⚠️</span>
            <h3>Critical Budget Alerts</h3>
          </div>
          <div className="warnings-grid">
            {criticalWarnings.map((warning) => (
              <div key={warning.category} className="warning-card">
                <p className="warning-category">{warning.category}</p>
                <p className="warning-message">{warning.prediction}</p>
                <div className="warning-stats">
                  <span className="warning-stat">
                    {warning.daysUntilExceeded} days left
                  </span>
                  <span className="warning-stat">
                    ${Math.abs(warning.projectedRemaining).toFixed(2)}
                    {warning.projectedRemaining < 0 ? ' over' : ' remaining'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Spending Velocity */}
      {spendingVelocity && (
        <div className="spending-velocity">
          <div className="velocity-icon">💰</div>
          <div className="velocity-content">
            <h3>Spending Velocity</h3>
            <p className="velocity-message">{spendingVelocity.message}</p>
            <div className="velocity-details">
              <span>Total (30 days): ${spendingVelocity.totalSpent.toFixed(2)}</span>
            </div>
          </div>
        </div>
      )}

      {/* High Priority Suggestions */}
      {highPrioritySuggestions && highPrioritySuggestions.length > 0 && (
        <div className="high-priority-suggestions">
          <h3 className="suggestions-header">🎯 Action Items</h3>
          <div className="quick-actions">
            {highPrioritySuggestions.map((suggestion, idx) => (
              <div key={idx} className="action-item">
                <span className="action-icon">📌</span>
                <span className="action-text">{suggestion.action}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget Predictions */}
      <BudgetPredictions predictions={budgetPredictions} />

      {/* Smart Insights */}
      <SmartInsights
        insights={insights}
        anomalies={unusualTransactions}
        suggestions={suggestions}
      />
    </div>
  );
};

export default SmartDashboard;
