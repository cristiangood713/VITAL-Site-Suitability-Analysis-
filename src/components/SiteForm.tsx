import { FormEvent, useMemo, useState } from 'react';
import { calculateCompositeScore, getDefaultScores } from '../storage';
import { RecommendationStatus, Site, SiteScores } from '../types';

type SiteFormProps = {
  initialSite?: Site;
  onSave: (site: Site) => void;
  onCancel?: () => void;
};

type FieldErrors = Partial<Record<'address' | 'city' | 'sizeSF' | 'rentNRSF' | 'estNNN', string>>;

type SiteFormState = Omit<Site, 'sizeSF' | 'rentNRSF' | 'estNNN' | 'compositeScore'> & {
  sizeSF: string;
  rentNRSF: string;
  estNNN: string;
};

const recommendationOptions: RecommendationStatus[] = ['Pending', 'Pursue', 'Pass', 'On Hold', 'LOI Submitted'];

const createEmptySiteState = (): SiteFormState => ({
  id: '',
  address: '',
  city: '',
  submarket: '',
  sizeSF: '',
  rentNRSF: '',
  estNNN: '',
  landlord: '',
  buildingType: '',
  keyPhysicalFeatures: '',
  coTenants: '',
  notes: '',
  scores: getDefaultScores(),
  recommendation: 'Pending'
});

const fromSite = (site: Site): SiteFormState => ({
  ...site,
  sizeSF: site.sizeSF > 0 ? String(site.sizeSF) : '',
  rentNRSF: site.rentNRSF > 0 ? String(site.rentNRSF) : '',
  estNNN: site.estNNN > 0 ? String(site.estNNN) : ''
});

const scoreCriteria: Array<{ key: keyof SiteScores; label: string; weight: number }> = [
  { key: 'locationVisibility', label: 'Location & Visibility', weight: 25 },
  { key: 'parkingAccess', label: 'Parking & Access', weight: 20 },
  { key: 'buildingCondition', label: 'Building Condition', weight: 20 },
  { key: 'coTenancyQuality', label: 'Co-tenancy Quality', weight: 20 },
  { key: 'rentToMarketRatio', label: 'Rent-to-Market Ratio', weight: 15 }
];

export function SiteForm({ initialSite, onSave, onCancel }: SiteFormProps): JSX.Element {
  const [site, setSite] = useState<SiteFormState>(initialSite ? fromSite(initialSite) : createEmptySiteState());
  const [errors, setErrors] = useState<FieldErrors>({});
  const formTitle = useMemo(() => (initialSite ? 'Edit Site' : 'Add Site'), [initialSite]);

  const updateField = (field: keyof SiteFormState, value: string | SiteScores | RecommendationStatus) => {
    setSite((prev) => ({ ...prev, [field]: value }));
  };

  const updateScore = (field: keyof SiteScores, value: string) => {
    setSite((prev) => ({
      ...prev,
      scores: {
        ...prev.scores,
        [field]: Number(value) as SiteScores[typeof field]
      }
    }));
  };

  const validate = (): FieldErrors => {
    const nextErrors: FieldErrors = {};

    if (!site.address.trim()) {
      nextErrors.address = 'Address is required.';
    }

    if (!site.city.trim()) {
      nextErrors.city = 'City is required.';
    }

    if (site.sizeSF && Number(site.sizeSF) < 0) {
      nextErrors.sizeSF = 'Size SF cannot be negative.';
    }

    if (site.rentNRSF && Number(site.rentNRSF) < 0) {
      nextErrors.rentNRSF = 'Rent $/NRSF cannot be negative.';
    }

    if (site.estNNN && Number(site.estNNN) < 0) {
      nextErrors.estNNN = 'NNN $/SF cannot be negative.';
    }

    return nextErrors;
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate();
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      return;
    }

    const id = site.id || `${site.city.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`;
    const sizeSF = site.sizeSF ? Number(site.sizeSF) : 0;
    const rentNRSF = site.rentNRSF ? Number(site.rentNRSF) : 0;
    const estNNN = site.estNNN ? Number(site.estNNN) : 0;
    const compositeScore = calculateCompositeScore(site.scores);

    onSave({
      ...site,
      id,
      sizeSF,
      rentNRSF,
      estNNN,
      compositeScore
    });

    if (!initialSite) {
      setSite(createEmptySiteState());
      setErrors({});
    }
  };

  const compositePreview = calculateCompositeScore(site.scores);

  return (
    <form className="panel site-form page-stack" onSubmit={handleSubmit}>
      <h2>{formTitle}</h2>
      <div className="grid-2">
        <label>
          <span>Address</span>
          <input value={site.address} onChange={(event) => updateField('address', event.target.value)} />
          {errors.address && <small className="field-error">{errors.address}</small>}
        </label>
        <label>
          <span>City</span>
          <input value={site.city} onChange={(event) => updateField('city', event.target.value)} />
          {errors.city && <small className="field-error">{errors.city}</small>}
        </label>
        <label>
          <span>Submarket</span>
          <input value={site.submarket} onChange={(event) => updateField('submarket', event.target.value)} />
        </label>
        <label>
          <span>Building Type</span>
          <input value={site.buildingType} onChange={(event) => updateField('buildingType', event.target.value)} />
        </label>
        <label>
          <span>Size (SF)</span>
          <input
            type="number"
            min={0}
            placeholder="e.g. 24500"
            value={site.sizeSF}
            onChange={(event) => updateField('sizeSF', event.target.value)}
          />
          {errors.sizeSF && <small className="field-error">{errors.sizeSF}</small>}
        </label>
        <label>
          <span>Rent ($/NRSF)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 4.00"
            value={site.rentNRSF}
            onChange={(event) => updateField('rentNRSF', event.target.value)}
          />
          {errors.rentNRSF && <small className="field-error">{errors.rentNRSF}</small>}
        </label>
        <label>
          <span>NNN ($/SF)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            placeholder="e.g. 0.50"
            value={site.estNNN}
            onChange={(event) => updateField('estNNN', event.target.value)}
          />
          {errors.estNNN && <small className="field-error">{errors.estNNN}</small>}
        </label>
        <label>
          <span>Landlord</span>
          <input value={site.landlord} onChange={(event) => updateField('landlord', event.target.value)} />
        </label>
      </div>
      <label>
        <span>Key Physical Features</span>
        <textarea rows={3} value={site.keyPhysicalFeatures} onChange={(event) => updateField('keyPhysicalFeatures', event.target.value)} />
      </label>
      <label>
        <span>Co-Tenants</span>
        <textarea rows={3} value={site.coTenants} onChange={(event) => updateField('coTenants', event.target.value)} />
      </label>
      <label>
        <span>Notes</span>
        <textarea rows={4} value={site.notes} onChange={(event) => updateField('notes', event.target.value)} />
      </label>

      <section className="page-stack">
        <h3>Site Scoring</h3>
        <div className="grid-2">
          {scoreCriteria.map((criterion) => (
            <label key={criterion.key}>
              <span>
                {criterion.label} ({criterion.weight}%)
              </span>
              <select value={site.scores[criterion.key]} onChange={(event) => updateScore(criterion.key, event.target.value)}>
                {[1, 2, 3, 4, 5].map((value) => (
                  <option key={value} value={value}>
                    {value}
                  </option>
                ))}
              </select>
            </label>
          ))}
        </div>
        <div className="score-total">
          <span className="score-label">Composite Score</span>
          <strong>{compositePreview.toFixed(2)} / 100</strong>
        </div>
      </section>

      <label>
        <span>Recommendation</span>
        <select
          value={site.recommendation}
          onChange={(event) => updateField('recommendation', event.target.value as RecommendationStatus)}
        >
          {recommendationOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <div className="form-actions">
        <button type="submit">Save Site</button>
        {onCancel && (
          <button type="button" className="button-ghost" onClick={onCancel}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
