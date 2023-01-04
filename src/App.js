import React, {useState, useRef, useEffect} from "react";

export default function App(){
  const inputNumeroPedido = useRef(null);
  const inputNomeVendedor = useRef(null);
  const inputNomeCliente = useRef(null);
  const inputTypeOrder = useRef(null);
  const inputValueShipping = useRef(null);

  const [pedidos, setPedidos] = useState([]);

  const[numeroPedido, setNumeroPedido] = useState('');
  const[nomeCliente, setNomeCliente] = useState('-');
  const[nomeVendedor, setNomeVendedor] = useState('');
  const[typeOrder, setTypeOrder] = useState('ENTREGAR');
  const[valueShipping, setValueShipping] = useState('');
  const[payShipping, setPayShipping] = useState(false);

  useEffect(()=>{
    getDataCache('MyCache1', 'https://localhost/3000')
  }, [])

  async function addDataCache(nameCache, url, response){
    const data = new Response(JSON.stringify(response));
    if('caches' in window){
      try{
        const response1 = await caches.open(nameCache);
        await response1.put(url, data);
        //alert('Dados adicionados com sucesso!');

      }catch(err){
        console.log(`HOUVE UM ERRO DE CACHE! ${err}`);
      }
      
    }
  }

  async function getDataCache(nameCache, url){
    if(typeof caches === 'undefined'){
      return false;
    }

    const cacheStorage = await caches.open(nameCache);
    const cacheResponse = await cacheStorage.match(url);

    if(!cacheResponse || !cacheResponse.ok){
      setPedidos([]);
    }else{
      const data = await cacheResponse.json();
      setPedidos(data);
    }
  }

  function addPedido(numero, cliente, vendedor, typeOrder, valueShipping){
    const newArry = [...pedidos, {
      numeroPedido:numero,
      cliente:cliente,
      vendedor:vendedor,
      typeOrder:typeOrder,
      valueShipping:valueShipping
    }]

    setPedidos([...newArry]);

    inputNumeroPedido.current.value= '';
    inputNomeVendedor.current.value = '';
    inputNomeCliente.current.value = '';
    inputTypeOrder.current.value = 'ENTREGAR';

    setNumeroPedido('');
    setNomeVendedor('');
    setNomeCliente('-');
    setPayShipping(false);
    setTypeOrder('ENTREGAR');

    addDataCache('MyCache1', 'https://localhost/3000', [...newArry])
  }

  function delPedido(ind){
    let clonePedidos = [...pedidos];
    clonePedidos.splice(ind, 1);
    setPedidos([...clonePedidos]);
    console.log(pedidos);
    addDataCache('MyCache1', 'https://localhost/3000', [...clonePedidos])
  }

  return(
    <div className="containerApp">
      <div className="containerImg">
        <img alt="logo" className="imgLogo" src={require('./assets/imgs/logo.png')}/>
        <img alt="bttImprimir" className="bttImprimir" src={require('./assets/imgs/imprimir.png')} onClick={()=>window.print()}/>
      </div>
      <div className="dvForm">
        <input ref={inputNumeroPedido} type="text" placeholder="Número do pedido..." onChange={(txt)=>{
          const rgxpNumber = new RegExp(/[0-9]$/g);
          if(rgxpNumber.test(txt.target.value)){
            setNumeroPedido(txt.target.value)
          }else{
            inputNumeroPedido.current.value = '';
          }
        }}></input>

        <select ref={inputNomeVendedor} onChange={(input)=>setNomeVendedor(input.target.value)}>
          <option value={''}>Selecione o vendedor...</option>
          <option value={'Site'}>Site</option>
          <option value={'Fernando Jorge'}>Fernando Jorge</option>
          <option value={'Valeria Paumgartten'}>Valeria Paumgartten</option>
          <option value={'Edgar Henrique'}>Edgar Henrique</option>
          <option value={'Renata Delfino'}>Renata Delfino</option>
          <option value={'Ricardo Vilanova'}>Ricardo Vilanova</option>
          <option value={'Michelle Santos'}>Michelle Santos</option>
          <option value={'Sônia Maria'}>Sônia Maria</option>
          <option value={'Renata Paumgartten'}>Renata Paumgartten</option>
          <option value={'Wilson Domiciano'}>Wilson Domiciano</option>
          <option value={'Bruno Tiago'}>Bruno Tiago</option>
          <option value={'Pedro Debossan'}>Pedro Debossan</option>
        </select>

        <input ref={inputNomeCliente} type="text" placeholder="Cliente..." onChange={(txt)=>{
          const rgxpString = new RegExp(/[a-zA-Z]+/g);
          if(rgxpString.test(txt.target.value)){
            setNomeCliente(txt.target.value)
          }else{
            inputNomeCliente.current.value = '';
          }
          
        }}></input>

        <select ref={inputTypeOrder} onChange={(input)=>{
          setTypeOrder(input.target.value);
          if(input.target.value === 'BOY-EXTRA'){
            setPayShipping(true);
          }else{
            setPayShipping(false);
          }
        }}>
          <option value={'ENTREGAR'}>ENTREGAR</option>
          <option value={'RETIRAR PGTO'}>RETIRAR PGTO</option>
          <option value={'RETIRAR MATERIAL'}>RETIRAR MATERIAL</option>
          <option value={'BOY-EXTRA'}>BOY-EXTRA</option>
        </select>

        {payShipping?
          <input ref={inputValueShipping} type="text" placeholder="VALOR(R$)" onChange={(input)=>{
            setValueShipping(input.target.value);
          }}></input>
          :
          <></>
        }
      
        <button className="bttAdd" onClick={()=>{
          if(numeroPedido && nomeCliente && nomeVendedor){
            addPedido(numeroPedido, nomeCliente, nomeVendedor, typeOrder, valueShipping)
          }else{
            alert('PREENCHA TODAS AS INFOMAÇÕES!')
          }
          }}>ADICIONAR</button>
        
      </div>

      <ul>
        <li className="liHeader">
          <span>Nº PEDIDO</span>
          <span>CLIENTE</span>
          <span>VENDEDOR</span>
          <span>---</span>
        </li>

        {pedidos.map((el, ind, arr)=>{
          return(
            <li key={ind} className="liPedido">
              <span>{el.numeroPedido}</span>
              <span>{el.cliente}</span>
              <span>{el.vendedor}</span>
              <span className="typeOrder">{el.typeOrder}{el.typeOrder === 'BOY-EXTRA'?` - R$${el.valueShipping}.00`:''}</span>
              <button className="bttRemove" onClick={()=>delPedido(ind)}>X</button>
            </li>)
        })}
      </ul>
    </div>
  )
}