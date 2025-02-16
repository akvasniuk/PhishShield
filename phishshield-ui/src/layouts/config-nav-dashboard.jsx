import { SvgColor } from '../components/svg-color/index.js';
import { useTranslation } from 'react-i18next';

const icon = (name) => (
    <SvgColor width="100%" height="100%" src={`/assets/icons/navbar/${name}.svg`} />
);

export const navData = () => {
  const { t } = useTranslation();

  return [
    {
      title: t('nav.dashboard'),
      path: '/',
      icon: icon('ic-analytics'),
      protected: false,
    },
    {
      title: t('nav.user'),
      path: '/user',
      icon: icon('ic-user'),
      protected: true,
    },
    {
      title: t('nav.phishing_detection'),
      path: '/phishing-detection',
      protected: true,
      icon: icon('ic-phishing'),
    },
    {
      title: t('nav.prediction_history'),
      path: '/prediction-history',
      protected: true,
      icon: icon('ic-prediction-history'),
    },
    {
      title: "Chat",
      path: '/chat',
      protected: true,
      icon: icon('ic-chat'),
    },
    {
      title: t('nav.comments'),
      path: '/comments',
      protected: true,
      icon: icon('ic-comments'),
    },
    {
      title: t('nav.sign_in'),
      path: '/sign-in',
      icon: icon('ic-lock'),
      protected: false,
    },
  ];
};