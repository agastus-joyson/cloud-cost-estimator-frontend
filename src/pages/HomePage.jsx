import { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Loader2, AlertTriangle, PlusCircle } from 'lucide-react';
import ResourceRow from '../components/ResourceRow';
import EstimateResult from '../components/EstimateResult';

const initialResource = () => ({
  type: '',
  name: '',
  region: '',
  units: '',
  names: [],
  regions: [],
  loadingNames: false,
  loadingRegions: false,
});

export default function HomePage() {
  const [resources, setResources] = useState([initialResource()]);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (index, key, value) => {
    const updated = [...resources];
    updated[index][key] = value;

    if (key === 'type') {
      updated[index].name = '';
      updated[index].region = '';
      updated[index].names = [];
      updated[index].regions = [];
      updated[index].loadingNames = true;

      axios
        .get(`http://localhost:8080/api/pricing/names?type=${value}`)
        .then(res => {
          updated[index].names = res.data;
        })
        .catch(() => {
          updated[index].names = [];
        })
        .finally(() => {
          updated[index].loadingNames = false;
          setResources([...updated]);
        });
    }

    if (key === 'name') {
      updated[index].region = '';
      updated[index].regions = [];
      updated[index].loadingRegions = true;

      axios
        .get(`http://localhost:8080/api/pricing/regions?type=${updated[index].type}&name=${value}`)
        .then(res => {
          updated[index].regions = res.data;
        })
        .catch(() => {
          updated[index].regions = [];
        })
        .finally(() => {
          updated[index].loadingRegions = false;
          setResources([...updated]);
        });
    }

    if (key !== 'type' && key !== 'name') {
      setResources(updated);
    }
  };

  const handleAddResource = () => {
    setResources([...resources, initialResource()]);
  };

  const handleRemoveResource = (index) => {
    const updated = [...resources];
    updated.splice(index, 1);
    setResources(updated);
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setError(null);
    setResult(null);

    const payload = {
      resources: resources.map(r => ({
        type: r.type,
        name: r.name,
        region: r.region,
        units: parseInt(r.units)
      }))
    };

    axios.post('http://localhost:8080/api/estimate', payload)
      .then(res => setResult(res.data))
      .catch(() => setError('Failed to get estimate'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cloud Cost Estimator</h1>

      {resources.map((resource, idx) => (
        <ResourceRow
          key={idx}
          index={idx}
          resource={resource}
          onChange={handleChange}
          onRemove={handleRemoveResource}
          canRemove={resources.length > 1}
        />
      ))}

      <div className="my-4">
        <Button onClick={handleAddResource} className="bg-green-600 hover:bg-green-700">
          <PlusCircle className="mr-2 h-4 w-4" /> Add Another Resource
        </Button>
      </div>

      <div className="mb-6">
        <Button onClick={handleSubmit} disabled={submitting || resources.some(r => !r.type || !r.name || !r.region || !r.units)}>
          {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
          Get Estimate
        </Button>
      </div>

      {error && (
        <div className="text-red-600 flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" /> {error}
        </div>
      )}

      {result && <EstimateResult result={result} />}
    </div>
  );
}
