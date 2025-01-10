import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CameraFormPage from "./component/caminfo";
import VehicleOwnerForm from "./component/vehiclepage";
import HomePage from "./component/homepage";
import RetriveVehicle from "./component/vehicleretrive";
import DefaultVehicle from "./component/vehiclepage"


function App(){
  const routes = [
    { path: "/",element: <HomePage/>},
    { path: "/camera",element: <CameraFormPage/>},
    { path: "/vehicle",element: <DefaultVehicle/>},
    { path: "/vehicle/retrive-vehicle",element: <RetriveVehicle/>},
    { path: "/vehicle/create-vehicle",element: <VehicleOwnerForm/>},

  ];

  return(
    <Router>
      <Routes>
        {routes.map((route,index) =>(
          <Route key={index} path={route.path} element={route.element} />
        ))}
      </Routes>
    </Router>
  )
}

export default App;