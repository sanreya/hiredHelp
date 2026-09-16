import React from 'react';
import { RequestStatus } from '../../types';
import { cn } from '../../utils/cn';

interface StatusBadgeProps {
  status: RequestStatus;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const getStatusConfig = (s: RequestStatus) => {
    switch (s) {
      case 'OPEN':
        return { label: 'Open', classes: 'bg-emerald-100 text-emerald-800' };
      case 'REQUESTED':
        return { label: 'Requested', classes: 'bg-blue-100 text-blue-800' };
      case 'ACCEPTED':
        return { label: 'Accepted', classes: 'bg-indigo-100 text-indigo-800' };
      case 'TECHNICIAN_ARRIVED':
        return { label: 'Arrived', classes: 'bg-purple-100 text-purple-800' };
      case 'IN_PROGRESS':
        return { label: 'In Progress', classes: 'bg-amber-100 text-amber-800' };
      case 'COMPLETED':
        return { label: 'Completed', classes: 'bg-slate-100 text-slate-800' };
      case 'CANCELLED':
        return { label: 'Cancelled', classes: 'bg-red-100 text-red-800' };
      case 'DELAYED':
        return { label: 'Delayed', classes: 'bg-orange-100 text-orange-800' };
      case 'REOPENED':
        return { label: 'Reopened', classes: 'bg-cyan-100 text-cyan-800' };
      case 'REJECTED':
        return { label: 'Rejected', classes: 'bg-red-100 text-red-800' };
      default:
        return { label: s, classes: 'bg-slate-100 text-slate-800' };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={cn('inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium', config.classes, className)}>
      {config.label}
    </span>
  );
}
