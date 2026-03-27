import { FormEvent, useEffect, useState } from 'react';
import { SiteEvaluation, createDefaultCategories } from '../types';
import { calculateWeightedScore, getRecommendationTier, getScoreColor } from '../utils/scoring';

type ScoreFormProps = {
  siteId: string;
  initialEvaluation?: SiteEvaluation;
  onSave: (evaluation: SiteEvaluation) => void;
};

export function ScoreForm({ siteId, initialEvaluation, onSave }: ScoreFormProps): JSX.Element {
  const [evaluation, setEvaluation] = useState<SiteEvaluation>(
    initialEvaluation ?? {
      siteId,
      categories: createDefaultCategories(),
      overallRecommendation: '',
      summaryParagraph: ''
    }
  );

  useEffect(() => {
    if (initialEvaluation) {
      setEvaluation(initialEvaluation);
      return;
    }

    setEvaluation({
      siteId,
      categories: createDefaultCategories(),
      overallRecommendation: '',
      summaryParagraph: ''
    });
  }, [siteId, initialEvaluation]);

  const updateCategory = (id: string, field: 'score' | 'comments', value: string) => {
    setEvaluation((prev) => ({
      ...prev,
      categories: prev.categories.map((category) =>
        category.id === id
          ? {
              ...category,
              [field]: field === 'score' ? Number(value) : value
            }
          : category
      )
    }));
  };

  const compositeScore = calculateWeightedScore(evaluation.categories);
  const derivedRecommendation = evaluation.overallRecommendation || getRecommendationTier(compositeScore);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onSave({ ...evaluation, siteId, overallRecommendation: derivedRecommendation });
  };

  return (
    <form className="panel page-stack" onSubmit={handleSubmit}>
      <h2>Score Site</h2>
      {evaluation.categories.map((category) => (
        <div className="score-row" key={category.id}>
          <div className="score-header">
            <strong>{category.label}</strong>
            <small className="muted">Weight: {Math.round(category.weight * 100)}%</small>
          </div>
          <label>
            <span>Score (1-5)</span>
            <select value={category.score} onChange={(event) => updateCategory(category.id, 'score', event.target.value)}>
              {[1, 2, 3, 4, 5].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
            </select>
          </label>
          <label>
            <span>Comments</span>
            <textarea rows={2} value={category.comments} onChange={(event) => updateCategory(category.id, 'comments', event.target.value)} />
          </label>
        </div>
      ))}
      <label>
        <span>Overall Recommendation</span>
        <input
          value={evaluation.overallRecommendation}
          placeholder={derivedRecommendation}
          onChange={(event) => setEvaluation((prev) => ({ ...prev, overallRecommendation: event.target.value }))}
        />
      </label>
      <label>
        <span>Summary Paragraph</span>
        <textarea
          rows={4}
          required
          value={evaluation.summaryParagraph}
          onChange={(event) => setEvaluation((prev) => ({ ...prev, summaryParagraph: event.target.value }))}
        />
      </label>
      <div className="score-total" style={{ borderColor: getScoreColor(Math.round(compositeScore)) }}>
        <span className="score-label">Weighted Total</span>
        <strong>{compositeScore.toFixed(2)} / 5.00</strong>
      </div>
      <div className="form-actions">
        <button type="submit">Save Evaluation</button>
      </div>
    </form>
  );
}
