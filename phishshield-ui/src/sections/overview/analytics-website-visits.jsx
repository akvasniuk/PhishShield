import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import { useTheme, alpha as hexAlpha } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

import { Chart, useChart } from '../../components/chart/index.js';

export function AnalyticsWebsiteVisits({ title, subheader
                                         , chart, ...other }) {
  const theme = useTheme();
  const { t } = useTranslation();

  const chartColors = chart.colors ?? [
    theme.palette.primary.dark,
    hexAlpha(theme.palette.primary.light, 0.64),
  ];

  const chartOptions = useChart({
    colors: chartColors,
    stroke: {
      width: 2,
      colors: ['transparent'],
    },
    xaxis: {
      categories: chart.categories,
    },
    legend: {
      show: true,
    },
    tooltip: {
      y: {
        formatter: (value) => `${value} ${t('analytics.visits')}`,
      },
    },
    ...chart.options,
  });

  return (
      <Card {...other}>
        <CardHeader title={title} subheader={subheader} />

        <Chart
            type="bar"
            series={chart.series}
            options={chartOptions}
            height={364}
            sx={{ py: 2.5, pl: 1, pr: 2.5 }}
        />
      </Card>
  );
}