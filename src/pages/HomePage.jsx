import { useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Loader2, AlertTriangle, PlusCircle, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

const resourceTypes = ['Compute', 'Storage', 'Database'];

export default function HomePage() {
  const [resources, setResources] = useState([
    { type: '', name: '', region: '', units: '', names: [], regions: [], loadingNames: false, loadingRegions: false }
  ]);

  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (index, key, value) => {
    const updated = [...resources];
    updated[index][key] = value;

    // Reset dependent fields if type or name changes
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
            setResources([...updated]); // trigger re-render
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
            setResources([...updated]); // trigger re-render
        });
    }

    if (key !== 'type' && key !== 'name') {
        setResources(updated);
    }
  };


  const handleAddResource = () => {
    setResources([...resources, { type: '', name: '', region: '', units: '', names: [], regions: [], loadingNames: false, loadingRegions: false }]);
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
        <Card key={idx}>
          <CardContent className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Resource Type</label>
              <select
                value={resource.type}
                onChange={e => handleChange(idx, 'type', e.target.value)}
                className="p-2 border rounded w-full"
              >
                <option value="">-- Select Type --</option>
                {resourceTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {resource.loadingNames ? (
              <div className="text-gray-500 text-sm">Loading resource names...</div>
            ) : resource.names.length > 0 ? (
              <div>
                <label className="block font-semibold mb-1">Resource Name</label>
                <select
                  value={resource.name}
                  onChange={e => handleChange(idx, 'name', e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="">-- Select Name --</option>
                  {resource.names.map(name => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </select>
              </div>
            ) : resource.type && <div className="text-sm text-yellow-600">No resources available for selected type.</div>}

            {resource.loadingRegions ? (
              <div className="text-gray-500 text-sm">Loading regions...</div>
            ) : resource.regions.length > 0 ? (
              <div>
                <label className="block font-semibold mb-1">Region</label>
                <select
                  value={resource.region}
                  onChange={e => handleChange(idx, 'region', e.target.value)}
                  className="p-2 border rounded w-full"
                >
                  <option value="">-- Select Region --</option>
                  {resource.regions.map(region => (
                    <option key={region} value={region}>{region}</option>
                  ))}
                </select>
              </div>
            ) : resource.name && <div className="text-sm text-yellow-600">No regions available for selected resource.</div>}

            <div>
              <label className="block font-semibold mb-1">Units</label>
              <Input
                type="number"
                min="1"
                value={resource.units}
                onChange={e => handleChange(idx, 'units', e.target.value)}
                placeholder="Number of units"
              />
            </div>

            {resources.length > 1 && (
              <Button onClick={() => handleRemoveResource(idx)} className="bg-red-500 hover:bg-red-600">
                <Trash2 className="mr-2 h-4 w-4" /> Remove Resource
              </Button>
            )}
          </CardContent>
        </Card>
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

      {result && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mt-6 border-t pt-6"
        >
          <h2 className="text-2xl font-semibold mb-4">Cost Estimate</h2>
          <div className="space-y-4">
            {result.breakdown.map((item, index) => (
              <Card key={index}>
                <CardContent className="p-4">
                  <div className="flex justify-between font-medium">
                    <span>{item.type} - {item.name}</span>
                    <span>${item.cost.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    Region: {item.region} | {item.units} units x ${item.unitCost.toFixed(2)} per unit
                  </p>
                </CardContent>
              </Card>
            ))}
            <div className="text-right text-xl font-bold">
              Total: ${result.totalCost.toFixed(2)}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
