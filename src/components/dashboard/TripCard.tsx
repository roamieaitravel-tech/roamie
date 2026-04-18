import Image from "next/image";
import { Calendar, DollarSign, Plane, Train, Ship } from "lucide-react";

interface TripCardProps {
  id: string;
  destination: string;
  country: string;
  startDate: string;
  endDate: string;
  budget: number;
  status: "planning" | "booked" | "ongoing";
  imageUrl: string;
  transportTypes: ("plane" | "train" | "ship")[];
  budgetUsed: number; // percentage
}

const statusConfig = {
  planning: { label: "Planning", color: "bg-gray-100 text-gray-700" },
  booked: { label: "Booked", color: "bg-green-100 text-green-700" },
  ongoing: { label: "Ongoing", color: "bg-orange-100 text-orange-700" },
};

const transportIcons = {
  plane: Plane,
  train: Train,
  ship: Ship,
};

export default function TripCard({
  destination,
  country,
  startDate,
  endDate,
  budget,
  status,
  imageUrl,
  transportTypes,
  budgetUsed,
}: TripCardProps) {
  const statusInfo = statusConfig[status];

  return (
    <div className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="relative h-48">
        <Image
          src={imageUrl}
          alt={destination}
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {/* Status badge */}
        <div className="absolute top-4 right-4">
          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusInfo.color}`}>
            {statusInfo.label}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-1">{destination}</h3>
        <p className="text-gray-600 text-sm mb-4">{country}</p>

        {/* Date */}
        <div className="flex items-center gap-2 mb-3">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">
            {startDate} - {endDate}
          </span>
        </div>

        {/* Budget */}
        <div className="flex items-center gap-2 mb-4">
          <DollarSign className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">${budget.toLocaleString()}</span>
        </div>

        {/* Transport types */}
        <div className="flex gap-2 mb-4">
          {transportTypes.map((type) => {
            const Icon = transportIcons[type];
            return (
              <div
                key={type}
                className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center"
              >
                <Icon className="w-4 h-4 text-gray-600" />
              </div>
            );
          })}
        </div>

        {/* Budget progress */}
        <div>
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Budget Used</span>
            <span className="text-gray-900 font-medium">{budgetUsed}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-[#FF6B35] h-2 rounded-full transition-all duration-300"
              style={{ width: `${budgetUsed}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}