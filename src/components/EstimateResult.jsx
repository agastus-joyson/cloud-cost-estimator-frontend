import { Card, CardContent } from './ui/card';
import { motion } from 'framer-motion';

export default function EstimateResult({ result }) {
  return (
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
  );
}
