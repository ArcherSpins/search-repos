import React from 'react';
import ReactDOM from 'react-dom/client';
import { Route, RouterProvider, createBrowserRouter, createRoutesFromElements } from 'react-router-dom';
import { MainPage } from './pages/Main';
import { MAIN_PATH, REPO_PATH } from './routes';
import './index.css';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path={MAIN_PATH} element={<MainPage />} /> 
      <Route path={REPO_PATH} element={<MainPage />} />
    </>
  )
);

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
