import React, { useEffect, useState, useCallback, ChangeEvent, FormEvent } from 'react';
import logo from '../../assets/logo.svg';
import api from '../../services/api';
import Dropzone from '../components/Dropzone/index';
import axios from 'axios';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft } from 'react-icons/fi';
import {TileLayer, Map, Marker} from 'react-leaflet';
import './styles.css';
import { LeafletMouseEvent } from 'leaflet';

interface Item {
  id: number;
  title: string;
  image_url: string;
}

interface IBGEUFResponse {
  sigla: string;
}
interface IBGECityResponse {
  nome: string;
}

const CreatePoint:React.FC = () =>{
  const [items, setItems] = useState<Item[]>([]);
  const [ufs, setUfs] = useState<string[]>([]);
  const [cities, setCities] = useState<string[]>([]);
  const [initialPosition, setInicialPosition] = useState<[number, number]>([0, 0]);
  const [selectedPosition, setSelectedPosition] = useState<[number, number]>([0, 0]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);
  const [selectedUf, setSelectedUf] = useState(0);
  const [selectedCity, setSelectedCity] = useState('');
  const [selectedFile, setSelectedFile] = useState<File>();
  const [formData, setFormData] = useState({
    name:'',
    email:'',
    whatsapp:'',
  });

  const history = useHistory();

  useEffect(()=>{
    navigator.geolocation.getCurrentPosition(position => {
      const {latitude, longitude} = position.coords
      setInicialPosition([latitude, longitude])
    })
  }, [])

  useEffect(()=>{
    api.get('/items')
      .then(response => setItems(response.data));
  }, []);

  useEffect(()=>{
    axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(response =>{
        const ufInitials = response.data.map(uf => uf.sigla);
        setUfs(ufInitials)
      })
  }, []);

  useEffect(()=>{
    if(selectedUf === 0){
      return;
    }
    axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUf}/municipios`)
      .then(response=> {
        const cityNames = response.data.map(city => city.nome);
        setCities(cityNames);
      });
  }, [selectedUf]);
  const handleSelectUf = useCallback((event)=>{
    const uf = event.target.value;
    setSelectedUf(uf);
  }, []);
  const handleSelectCity = useCallback((event)=>{
    const city = event.target.value;
    setSelectedCity(city);
  }, []);

  const handleMapClick = useCallback((event: LeafletMouseEvent)=>{
      setSelectedPosition([
        event.latlng.lat,
        event.latlng.lng
      ])
  }, []);

  const handleInputChange = useCallback((event:ChangeEvent<HTMLInputElement>)=>{
    const {name, value} = event.target;
    setFormData({...formData,[name]:value})
  }, [formData]);

  const handleSelectItem = useCallback((id)=>{
    const selectedAlready = selectedItems.findIndex(item => item === id);
    if(selectedAlready >= 0){
      const filteredItems = selectedItems.filter(item => item !== id);
      setSelectedItems(filteredItems)
    }else{
      setSelectedItems([...selectedItems ,id]);
    }
    
  },[selectedItems]);

  const handleSubmit = useCallback(async (event:FormEvent)=>{
    event.preventDefault();
    const {name, email, whatsapp} = formData;
    const uf = selectedUf;
    const city = selectedCity;
    const [latitude, longitude] = selectedPosition;
    const items = selectedItems;
    const data = new FormData();


    data.append('name', name);
    data.append('email', email);
    data.append('whatsapp', whatsapp);
    data.append('uf', String(uf));
    data.append('city', city);
    data.append('latitude', String(latitude));
    data.append('longitude', String(longitude));
    data.append('items', items.join(','));
    if(selectedFile){
      data.append('image', selectedFile);
    }

    await api.post('points', data);
    alert('Ponto de coleta cadastrado com sucesso!');
    history.push('/success');
  }, [formData, history, selectedCity, selectedFile, selectedItems, selectedPosition, selectedUf]);
  return (
    <div id="page-create-point">
      <header>
        <img src={logo} alt="Ecoleta"/>
        <Link to="/">
          <FiArrowLeft/>
          Voltar
        </Link>
      </header>
      <form onSubmit={handleSubmit}>
        <h1>Cadastro do <br/> ponto de coleta</h1>
        <Dropzone onFileUploaded={setSelectedFile}/>
        <fieldset>
          <legend>
            <h2>Dados</h2>
          </legend>
          <div className="field">
            <label htmlFor="name">Nome da entidade</label>
            <input
            type="text"
            name="name"
            id="name"
            onChange={handleInputChange}
            />
          </div>
          <div className="field-group">
            <div className="field">
              <label htmlFor="email">E-mail</label>
              <input
              type="email"
              name="email"
              id="email"
              onChange={handleInputChange}
              />
          </div>
          <div className="field">
            <label htmlFor="whatsapp">Whatsapp</label>
            <input
            type="text"
            name="whatsapp"
            id="whatsapp"
            onChange={handleInputChange}
            />
          </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Endereço</h2>
            <span>Selecione o endereço no mapa</span>
          </legend>
          <Map center={initialPosition} zoom={15} onClick={handleMapClick}>
            <TileLayer 
            attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"/>
            <Marker position={selectedPosition}/>
          </Map>
          <div className="field-group">
            <div className="field">
              <label htmlFor="uf">Estado(UF)</label>
              <select name="uf" id="uf" value={selectedUf} onChange={handleSelectUf}>
                <option value="0">Selecione uma UF</option>
                {ufs.map(uf => {
                  return(
                    <option value={uf} key={uf}>{uf}</option>
                  );
                })}
              </select>
            </div>
            <div className="field">
              <label htmlFor="city">Cidade</label>
              <select name="city" id="city" value={selectedCity} onChange={handleSelectCity} >
                <option value="0">Selecione uma cidade</option>
                {cities.map(city => {
                  return(
                    <option value={city} key={city} >{city}</option>
                  );
                })}                
              </select>
            </div>
          </div>
        </fieldset>
        <fieldset>
          <legend>
            <h2>Ítens de coleta</h2>
            <span>Selecione um ou mais ítens abaixo</span>
          </legend>
          <ul className="items-grid">
            {items.map(item=> {
              return (
                <li key={item.id}onClick={()=>handleSelectItem(item.id)} className={selectedItems.includes(item.id)? 'selected': ''}>
                  <img src={item.image_url} alt={item.title}/>
                  <span>{item.title}</span>
                </li>
              );
            })}

          </ul>
        </fieldset>
        <button type="submit">Cadastrar ponto de coleta</button>
      </form>
    </div>
  );
}

export default CreatePoint;