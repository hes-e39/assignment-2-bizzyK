// main.tsx
import {StrictMode} from "react";
import {createRoot} from "react-dom/client";
import {RouterProvider, createHashRouter} from "react-router-dom";

import "./index.css";

import TimersView from "./views/TimersView";
import DocumentationView from "./views/DocumentationView";
import AddTimer from "./views/AddTimer"; // New Add Timer view
import PageIndex from "./components/pageIndex/PageIndex";
import ErrorBoundary from "./components/errorBoundary/ErrorBoundary"; // Import ErrorBoundary
import {TimerProvider} from "./context/TimerContext"; // Timer context

const router = createHashRouter([
    {
        path: "/",
        element: <PageIndex/>,
        children: [
            {index: true, element: <TimersView/>},
            {path: "/docs", element: <DocumentationView/>},
            {path: "/add", element: <AddTimer/>}, // New route for Add Timer
        ],
    },
]);

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <ErrorBoundary>
            <TimerProvider> {/* Wrap app with TimerProvider */}
                <RouterProvider router={router}/>
            </TimerProvider>
        </ErrorBoundary>
    </StrictMode>
);
