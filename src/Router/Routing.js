import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ScriptFormation from "../pages/ScriptFormation";
import ReportGeneration from "../pages/ReportGeneration";
import AppHeader from '../Design/AppHeader';

const Routing =() =>{

    return(
        <Router>
            <AppHeader />
            <Routes>
                <Route path="/" element={<ScriptFormation />} />
                <Route path="/report" element={<ReportGeneration />} />
                {/* Add other routes here */}
            </Routes>
        </Router>
    )
}
export default Routing;
