import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Login from './login.jsx';
import Dashboard from './dashboard/dashboard.jsx';
//import PrivateRoute from './privateroute.jsx';
import {Toaster} from "react-hot-toast" ;
import Chat from './chatbot/chat.jsx';
import Feed from './feedback/feed.jsx';
import Inventory from './inventory/inventory.jsx';
import Order from './order/order.jsx';
import Sales from './sales/sales.jsx';
import Payement from './payement/payement.jsx';


const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  {
    path: "dashboard",
    element: (
        <Dashboard />
    ),
    children: [
      { path: "inventory", element: <Inventory /> },
      { path: "sales", element: <Sales /> },
      { path: "chatbot", element: <Chat /> },
      { path: "order", element: <Order /> },
      { path: "feedback", element: <Feed /> },
      { path: "payement", element: <Payement /> },
    ],
  },
]);

createRoot(document.getElementById('root')).render(

  <StrictMode>
    <Toaster />
    <RouterProvider router={router} />
  </StrictMode>

)
