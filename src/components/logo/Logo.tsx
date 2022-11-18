import { forwardRef } from 'react';
// next
import NextLink from 'next/link';
// @mui
import { useTheme } from '@mui/material/styles';
import { Box, Link, BoxProps } from '@mui/material';

//
import { useSettingsContext } from '../settings/SettingsContext';

// ----------------------------------------------------------------------

export interface LogoProps extends BoxProps {
  disabledLink?: boolean;
}

const Logo = forwardRef<HTMLDivElement, LogoProps>(
  ({ disabledLink = false, sx, ...other }, ref) => {
    const theme = useTheme();

    // const PRIMARY_LIGHT = theme.palette.primary.light;

    const PRIMARY_MAIN = theme.palette.primary.main;

    // const PRIMARY_DARK = theme.palette.primary.dark;

    // OR using local (public folder)
    // -------------------------------------------------------
    // const logo = (
    //   <Box
    //     component="img"
    //     src="/logo/logo_single.svg" => your path
    //     sx={{ width: 40, height: 40, cursor: 'pointer', ...sx }}
    //   />
    // );

      
    
      const { themeContrast, themeMode } = useSettingsContext();
    
      const isLight = themeMode === 'light';

    const logo = (
      <Box
        ref={ref}
        component="div"
        sx={{
          width: 60,
          height: 40,
          display: 'inline-flex',
          ...sx,
        }}
        {...other}
      >
        {/* 더나은 로고 */}
        <svg width="139" height="71" viewBox="0 0 139 71" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M3 68H136.5V41H111.5" stroke={isLight ? "black" : "white"} stroke-width="5"  stroke-linejoin="round" />
          <path d="M83.5 53.5C83.5 54.8807 84.6193 56 86 56C87.3807 56 88.5 54.8807 88.5 53.5H83.5ZM86 33.5V31C84.6193 31 83.5 32.1193 83.5 33.5H86ZM99.5 36C100.881 36 102 34.8807 102 33.5C102 32.1193 100.881 31 99.5 31V36ZM88.5 53.5V33.5H83.5V53.5H88.5ZM86 36H99.5V31H86V36Z" fill={isLight ? "black" : "white"}/>
          <path d="M25.5 53.5H3V15H99.5" stroke={PRIMARY_MAIN} stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M74 56C75.3807 56 76.5 54.8807 76.5 53.5C76.5 52.1193 75.3807 51 74 51V56ZM51 53.5H48.5C48.5 54.8807 49.6193 56 51 56V53.5ZM53.5 33.5C53.5 32.1193 52.3807 31 51 31C49.6193 31 48.5 32.1193 48.5 33.5H53.5ZM74 51H51V56H74V51ZM53.5 53.5V33.5H48.5V53.5H53.5Z" fill={isLight ? "black" : "white"}/>
          <path d="M39 53.5V33.5H25.5" stroke={PRIMARY_MAIN} stroke-width="5" stroke-linecap="round" stroke-linejoin="round" />
          <path d="M136.5 15C136.5 21.9036 130.904 27.5 124 27.5C117.096 27.5 111.5 21.9036 111.5 15C111.5 8.09644 117.096 2.5 124 2.5C130.904 2.5 136.5 8.09644 136.5 15Z" stroke={PRIMARY_MAIN} stroke-width="5" />
        </svg>

        
        {/* <svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" viewBox="0 0 512 512">
          <defs>
            <linearGradient id="BG1" x1="100%" x2="50%" y1="9.946%" y2="50%">
              <stop offset="0%" stopColor={PRIMARY_DARK} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>

            <linearGradient id="BG2" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>

            <linearGradient id="BG3" x1="50%" x2="50%" y1="0%" y2="100%">
              <stop offset="0%" stopColor={PRIMARY_LIGHT} />
              <stop offset="100%" stopColor={PRIMARY_MAIN} />
            </linearGradient>
          </defs>

          <g fill={PRIMARY_MAIN} fillRule="evenodd" stroke="none" strokeWidth="1">
            <path
              fill="url(#BG1)"
              d="M183.168 285.573l-2.918 5.298-2.973 5.363-2.846 5.095-2.274 4.043-2.186 3.857-2.506 4.383-1.6 2.774-2.294 3.939-1.099 1.869-1.416 2.388-1.025 1.713-1.317 2.18-.95 1.558-1.514 2.447-.866 1.38-.833 1.312-.802 1.246-.77 1.18-.739 1.111-.935 1.38-.664.956-.425.6-.41.572-.59.8-.376.497-.537.69-.171.214c-10.76 13.37-22.496 23.493-36.93 29.334-30.346 14.262-68.07 14.929-97.202-2.704l72.347-124.682 2.8-1.72c49.257-29.326 73.08 1.117 94.02 40.927z"
            />
            <path
              fill="url(#BG2)"
              d="M444.31 229.726c-46.27-80.956-94.1-157.228-149.043-45.344-7.516 14.384-12.995 42.337-25.267 42.337v-.142c-12.272 0-17.75-27.953-25.265-42.337C189.79 72.356 141.96 148.628 95.69 229.584c-3.483 6.106-6.828 11.932-9.69 16.996 106.038-67.127 97.11 135.667 184 137.278V384c86.891-1.611 77.962-204.405 184-137.28-2.86-5.062-6.206-10.888-9.69-16.994"
            />
            <path
              fill="url(#BG3)"
              d="M450 384c26.509 0 48-21.491 48-48s-21.491-48-48-48-48 21.491-48 48 21.491 48 48 48"
            />
          </g>
        </svg> */}
      </Box>
    );

    if (disabledLink) {
      return <>{logo}</>;
    }

    return (
      <NextLink href="/" passHref>
        <Link sx={{ display: 'contents' }}>{logo}</Link>
      </NextLink>
    );
  }
);

export default Logo;
