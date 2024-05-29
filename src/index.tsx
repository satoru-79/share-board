import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import Board from './Board';
import Personal from './Personal';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Information from './Information';



const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

root.render(

  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />}/>
      <Route path="/board" element={<Board type=''/>}/>
      <Route path="/create_board" element={<Board type='create'/>}/>
      <Route path='/view_board' element={<Board type='share'/>}/>
      <Route path='/edit_board' element={<Board type='edit' />} />
      <Route path='/user_page'  element={<Personal/>} />
      <Route path='/information' element={<Information />} />
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
