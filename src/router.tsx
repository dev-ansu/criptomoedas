import {createBrowserRouter} from "react-router-dom";

import Home from "./pages/home";
import Detail from "./pages/details";
import NotFound from "./pages/notfound";
import Layout from "./components/layout";

export const router = createBrowserRouter([
    {
        element:<Layout />,
        children:[
            {
                path:"/",
                element: <Home />
            },
            {
                path:"/detail/:cripto",
                element:<Detail />
            },
            {
                path:"*",
                element:<NotFound />
            }
        ]
    }
])


