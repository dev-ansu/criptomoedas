import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { CoinProps } from "../home";
import styles from "./detail.module.css";

interface ResponseData{
    data: CoinProps;
}

interface ErrorData{
    error:string;
}

type DataProps = ErrorData | ResponseData;

const Detail = ()=>{
    const [coin, setCoin] = useState<CoinProps>();
    const {cripto} = useParams<string>();
    const navigate = useNavigate();
    const [loading, setLoading] = useState<boolean>(true);
    useEffect(()=>{
        const getCoin = async()=>{
            try{
                const response = await fetch(`https://api.coincap.io/v2/assets/${cripto}`)
                const data:DataProps = await response.json();
                if("error" in data){
                    navigate("/");
                    return;
                }

                const price = Intl.NumberFormat('en-US',{ style:"currency", currency:"USD"} )
                const priceCompact = Intl.NumberFormat('en-US',{ style:"currency", currency:"USD", notation:"compact"} )

                const resultData = {
                    ...data.data,
                    formatedPrice: price.format(Number(data.data.priceUsd)),
                    formatedMarket: priceCompact.format(Number(data.data.marketCapUsd)),
                    formatedVolume: priceCompact.format(Number(data.data.volumeUsd24Hr)),
                }
                setCoin(resultData)
                setLoading(false);
            }catch(err){
                console.log(err)
                navigate("/")
            }
        }
        getCoin()
    },[cripto])

    if(loading){
        return (
            <div className={styles.container}>
                <h4 className={styles.center}>Carregando detalhes...</h4>
            </div>
        )
    }

    return(
        <div className={styles.container}>
            <h1 className={styles.center}>{coin?.name} | {coin?.symbol}</h1>
            <section className={styles.content}>
                <img 
                    src={`https://assets.coincap.io/assets/icons/${coin.symbol.toLowerCase()}@2x.png`} 
                    alt="Logo criptomoeda"
                    className={styles.logo}
                />
                <h1>{coin?.name} | {coin?.symbol}</h1>
                <p>
                    <strong>Preço: </strong>{coin?.formatedPrice}
                </p>
                <a href="">
                    <strong>Mercado:</strong>{coin?.formatedMarket}
                </a>
                <a href="">
                    <strong>Volume:</strong>{coin?.formatedVolume}
                </a>
                <a href="">
                    <strong>Mudança em 24h: </strong><span className={Number(coin?.changePercent24Hr) > 0 ? styles.profit:styles.loss}>{Number(coin?.changePercent24Hr).toFixed(3)}</span>
                </a>
            </section>
        </div>
    )
}
    

export default Detail;