import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import styles from "./home.module.css";
import {BsSearch} from "react-icons/bs"
import {Link, useNavigate} from "react-router-dom"

export interface CoinProps{
    id: string;
    name:string;
    symbol:string;
    priceUsd: string;
    changePercent24Hr: string;
    rank:string;
    supply:string;
    maxSupply:string;
    volumeUsd24Hr:string;
    explorer:string;
    marketCapUsd:string;
    vwap24Hr:string;
    formatedPrice?:string;
    formatedMarket?:string;
    formatedVolume?:string;
}

interface DataProp{
    data: CoinProps[];
}

const Home = ()=>{
    const [input, setInput] = useState("");
    const navigate = useNavigate();
    const [coins, setCoins] = useState<CoinProps[]>([]);
    const [offset, setOffset] = useState(0);
    const getData = async()=>{
        const response = await fetch(`https://api.coincap.io/v2/assets?limit=10&offset=${offset}`);
        const data: DataProp = await response.json();
        const formatedResult = data.data.map( item =>{
            const price = Intl.NumberFormat('en-US',{ style:"currency", currency:"USD"} )
            const priceCompact = Intl.NumberFormat('en-US',{ style:"currency", currency:"USD", notation:"compact"} )
            const formated = {
                ...item,
                formatedPrice: price.format(Number(item.priceUsd)),
                formatedMarket: priceCompact.format(Number(item.marketCapUsd)),
                formatedVolume: priceCompact.format(Number(item.volumeUsd24Hr)),
            }
            return formated
        });        
        const listCoins = [...coins, ...formatedResult];
        setCoins(listCoins);
    }

    useEffect(()=>{
        getData();
    },[offset]);

    const handleSubmit = (e: FormEvent)=>{
        e.preventDefault();
        if(input.trim() === "") return;
        navigate(`/detail/${input}`)
        console.log(input)
    }
    const handleGetMore = ()=>{
        if(offset == 0){
            setOffset(10);
            return;
        }else{
            setOffset(offset + 10)
            return;
        }
    }
    return(
        <main className={styles.container}>

            <form onSubmit={handleSubmit} action="" className={styles.form}>
                <input value={input}
                onChange={(e: ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                type="text" placeholder="Digite o nome da moeda... Ex.: bitcoin" />
                <button type="submit">
                    <BsSearch size={30} color="#fff" />
                </button>
            </form>

            <table>
                <thead>
                    <tr>
                        <th scope="col">Moeda</th>
                        <th scope="col">Valor de mercado</th>
                        <th scope="col">Preço</th>
                        <th scope="col">Volume</th>
                        <th scope="col">Mudança 24h</th>
                    </tr>
                </thead>
                <tbody id="tbody">
                    {coins.length > 0 && coins.map( (coin: CoinProps) => (
                        <tr className={styles.tr}>

                            <td className={styles.tdLabel} data-label="Moeda">
                                <div className={styles.name}>
                                    <img 
                                    className={styles.logo}
                                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} alt="Logo Cripto"
                                    />
                                    <Link to={`/detail/${coin.id}`}>
                                        <span>{coin.name}</span> | {coin.symbol}
                                    </Link>
                                </div>
                            </td>
                            <td className={styles.tdLabel} data-label="Valor de mercado">
                                {coin.formatedMarket}
                            </td>
                            <td className={styles.tdLabel} data-label="Preço">
                                {coin.formatedPrice}
                            </td>
                            <td className={styles.tdLabel} data-label="Volume">
                                {coin.formatedVolume}
                            </td>
                            <td className={Number(coin.changePercent24Hr) > 0 ? styles.tdProfit:styles.tdLoss} data-label="Mudança em 24h">
                                <span>{Number(coin.changePercent24Hr).toFixed(3)}</span>
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>

            <button onClick={handleGetMore} className={styles.buttonMore}>Carregar mais</button>
        </main>
    )
}


export default Home;