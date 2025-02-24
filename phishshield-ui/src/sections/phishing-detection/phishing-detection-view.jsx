import { useState } from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CircularProgress from '@mui/material/CircularProgress';
import { Card, CardContent, Divider, Grid, Button, Paper, Tab, Tabs, Container } from '@mui/material';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { motion } from 'framer-motion';

import { phishingDetectionService } from '../../services/index.js';
import { handleResponse } from '../../helpers/index.js';
import { useTranslation } from 'react-i18next';

const getValidationSchema = (tabIndex, t) => {
  return Yup.object({
    url: Yup.string()
      .url(t('phishing.errors.invalidURL'))
      .when([], {
        is: () => tabIndex === 0,
        then: (schema) => schema.required(t('phishing.errors.urlRequired')),
        otherwise: (schema) => schema.notRequired(),
      }),
    text: Yup.string()
      .min(10, t('phishing.errors.textMinLength'))
      .when([], {
        is: () => tabIndex === 1,
        then: (schema) => schema.required(t('phishing.errors.textRequired')),
        otherwise: (schema) => schema.notRequired(),
      }),
    file: Yup.mixed().when([], {
      is: () => tabIndex === 2 || tabIndex === 3,
      then: (schema) => schema.required(t('phishing.errors.fileRequired')),
      otherwise: (schema) => schema.notRequired(),
    }),
  });
};

const capitalizeFirstLetter = (str) => {
  return str
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
};

export function PhishingDetectionView() {
  const { t } = useTranslation();
  const [response, setResponse] = useState();
  const [tabIndex, setTabIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      url: '',
      text: '',
      file: null,
    },
    validationSchema: getValidationSchema(tabIndex, t),
    validateOnChange: false,
    context: { tabIndex },
    onSubmit: async (values) => {
      setIsLoading(true);
      try {
        let responseData;
        const formData = new FormData();

        switch (tabIndex) {
          case 0:
            formData.append('url', values.url);
            responseData = await phishingDetectionService.predictPhishing(formData, 'url');
            break;
          case 1:
            formData.append('text', values.text);
            responseData = await phishingDetectionService.predictPhishing(formData, 'text');
            break;
          case 2:
            formData.append('file', values.file);
            responseData = await phishingDetectionService.predictPhishing(formData, 'file');
            break;
          case 3:
            formData.append('file', values.file);
            responseData = await phishingDetectionService.predictPhishing(formData, 'audio');
            break;
          default:
            break;
        }
        setResponse(responseData.data);
      } catch (e) {
        setResponse(handleResponse(e));
      } finally {
        setIsLoading(false);
      }
    },
  });

  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
    formik.setErrors({});
    setResponse(null);
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 5 }}>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h4" align="center" gutterBottom>
          {t('phishing.title')}
        </Typography>

        <Tabs value={tabIndex} onChange={handleTabChange} variant="fullWidth">
          <Tab label={t('phishing.tabs.url')} />
          <Tab label={t('phishing.tabs.text')} />
          <Tab label={t('phishing.tabs.file')} />
          <Tab label={t('phishing.tabs.audio')} />
        </Tabs>

        <Box sx={{ mt: 2 }}>
          <form onSubmit={formik.handleSubmit}>
            {tabIndex === 0 && (
              <TextField
                label={t('phishing.fields.url')}
                variant="outlined"
                fullWidth
                name="url"
                value={formik.values.url}
                onChange={formik.handleChange}
                error={formik.touched.url && Boolean(formik.errors.url)}
                helperText={formik.touched.url && formik.errors.url}
                sx={{ mb: 2 }}
              />
            )}

            {tabIndex === 1 && (
              <TextField
                label={t('phishing.fields.text')}
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                name="text"
                value={formik.values.text}
                onChange={formik.handleChange}
                error={formik.touched.text && Boolean(formik.errors.text)}
                helperText={formik.touched.text && formik.errors.text}
                sx={{ mb: 2 }}
              />
            )}

            {tabIndex === 2 && (
              <Button
                variant="contained"
                component="label"
                startIcon={<CloudUploadIcon />}
                fullWidth
                sx={{ mb: 2 }}
              >
                {t('phishing.fields.file')}
                <input
                  type="file"
                  hidden
                  name="file"
                  onChange={(event) => {
                    formik.setFieldValue('file', event.currentTarget.files[0]);
                  }}
                />
              </Button>
            )}

            {formik.errors.file && tabIndex === 2 && (
              <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                {formik.errors.file}
              </Typography>
            )}

              {tabIndex === 3 && (
                <Button
                  variant="contained"
                  component="label"
                  startIcon={<CloudUploadIcon />}
                  fullWidth
                  sx={{ mb: 2 }}
                >
                    {t('phishing.fields.file')}
                    <input
                      type="file"
                      hidden
                      name="file"
                      onChange={(event) => {
                          formik.setFieldValue('file', event.currentTarget.files[0]);
                      }}
                    />
                </Button>
              )}

              {formik.errors.file && tabIndex === 3 && (
                <Typography color="error" variant="body2" sx={{ mb: 2 }}>
                    {formik.errors.file}
                </Typography>
              )}

            <Button
              variant="contained"
              color="primary"
              fullWidth
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? <CircularProgress size={24} color="inherit" /> : t('phishing.submitButton')}
            </Button>
          </form>

          {response && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="h5" align="center" gutterBottom>
                {t('phishing.detectionResults')}
              </Typography>
              <Divider sx={{ mb: 4 }} />

              <Grid container spacing={2}>
                <Box sx={{ ml: 2, mr: 2 }}>
                  {response.resultsArray && response.resultsArray.map((pred, index) => (
                    RenderPredictionResult(capitalizeFirstLetter(pred.model), pred.prediction, pred.probability, index, t)
                  ))}
                </Box>
              </Grid>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
}

const getStatus = (prediction, t) => {
  if (typeof prediction === 'string') {
    return prediction.toLowerCase() === 'good'
      ? t('phishing.results.safe')
      : t('phishing.results.phishing');
  }
  return prediction === 1 ? t('phishing.results.phishing') : t('phishing.results.safe');
};

const getBorderColor = (status, t) => {
  return status === t('phishing.results.safe') ? '#43a047' : '#e53935';
};

export const RenderPredictionResult = (label, prediction, probability, index, t) => {
  const status = getStatus(prediction, t);
  const borderColor = getBorderColor(status, t);
  const textColor = borderColor;

  return (
    <motion.div
      key={label}
      initial={{ opacity: 0, y: 50 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      whileHover={{ scale: 1.05, boxShadow: `0px 4px 15px ${borderColor}` }}
    >
      <Card
        sx={{
          mb: 2,
          border: `2px solid ${borderColor}`,
          borderRadius: 2,
          transition: 'border-color 0.3s ease',
        }}
      >
        <CardContent>
          <Typography variant="h6" sx={{ color: textColor }}>
            {label}: {status}
          </Typography>
          <Typography variant="body2">
            {t('phishing.probability')}: {(probability * 100).toFixed(2)}%
          </Typography>
        </CardContent>
      </Card>
    </motion.div>
  );
};