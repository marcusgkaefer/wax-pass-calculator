
import React, { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface PricingFormProps {
  locationSelected: boolean;
}

const PricingForm: React.FC<PricingFormProps> = ({ locationSelected }) => {
  const [passType, setPassType] = useState<string>("");
  const [package_, setPackage] = useState<string>("");
  const [service, setService] = useState<string>("");

  return (
    <div className="space-y-6 w-full max-w-xl mx-auto">
      <Select
        disabled={!locationSelected}
        onValueChange={setPassType}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your pass type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="unlimited">Unlimited Pass</SelectItem>
          <SelectItem value="prepaid">Prepaid Pass</SelectItem>
        </SelectContent>
      </Select>

      <Select
        disabled={!passType}
        onValueChange={setPackage}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your package" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="basic">Basic Package</SelectItem>
          <SelectItem value="premium">Premium Package</SelectItem>
        </SelectContent>
      </Select>

      <Select
        disabled={!package_}
        onValueChange={setService}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select your service" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="bikini">Bikini Line</SelectItem>
          <SelectItem value="brazilian">Brazilian</SelectItem>
        </SelectContent>
      </Select>

      {service && (
        <Card className="p-6 bg-purple-50">
          <h3 className="text-lg font-semibold text-purple-900 mb-2">Pricing Summary</h3>
          <p className="text-purple-700">Starting from $XX.XX per month</p>
          <p className="text-sm text-purple-600 mt-2">
            *Final pricing may vary based on location and selected options
          </p>
        </Card>
      )}
    </div>
  );
};

export default PricingForm;
