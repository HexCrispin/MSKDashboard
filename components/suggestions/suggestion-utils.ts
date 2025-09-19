const theme = {
  colors: {
    yellow: { bg: 'bg-yellow-100', text: 'text-yellow-800', textLight: 'text-yellow-600' },
    blue: { bg: 'bg-blue-100', text: 'text-blue-800', textLight: 'text-blue-600' },
    green: { bg: 'bg-green-100', text: 'text-green-800', textLight: 'text-green-600' },
    gray: { bg: 'bg-gray-100', text: 'text-gray-800', textLight: 'text-gray-600' },
    orange: { bg: 'bg-orange-100', text: 'text-orange-800', textLight: 'text-orange-600' },
    red: { bg: 'bg-red-100', text: 'text-red-800', textLight: 'text-red-600' }
  },
  mappings: {
    status: {
      pending: 'yellow',
      in_progress: 'blue',
      completed: 'green',
      overdue: 'red',
      dismissed: 'gray'
    },
    priority: {
      low: 'green',
      medium: 'orange',
      high: 'red'
    },
    riskLevel: {
      low: 'green',
      medium: 'orange',
      high: 'red'
    }
  }
} as const;

const getColorClasses = (colorKey: keyof typeof theme.colors, variant: 'badge' | 'text' = 'badge'): string => {
  const color = theme.colors[colorKey];
  return variant === 'badge' ? `${color.bg} ${color.text}` : color.textLight;
};

export const getStatusColor = (status: string): string => {
  const colorKey = theme.mappings.status[status as keyof typeof theme.mappings.status] || 'gray';
  return getColorClasses(colorKey, 'badge');
};

export const getPriorityColor = (priority: string): string => {
  const colorKey = theme.mappings.priority[priority as keyof typeof theme.mappings.priority] || 'gray';
  return getColorClasses(colorKey, 'badge');
};

export const getHighMediumLowColor = (riskLevel: string | undefined): string => {
  if (!riskLevel) return theme.colors.red.textLight;
  const colorKey = theme.mappings.riskLevel[riskLevel as keyof typeof theme.mappings.riskLevel] || 'red';
  return getColorClasses(colorKey, 'text');
};

export const formatText = (type: string | undefined): string => {
  if (!type) return '';
  return type.replaceAll('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
};
