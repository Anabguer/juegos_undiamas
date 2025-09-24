import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.undiamas.survival',
  appName: 'Un Día Más',
  webDir: 'out',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#0b132b',
      showSpinner: false
    },
    StatusBar: {
      style: 'dark',
      backgroundColor: '#0b132b'
    }
  }
};

export default config;
