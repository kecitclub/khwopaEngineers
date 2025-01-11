import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import CameraFormPage from "./component/caminfo";
import Vehicle from "./component/createvehicle";
import HomePage from "./component/homepage";
import DefaultVehicle from "./component/vehiclepage"
import UpdateCamera from "./component/updatecamera";
import CameraTable from "./component/cretecam";
import VehicleUpdateForm from "./component/updatevehicle";
import VehicleTable from "./component/vehicleretrive";


function App(){
  const routes = [
    { path: "/",element: <HomePage/>},
    { path: "/vehicle",element: <DefaultVehicle/>},
    { path: "/vehicle/retrive-vehicle",element: <VehicleTable/>},
    { path: "/vehicle/create-vehicle",element: <Vehicle/>},
    { path: "/vehicle/update-vehicle/:id",element: <VehicleUpdateForm/>},
    { path: "/camera/insert-camera",element: <CameraFormPage/>},
    { path: "/camera/update-camera/:id", element:<UpdateCamera/>},
    { path: "/camera", element:<CameraTable/>},
    
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