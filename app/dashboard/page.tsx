'use client';

import React from 'react';
import Dashboard from '@/Dashboard';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

export default function DashboardPage() {
  const [client] = React.useState(() => new QueryClient());
  return (
    <QueryClientProvider client={client}>
      <Dashboard />
    </QueryClientProvider>
  );
}
