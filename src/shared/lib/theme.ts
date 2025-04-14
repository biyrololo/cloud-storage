import { createTheme } from '@mui/material/styles';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  weight: ['400', '500', '600', '700'],
});

const theme = createTheme({
  
  palette: {
    primary: {
      main: '#7868E6',
    },
    secondary: {
      main: '#120B42',
    },
    background: {
      default: '#F6F5FD',
    },
  },
  typography: {
    fontFamily: montserrat.style.fontFamily,
  }
});

export default theme; 