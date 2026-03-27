import { FormEvent, useMemo, useState } from 'react';
import { Site } from '../types';

type SiteFormProps = {
  initialSite?: Site;
  onSave: (site: Site) => void;
  onCancel?: () => void;
};

const emptySite: Site = {
  id: '',
  address: '',
  city: '',
  submarket: '',
  sizeSF: 0,
  rentNRSF: 0,
  estNNN: 0,
  landlord: '',
  buildingType: '',
  keyPhysicalFeatures: '',
  coTenants: '',
  notes: ''
};

export function SiteForm({ initialSite, onSave, onCancel }: SiteFormProps): JSX.Element {
  const [site, setSite] = useState<Site>(initialSite ?? emptySite);
  const formTitle = useMemo(() => (initialSite ? 'Edit Site' : 'Add Site'), [initialSite]);

  const updateField = (field: keyof Site, value: string | number) => {
    setSite((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const id = site.id || `${site.city.toLowerCase()}-${Date.now()}`;
    onSave({ ...site, id });

    if (!initialSite) {
      setSite(emptySite);
    }
  };

  return (
    <form className="panel site-form page-stack" onSubmit={handleSubmit}>
      <h2>{formTitle}</h2>
      <div className="grid-2">
        <label>
          <span>Address</span>
          <input required value={site.address} onChange={(event) => updateField('address', event.target.value)} />
        </label>
        <label>
          <span>City</span>
          <input required value={site.city} onChange={(event) => updateField('city', event.target.value)} />
        </label>
        <label>
          <span>Submarket</span>
          <input required value={site.submarket} onChange={(event) => updateField('submarket', event.target.value)} />
        </label>
        <label>
          <span>Building Type</span>
          <input required value={site.buildingType} onChange={(event) => updateField('buildingType', event.target.value)} />
        </label>
        <label>
          <span>Size (SF)</span>
          <input type="number" min={0} required value={site.sizeSF} onChange={(event) => updateField('sizeSF', Number(event.target.value))} />
        </label>
        <label>
          <span>Rent (NR/SF)</span>
          <input type="number" min={0} step="0.01" required value={site.rentNRSF} onChange={(event) => updateField('rentNRSF', Number(event.target.value))} />
        </label>
        <label>
          <span>Est. NNN</span>
          <input type="number" min={0} step="0.01" required value={site.estNNN} onChange={(event) => updateField('estNNN', Number(event.target.value))} />
        </label>
        <label>
          <span>Landlord</span>
          <input required value={site.landlord} onChange={(event) => updateField('landlord', event.target.value)} />
        </label>
      </div>
      <label>
        <span>Key Physical Features</span>
        <textarea required rows={3} value={site.keyPhysicalFeatures} onChange={(event) => updateField('keyPhysicalFeatures', event.target.value)} />
      </label>
      <label>
        <span>Co-Tenants</span>
        <textarea required rows={3} value={site.coTenants} onChange={(event) => updateField('coTenants', event.target.value)} />
      </label>
      <label>
        <span>Notes</span>
        <textarea rows={4} value={site.notes} onChange={(event) => updateField('notes', event.target.value)} />
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
