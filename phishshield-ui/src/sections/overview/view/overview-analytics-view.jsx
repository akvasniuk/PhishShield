import Grid from '@mui/material/Unstable_Grid2';
import Typography from '@mui/material/Typography';

import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { DashboardContent } from '../../../layouts/dashboard/index.js';

import { AnalyticsCurrentVisits } from '../analytics-current-visits.jsx';
import { AnalyticsWebsiteVisits } from '../analytics-website-visits.jsx';
import { AnalyticsWidgetSummary } from '../analytics-widget-summary.jsx';
import { AnalyticsTrafficBySite } from '../analytics-traffic-by-site.jsx';
import { useAuth } from '../../../hooks/use-auth.js';
import { statisticsService } from '../../../services/index.js';

export function OverviewAnalyticsView() {
    const { userIsAuthenticated, getUser } = useAuth();
    const { t } = useTranslation();
    const user = getUser();

    const [monthlyUsers, setMonthlyUsers] = useState(Array(12).fill(0));
    const [weeklyDetection, setWeeklyDetection] = useState(Array(7).fill(0));
    const [weeklyDetectionPositive, setWeeklyDetectionPositive] = useState(Array(7).fill(0));
    const [weeklyDetectionNegative, setWeeklyDetectionNegative] = useState(Array(7).fill(0));
    const [detectionByType, setDetectionByType] = useState([]);
    const [monthlyPrediction, setMonthlyPrediction] = useState(Array(12).fill(0));
    const [usersByAuth, setUsersByAuth] = useState([]);

    const daysOfWeek = t('daysOfWeek', { returnObjects: true });

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                let response = await statisticsService.getNumberOfUsersByMonth();
                setMonthlyUsers(response.data);
                response = await statisticsService.getNumberOfUsersByAuth();
                setUsersByAuth(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        const fetchDetections = async () => {
            try {
                let response = await statisticsService.getNumberOfPredictionsByWeek();
                setWeeklyDetection(response.data);
                response = await statisticsService.getNumberOfPositivePredictionsByWeek();
                setWeeklyDetectionPositive(response.data);
                response = await statisticsService.getNumberOfNegativePredictionsByWeek();
                setWeeklyDetectionNegative(response.data);
                response = await statisticsService.getNumberOfPredictionsByType();
                setDetectionByType(response.data);
                response = await statisticsService.getNumberOfPredictionsByMonth();
                setMonthlyPrediction(response.data);
            } catch (error) {
                console.error('Error fetching detections:', error);
            }
        };

        fetchDetections();
        fetchUsers();
    }, []);

    return (
        <DashboardContent maxWidth="xl">
            {userIsAuthenticated() && (
                <Typography variant="h4" sx={{ mb: { xs: 3, md: 5 } }}>
                    {t('overview.welcome', { firstname: user.firstname, lastname: user.lastname })}
                </Typography>
            )}

            <Grid container spacing={3}>
                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title={t('overview.weeklyDetection')}
                        percent={calculateGrowth(weeklyDetection)}
                        total={weeklyDetection.reduce((acc, val) => acc + val, 0)}
                        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-detection.svg" />}
                        chart={{
                            categories: daysOfWeek,
                            series: weeklyDetection,
                        }}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title={t('overview.newUsers')}
                        percent={calculateGrowth(monthlyUsers)}
                        total={monthlyUsers.reduce((acc, val) => acc + val, 0)}
                        color="secondary"
                        icon={<img alt="icon" src="/assets/icons/glass/ic-glass-users.svg" />}
                        chart={{
                            categories: t('months', { returnObjects: true }),
                            series: monthlyUsers,
                        }}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title={t('overview.weeklyPositiveDetection')}
                        percent={calculateGrowth(weeklyDetectionPositive)}
                        total={weeklyDetectionPositive.reduce((acc, val) => acc + val, 0)}
                        color="error"
                        icon={
                            <img
                                alt="icon"
                                src="/assets/icons/glass/ic-glass-phishing-positive.svg"
                            />
                        }
                        chart={{
                            categories: daysOfWeek,
                            series: weeklyDetectionPositive,
                        }}
                    />
                </Grid>

                <Grid xs={12} sm={6} md={3}>
                    <AnalyticsWidgetSummary
                        title={t('overview.weeklyNegativeDetection')}
                        percent={calculateGrowth(weeklyDetectionNegative)}
                        total={weeklyDetectionNegative.reduce((acc, val) => acc + val, 0)}
                        color="warning"
                        icon={
                            <img
                                alt="icon"
                                src="/assets/icons/glass/ic-glass-phishing-negative.svg"
                            />
                        }
                        chart={{
                            categories: daysOfWeek,
                            series: weeklyDetectionNegative,
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={4}>
                    <AnalyticsCurrentVisits
                        title={t('overview.predictionByType')}
                        chart={{
                            series: detectionByType.map((detection) => ({
                                label: detection.type.toUpperCase(),
                                value: detection.count,
                            })),
                        }}
                    />
                </Grid>

                <Grid xs={12} md={6} lg={8}>
                    <AnalyticsWebsiteVisits
                        title={t('overview.monthlyUsersAndPredictions')}
                        chart={{
                            categories: t('months', { returnObjects: true }),
                            series: [
                                { name: t('overview.users'), data: monthlyUsers },
                                { name: t('overview.predictions'), data: monthlyPrediction },
                            ],
                        }}
                    />
                </Grid>

                <Grid xs={6} md={6} lg={6}>
                    <AnalyticsTrafficBySite
                        title={t('overview.signUp')}
                        list={[
                            {
                                value: 'site',
                                label: t('overview.signUpSite'),
                                total: usersByAuth.filter((user) => user.type)[0]?.count,
                            },
                            {
                                value: 'google',
                                label: t('overview.signUpGoogle'),
                                total: usersByAuth.filter((user) => !user.type)[0]?.count,
                            },
                        ]}
                    />
                </Grid>
            </Grid>
        </DashboardContent>
    );
}

const calculateGrowth = (data) => {
    const lastMonth = data[data.length - 1];
    const prevMonth = data[data.length - 2] || 0;
    if (prevMonth === 0) return 100;
    return (((lastMonth - prevMonth) / prevMonth) * 100).toFixed(2);
};