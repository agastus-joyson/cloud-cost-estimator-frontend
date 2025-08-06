import { useEffect, useState } from 'react';
import axios from 'axios';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent } from '../components/ui/card';
import { Loader2, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function HomePage() {
  const [regions, setRegions] = useState([]);
  const [region, setRegion] = useState('');
  const [resources, setResources] = useState([]);
  const [selectedResources, setSelectedResources] = useState([]);
  const [result, setResult] = useState(null);

  const [loadingRegions, setLoadingRegions] = useState(false);
  const [loadingResources, setLoadingResources] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch regions on load
  useEffect(() => {
    setLoadingRegions(true);
    axios.get('http://localhost:8080/api/pricing/regions')
      .then(res => setRegions(res.data))
      .catch(() => setError('Failed to load regions'))
      .finally(() => setLoadingRegions(false));
  }, []);

  // Fetch resources when region changes
  useEffect(() => {
    if (!region) return;
    setLoadingResources(true);
    axios.get(`http://localhost:8080/api/pricing/resources?region=${region}`)
      .then(res => setResources(res.data))
      .catch(() => setError('Failed to load resources'))
      .finally(() => setLoadingResources(false));
  }, [region]);

  const handleResourceChange = (type, units) => {
    setSelectedResources(prev => {
      const updated = [...prev];
      const idx = updated.findIndex(r => r.type === type);
      if (units === '' || isNaN(units) || units <= 0) {
        return updated.filter(r => r.type !== type);
      }
      if (idx > -1) {
        updated[idx].units = parseInt(units);
      } else {
        updated.push({ type, units: parseInt(units) });
      }
      return updated;
    });
  };

  const handleSubmit = () => {
    setSubmitting(true);
    setError(null);
    setResult(null);
    axios.post('http://localhost:8080/api/estimate', {
      region,
      resources: selectedResources,
    })
      .then(res => setResult(res.data))
      .catch(() => setError('Failed to get estimate'))
      .finally(() => setSubmitting(false));
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Cloud Cost Estimator</h1>

      {loadingRegions ? (
        <div className="flex items-center gap-2 text-gray-500">
          <Loader2 className="animate-spin" /> Loading regions...
        </div>
      ) : error ? (
        <div className="flex items-center gap-2 text-red-600">
          <AlertTriangle /> {error}
        </div>
      ) : (
        <div className="mb-6">
          <label className="block mb-1 font-semibold">Select Region</label>
          <select
            value={region}
            onChange={e => setRegion(e.target.value)}
            className="p-2 border rounded w-full"
          >
            <option value="">-- Select Region --</option>
            {regions.map(r => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>
      )}

      {region && (
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Select Resources</h2>
          {loadingResources ? (
            <div className="flex items-center gap-2 text-gray-500">
              <Loader2 className="animate-spin" /> Loading resources...
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {resources.map((resType) => (
                <Card key={resType}>
                  <CardContent className="p-4">
                    <label className="block font-medium mb-1">{resType}</label>
                    <Input
                      type="number"
                      min="0"
                      placeholder="Number of units"
                      onChange={(e) => handleResourceChange(resType, e.target.value)}
                    />
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}

      {region && resources.length > 0 && (
        <div className="mb-6">
          <Button onClick={handleSubmit} disabled={submitting || selectedResources.length === 0}>
            {submitting ? <Loader2 className="animate-spin mr-2" /> : null}
            Get Estimate
          </Button>
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
            {result.breakdown.map(item => (
              <Card key={item.type}>
                <CardContent className="p-4">
                  <div className="flex justify-between">
                    <span className="font-medium">{item.type}</span>
                    <span>${item.cost.toFixed(2)}</span>
                  </div>
                  <p className="text-sm text-gray-600">
                    {item.units} units x ${item.unitCost.toFixed(2)} per unit
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
