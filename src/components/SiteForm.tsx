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
    <form className="panel site-form" onSubmit={handleSubmit}>
      <h2>{formTitle}</h2>
      <div className="grid-2">
        <label>
          Address
          <input required value={site.address} onChange={(event) => updateField('address', event.target.value)} />
        </label>
        <label>
          City
          <input required value={site.city} onChange={(event) => updateField('city', event.target.value)} />
        </label>
        <label>
          Submarket
          <input required value={site.submarket} onChange={(event) => updateField('submarket', event.target.value)} />
        </label>
        <label>
          Building Type
          <input required value={site.buildingType} onChange={(event) => updateField('buildingType', event.target.value)} />
        </label>
        <label>
          Size (SF)
          <input type="number" min={0} required value={site.sizeSF} onChange={(event) => updateField('sizeSF', Number(event.target.value))} />
        </label>
        <label>
          Rent (NR/SF)
          <input type="number" min={0} step="0.01" required value={site.rentNRSF} onChange={(event) => updateField('rentNRSF', Number(event.target.value))} />
        </label>
        <label>
          Est. NNN
          <input type="number" min={0} step="0.01" required value={site.estNNN} onChange={(event) => updateField('estNNN', Number(event.target.value))} />
        </label>
        <label>
          Landlord
          <input required value={site.landlord} onChange={(event) => updateField('landlord', event.target.value)} />
        </label>
      </div>
      <label>
        Key Physical Features
        <textarea required rows={3} value={site.keyPhysicalFeatures} onChange={(event) => updateField('keyPhysicalFeatures', event.target.value)} />
      </label>
      <label>
        Co-Tenants
        <textarea required rows={3} value={site.coTenants} onChange={(event) => updateField('coTenants', event.target.value)} />
      </label>
      <label>
        Notes
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
