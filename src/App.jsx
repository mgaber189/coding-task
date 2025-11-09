import {
  BrowserRouter ,
  RouterProvider,
  createBrowserRouter,
} from "react-router-dom";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import ProductList from "./pages/product/ProductList";
import NotFound from "./pages/notFound/NotFound";
import { Spin } from "antd";
import ProductDetails from "./pages/product/ProductDetails";
import ProductForm from "./pages/product/ProductForm";
const router = createBrowserRouter([
  {
    index: true,
    element: <ProductList />,
  },
  {
    path: "productDetails/:id",
    element: <ProductDetails />,
  },
  {
    path: "add-product",
    element: <ProductForm />,
  },
    {
    path: "edite-product/:id",
    element: <ProductForm />,
  },
  { path: "*", element: <NotFound /> },
]);
function App() {
  return (
    <Suspense fallback={<Spin />}>
      <ToastContainer />
      <RouterProvider router={router} />
    </Suspense>
  );
}

export default App;
