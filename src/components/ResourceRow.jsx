import { Input } from './ui/input';
import { Button } from './ui/button';
import { Card, CardContent } from './ui/card';
import { Trash2 } from 'lucide-react';

const resourceTypes = ['Compute', 'Storage', 'Database'];

export default function ResourceRow({ index, resource, onChange, onRemove, canRemove }) {
  return (
    <Card className="bg-white border border-gray-200 shadow-sm mt-6">
      <CardContent className="space-y-5">
        <div>
          <label className="block font-semibold mb-1">Resource Type</label>
          <select
            value={resource.type}
            onChange={e => onChange(index, 'type', e.target.value)}
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
              onChange={e => onChange(index, 'name', e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">-- Select Name --</option>
              {resource.names.map(name => (
                <option key={name} value={name}>{name}</option>
              ))}
            </select>
          </div>
        ) : resource.type && (
          <div className="text-sm text-yellow-600">No resources available for selected type.</div>
        )}

        {resource.loadingRegions ? (
          <div className="text-gray-500 text-sm">Loading regions...</div>
        ) : resource.regions.length > 0 ? (
          <div>
            <label className="block font-semibold mb-1">Region</label>
            <select
              value={resource.region}
              onChange={e => onChange(index, 'region', e.target.value)}
              className="p-2 border rounded w-full"
            >
              <option value="">-- Select Region --</option>
              {resource.regions.map(region => (
                <option key={region} value={region}>{region}</option>
              ))}
            </select>
          </div>
        ) : resource.name && (
          <div className="text-sm text-yellow-600">No regions available for selected resource.</div>
        )}

        <div>
          <label className="block font-semibold mb-1">Units</label>
          <Input
            type="number"
            min="1"
            value={resource.units}
            onChange={e => onChange(index, 'units', e.target.value)}
            placeholder="Number of units"
          />
        </div>

        <div className="flex justify-end">
            {canRemove && (
                <Button onClick={() => onRemove(index)} className="bg-red-600 hover:bg-red-700">
                <Trash2 className="mr-2 h-4 w-4" /> Remove Resource
                </Button>
            )}
        </div>
      </CardContent>
    </Card>
  );
}
