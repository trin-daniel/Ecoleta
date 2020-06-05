import React from 'react';
import {useHistory} from 'react-router-dom';
import { FiCheckCircle } from 'react-icons/fi';
import './styles.css';


const Success:React.FC = () =>{
  const history = useHistory();
  setTimeout(()=>{
    history.push('/')
  }, 3000)
  return (
    <div id="page-success">
      <h1>Success</h1>
      <FiCheckCircle size={64} color="#34CB79"/>
    </div>
  );
}

export default Success;