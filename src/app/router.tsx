import { createBrowserRouter } from "react-router-dom";

import { AppLayout } from "@/components/layout/AppLayout";
import { ROUTES } from "@/constants";
import { Dashboard } from "@/pages/Dashboard";
import { MerchantDetails } from "@/pages/MerchantDetails";
import { NotFound } from "@/pages/NotFound";
import { Settings } from "@/pages/Settings";

export const router = createBrowserRouter([
  {
    path: ROUTES.dashboard,
    element: <AppLayout />,
    children: [
      {
        index: true,
        element: <Dashboard />,
      },
      {
        path: ROUTES.merchantDetails,
        element: <MerchantDetails />,
      },
      {
        path: ROUTES.settings,
        element: <Settings />,
      },
      {
        path: ROUTES.notFound,
        element: <NotFound />,
      },
    ],
  },
]);
