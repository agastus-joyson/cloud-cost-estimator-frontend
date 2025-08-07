import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { Loader2, AlertTriangle, ArrowLeft } from 'lucide-react'; 
import { Card, CardContent } from '../components/ui/card';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';

const COLORS = ["#4F46E5", "#22C55E", "#E11D48", "#F59E0B", "#10B981"];

export default function DetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate(); 
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get(`http://localhost:8080/api/estimate/details?id=${id}`)
      .then(res => setDetails(res.data))
      .catch(() => setError('Failed to load estimate details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen text-red-600">
        <AlertTriangle className="w-6 h-6 mr-2" /> {error}
      </div>
    );
  }

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 min-h-screen rounded-2xl">
      <button
        onClick={() => navigate('/history')}
        className="mb-4 flex items-center text-blue-600 hover:underline"
      >
        <ArrowLeft className="w-5 h-5 mr-1" />
        Back to History
      </button>

      <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">Estimate Details</h1>

      <Card className="mb-6">
        <CardContent>
          <p><span className="font-semibold">Estimate ID:</span> {details.id}</p>
          <p><span className="font-semibold">Timestamp:</span> {new Date(details.timestamp).toLocaleString()}</p>
          <p><span className="font-semibold">Total Cost:</span> ${details.totalCost.toFixed(2)}</p>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          {details.items.map((item, index) => (
            <Card key={index} className="mb-4">
              <CardContent>
                <div className="font-medium flex justify-between">
                  <span>{item.type} - {item.name}</span>
                  <span>${item.totalCost.toFixed(2)}</span>
                </div>
                <p className="text-sm text-gray-600">
                  Region: {item.region} | {item.units} units x ${item.unitCost.toFixed(2)} per unit
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="bg-white rounded-lg shadow p-4">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Cost Breakdown</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={details.items}
                dataKey="totalCost"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              >
                {details.items.map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${value.toFixed(2)}`} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
