// @mui
import { Icon } from '@mdi/react';
import PropTypes from 'prop-types';
import { alpha, styled } from '@mui/material/styles';
import { Card, Typography } from '@mui/material';

// ----------------------------------------------------------------------

const StyledIcon = styled('div')(({ theme }) => ({
  margin: 'auto',
  display: 'flex',
  borderRadius: '50%',
  alignItems: 'center',
  width: theme.spacing(8),
  height: theme.spacing(8),
  justifyContent: 'center',
  marginBottom: theme.spacing(3),
}));

// ----------------------------------------------------------------------

AppWidgetSummary.propTypes = {
  color: PropTypes.string,
  icon: PropTypes.string,
  pdfName: PropTypes.string.isRequired,
  sx: PropTypes.object,
};

export default function AppWidgetSummary({ pdfName, icon, color = 'primary', sx, ...other }) {
  return (
    <Card
      sx={{
        py: 1,
        boxShadow: 0,
        textAlign: 'center',
        color: (theme) => theme.palette[color].darker,
        bgcolor: (theme) => theme.palette[color].lighter,
        ...sx,
        cursor: 'pointer',
      }}
      {...other}
    >
      <StyledIcon
        sx={{
          color: (theme) => theme.palette[color].dark,
          backgroundImage: (theme) =>
            `linear-gradient(135deg, ${alpha(theme.palette[color].dark, 0)} 0%, ${alpha(
              theme.palette[color].dark,
              0.24
            )} 100%)`,
        }}
      >
        <Icon size={2} path={icon} />
      </StyledIcon>

      <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
        {pdfName}
      </Typography>
    </Card>
  );
}
