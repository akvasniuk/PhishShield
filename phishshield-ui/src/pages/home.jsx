import { Helmet } from 'react-helmet-async';

import { CONFIG } from '../config-global';

import { OverviewAnalyticsView } from '../sections/overview/view';

export default function Page() {
  return (
    <>
      <Helmet>
        <title> {`${CONFIG.appName}`}</title>
      </Helmet>

      <OverviewAnalyticsView />
    </>
  );
}
