import { useEffect, useState } from 'react';
import axios from 'axios';
import { Loader2, Eye } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';

export default function HistoryPage() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/estimate/history')
      .then(res => setHistory(res.data))
      .catch(() => setError('Failed to fetch estimate history'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="p-6 max-w-3xl mx-auto bg-gray-100 min-h-screen rounded-2xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10">Estimate History</h1>

      {loading ? (
        <div className="flex justify-center items-center text-gray-600">
          <Loader2 className="animate-spin mr-2" /> Loading history...
        </div>
      ) : error ? (
        <div className="text-red-600 text-center">{error}</div>
      ) : history.length === 0 ? (
        <div className="text-gray-600 text-center">No history found.</div>
      ) : (
        <div className="space-y-4">
          {history.map(item => (
            <Card key={item.id} className="bg-white border border-gray-200">
              <CardContent className="flex items-center justify-between p-4">
                <div>
                  <div className="font-semibold text-lg text-gray-800">
                    Estimate #{item.id}
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(item.timestamp).toLocaleString()}<br/>
                    Total: ${item.totalCost.toFixed(2)}
                  </div>
                </div>
                <Link to={`/history/${item.id}`}>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Eye className="w-4 h-4 mr-2" /> Details
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
