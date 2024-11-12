
import './App.css';
import { useAuthToken } from './redux/useAuthtoken';
import Routing from './Router/Routing';

function App() {
  const { token, isLoading } = useAuthToken();

    // Render a loading state or a fallback UI while the token is being fetched
    if (isLoading) {
        return <div>Loading...</div>;
    }

    // Render Routing component once token is successfully fetched
    return <Routing />;
}

export default App;
