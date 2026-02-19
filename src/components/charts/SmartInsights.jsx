import React from 'react';
import './../SmartInsights.css';

const SmartInsights = ({ insights = [], anomalies = [], suggestions = [] }) => {
  if (
    (!insights || insights.length === 0) &&
    (!anomalies || anomalies.length === 0) &&
    (!suggestions || suggestions.length === 0)
  ) {
    return null;
  }

  return (
    <div className="smart-insights-container">
      {/* Anomaly Detection */}
      {anomalies && anomalies.length > 0 && (
        <div className="insights-section anomalies-section">
          <h3 className="section-title">🔍 Unusual Transactions</h3>
          <div className="anomalies-list">
            {anomalies.slice(0, 5).map((anomaly, idx) => (
              <div key={idx} className="anomaly-item">
                <div className="anomaly-header">
                  <span className="anomaly-category">{anomaly.category}</span>
                  <span className="anomaly-severity">
                    {anomaly.anomalyScore.toFixed(1)}σ
                  </span>
                </div>
                <p className="anomaly-message">{anomaly.message}</p>
                <div className="anomaly-details">
                  <span className="detail-badge">
                    ${Math.abs(anomaly.transaction.amount).toFixed(2)}
                  </span>
                  <span className="detail-date">
                    {new Date(anomaly.transaction.date).toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
            {anomalies.length > 5 && (
              <p className="more-items">+{anomalies.length - 5} more unusual transactions</p>
            )}
          </div>
        </div>
      )}

      {/* Spending Insights */}
      {insights && insights.length > 0 && (
        <div className="insights-section insights-section">
          <h3 className="section-title">💡 Spending Insights</h3>
          <div className="insights-list">
            {insights.map((insight, idx) => (
              <div key={idx} className={`insight-card insight-${insight.type}`}>
                <div className="insight-header">
                  <h4 className="insight-title">
                    {insight.type === 'highest-spending' && '📊'}
                    {insight.type === 'spending-trend' && '📈'}
                    {insight.type === 'top-merchants' && '🏪'}
                    {' '}
                    {insight.title}
                  </h4>
                  <span className={`severity-badge severity-${insight.severity}`}>
                    {insight.severity.toUpperCase()}
                  </span>
                </div>
                <p className="insight-message">{insight.message}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Smart Suggestions */}
      {suggestions && suggestions.length > 0 && (
        <div className="insights-section suggestions-section">
          <h3 className="section-title">💬 Smart Suggestions</h3>
          <div className="suggestions-list">
            {suggestions.slice(0, 4).map((suggestion, idx) => (
              <div key={idx} className={`suggestion-item suggestion-${suggestion.priority}`}>
                <div className="suggestion-icon">
                  {suggestion.priority === 'high' && '⚠️'}
                  {suggestion.priority === 'medium' && '💡'}
                  {suggestion.priority === 'low' && 'ℹ️'}
                </div>
                <div className="suggestion-content">
                  <h4 className="suggestion-action">{suggestion.action}</h4>
                  <p className="suggestion-text">{suggestion.suggestion}</p>
                  {suggestion.estimatedReduction > 0 && (
                    <p className="suggestion-impact">
                      Reduce by ${suggestion.estimatedReduction.toFixed(2)} to stay on budget
                    </p>
                  )}
                </div>
              </div>
            ))}
            {suggestions.length > 4 && (
              <p className="more-suggestions">
                +{suggestions.length - 4} more suggestions available
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SmartInsights;
