import React from 'react';

export function Skeleton({ className = '' }) {
  return (
    <div
      className={`animate-pulse rounded-md bg-neutral-200/50 dark:bg-neutral-800/50 ${className}`}
    />
  );
}

export function SkeletonCard() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
      <Skeleton className="h-6 w-3/4" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-5/6" />
      <div className="pt-4 space-y-2">
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function SkeletonGrid({ count = 6, columns = 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3' }) {
  return (
    <div className={`grid gap-6 ${columns}`}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
}

export function SkeletonChartContainer() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
      <Skeleton className="h-6 w-1/3" />
      <Skeleton className="h-64 w-full" />
    </div>
  );
}

export function SkeletonStatCard() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-8 w-1/2" />
      <Skeleton className="h-3 w-3/4" />
    </div>
  );
}

export function SkeletonDetailHeader() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-8 w-1/3" />
        <Skeleton className="h-10 w-24" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonStatCard key={i} />
        ))}
      </div>
    </div>
  );
}

export function SkeletonListItem() {
  return (
    <div className="flex items-center gap-4 p-4 rounded-lg border border-neutral-200 dark:border-neutral-800">
      <Skeleton className="h-12 w-12 rounded-full" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-10 w-20" />
    </div>
  );
}

export function SkeletonAvatarWithName() {
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <Skeleton className="h-24 w-24 rounded-full" />
      <Skeleton className="h-5 w-32" />
      <Skeleton className="h-4 w-48" />
    </div>
  );
}

// Dashboard Specific Skeletons
export function SkeletonDashboardHeader() {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div className="space-y-2">
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-4 w-64" />
      </div>
      <div className="w-full sm:w-auto rounded-2xl border border-neutral-200 dark:border-neutral-800 p-6 space-y-3">
        <Skeleton className="h-3 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-6 w-20" />
      </div>
    </div>
  );
}

export function SkeletonIncomeExpenseChart() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 h-[320px] flex flex-col">
      <Skeleton className="h-6 w-1/4" />
      <div className="flex-1 flex items-end justify-around gap-4 pt-4">
        {Array.from({ length: 12 }).map((_, i) => (
          <div key={i} className="flex-1 space-y-2">
            <Skeleton className="h-32 w-full rounded" />
            <Skeleton className="h-3 w-full" />
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonObjectivesSummary() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 h-[320px]">
      <Skeleton className="h-6 w-1/3" />
      <div className="space-y-3 pt-4">
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <div className="flex items-center gap-3">
          <Skeleton className="h-4 w-1/4" />
          <Skeleton className="h-6 w-1/3" />
        </div>
        <Skeleton className="h-32 w-full rounded mt-6" />
      </div>
    </div>
  );
}

export function SkeletonGroupObjectiveWidget() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 min-h-[300px]">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-1/3" />
        <Skeleton className="h-8 w-20" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="rounded border border-neutral-200 p-4 space-y-3">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-12 w-full" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        ))}
      </div>
    </div>
  );
}

// Friend Card Skeleton
export function SkeletonFriendCard() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden space-y-4 p-4">
      <Skeleton className="h-32 w-full rounded" />
      <div className="space-y-3">
        <Skeleton className="h-12 w-12 rounded-full mx-auto" />
        <Skeleton className="h-5 w-3/4 mx-auto" />
        <Skeleton className="h-4 w-2/3 mx-auto" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}

export function SkeletonFriendGrid({ count = 12 }) {
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonFriendCard key={i} />
      ))}
    </div>
  );
}

// Notification Card Skeleton
export function SkeletonNotificationItem() {
  return (
    <div className="flex items-center gap-3 p-3 bg-white border rounded animate-pulse">
      <div className="relative">
        <Skeleton className="h-10 w-10 rounded-full" />
      </div>
      <div className="flex-1 space-y-2">
        <div className="flex items-center justify-between">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-3 w-2/3" />
      </div>
    </div>
  );
}

export function SkeletonNotificationsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-4">
        <div>
          <Skeleton className="h-6 w-32 mb-3" />
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="mb-2">
              <SkeletonNotificationItem />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Settings Page Skeleton
export function SkeletonSettingsPage() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-32 w-full rounded" />
      <div className="px-6 pb-6 pt-4 space-y-6">
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-full rounded-lg" />
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

// Subscription Plans Skeleton
export function SkeletonSubscriptionPlan() {
  return (
    <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4 h-96">
      <Skeleton className="h-7 w-1/3" />
      <Skeleton className="h-4 w-2/3" />
      <Skeleton className="h-10 w-1/2" />
      <div className="space-y-2 pt-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    </div>
  );
}

export function SkeletonSubscriptionPage() {
  return (
    <div className="space-y-8 p-4 md:p-8">
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <Skeleton className="h-10 w-full md:w-2/3 mx-auto" />
        <Skeleton className="h-6 w-full md:w-3/4 mx-auto" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {Array.from({ length: 3 }).map((_, i) => (
          <SkeletonSubscriptionPlan key={i} />
        ))}
      </div>
    </div>
  );
}

// Transactions Section Skeleton
export function SkeletonTransactionItem() {
  return (
    <div className="flex items-center gap-3 p-4 rounded-xl border bg-slate-50 animate-pulse">
      <Skeleton className="h-11 w-11 rounded-lg" />
      <div className="flex-1 space-y-2">
        <Skeleton className="h-4 w-1/3" />
        <Skeleton className="h-3 w-1/2" />
      </div>
      <Skeleton className="h-4 w-24" />
    </div>
  );
}

export function SkeletonTransactionsPage() {
  return (
    <div className="max-w-3xl mx-auto p-6 bg-slate-50 rounded-2xl shadow-inner space-y-6">
      <Skeleton className="h-10 w-48" />
      <div className="space-y-6">
        {Array.from({ length: 3 }).map((_, monthIdx) => (
          <div key={monthIdx} className="space-y-3">
            <Skeleton className="h-6 w-32" />
            <div className="grid grid-cols-3 gap-3 mb-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-20 w-full rounded-xl" />
              ))}
            </div>
            {Array.from({ length: 3 }).map((_, i) => (
              <SkeletonTransactionItem key={i} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

// Grupal Objective Page Skeleton
export function SkeletonGrupalObjectiveHeader() {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
      <div className="space-y-3 flex-1">
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-4 w-full md:w-2/3" />
      </div>
      <div className="flex items-center gap-3">
        <div className="flex -space-x-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-10 w-10 rounded-full" />
          ))}
        </div>
        <Skeleton className="h-10 w-32 rounded-lg" />
      </div>
    </div>
  );
}

export function SkeletonGrupalObjectivePage() {
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 space-y-6 bg-slate-50 min-h-screen">
      <SkeletonGrupalObjectiveHeader />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-8 space-y-6">
          <SkeletonChartContainer />
          <SkeletonChartContainer />
        </div>
        <div className="lg:col-span-4">
          <SkeletonChartContainer />
        </div>
      </div>
    </div>
  );
}

// Balance Page Skeleton
export function SkeletonBalancePage() {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="rounded-lg border border-neutral-200 dark:border-neutral-800 p-6 space-y-4">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-8 w-32" />
            <div className="space-y-2 pt-4">
              <Skeleton className="h-3 w-1/2" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-10 w-32" />
        </div>

        <div className="rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-neutral-200 dark:border-neutral-800">
                <th className="px-6 py-4 text-left">
                  <Skeleton className="h-4 w-24" />
                </th>
                <th className="px-6 py-4 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
                <th className="px-6 py-4 text-left">
                  <Skeleton className="h-4 w-20" />
                </th>
                <th className="px-6 py-4 text-left">
                  <Skeleton className="h-4 w-16" />
                </th>
              </tr>
            </thead>
            <tbody>
              {Array.from({ length: 5 }).map((_, i) => (
                <tr key={i} className="border-b border-neutral-200 dark:border-neutral-800">
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-32" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-24" />
                  </td>
                  <td className="px-6 py-4">
                    <Skeleton className="h-4 w-20" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
