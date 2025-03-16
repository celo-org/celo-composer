import HomePage from './home-page'
import AppProvider from '../providers/AppProvider'

export default function Page () {
  return (
    <AppProvider>
      <HomePage />
    </AppProvider>
  );
}
