import { Button, Card, Layout, Select, Typography, Menu, Breadcrumb, Radio, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import styled from 'styled-components';
import Account from './components/Account';
import { DISCORD_LINK, MAX_SUPPLY, MINT_PRICE, START_TIME, TWITTER_LINK, INSTAGRAM_LINK } from './constants';
import { openNotificationWithIcon } from './helpers/notification';
import { useTemplateNFTContract } from './hooks/useContract';
import { useActiveWeb3React } from './hooks/web3';
import "./style.css";
import WHITELIST from './whitelist/whitelist.json';
import logo from './images/logo.png'
import bombClubBlack from './images/bombClubBlack.jpg'
import GSMN2 from "./images/GSMN2.png"
import GSMN3 from "./images/GSMN3.png"
import logoG from "./images/logoG.png"


import { TwitterSquareFilled, InstagramFilled } from '@ant-design/icons';
import "./galosseum.css"

const { Option } = Select;

const { Header, Content, Footer } = Layout;
const { Text } = Typography
const styles = {
  header: {
    background: '#000000',
  },
  contentBox: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: "50%",
    minWidth: '375px'
  },
  title: {
    color: '#40a9ff',
    fontWeight: 'bold'
  },
  subtitle: {
    color: '#bfbfbf'
  }
}
const mb5 = {
  fontWeight: "300",
  fontSize: "15px",
  textTransform: "uppercase",
  letterSpacing: "4px",
  display: "inline - block",
  background: "linear - gradient(to right, #12c2e9, #c471ed, #f64f59)",
  padding: "7px 12px",
  borderRadius: "10px"
}

const IconWrap = styled.a`
    display: inline-block;
    margin: 0 12px;
    height: 24px;
    & svg {
        fill: #000000; 
        &:hover {
            fill: #f2c055;
        }
    }
`


type Voucher = {
  voucher: {
    redeemer: string;
    stageId: number;
    nonce: number;
    amount: number;
  };
  signature: string;
}

type StageInfo = {
  stageId: number;
  maxSupply: number;
  startTime: number;
  endTime: number;
  mintPrice: BigNumber;
}
const whitelist: Map<string, Voucher> = new Map(Object.entries(WHITELIST));


function App() {
  const [mintButtonDisabled, setMintButtonDisabled] = useState(false)
  const [amount, setMintAmount] = useState('1');
  const [stageInfo, setStageInfo] = useState<StageInfo>()
  const { account, chainId } = useActiveWeb3React();
  const [totalSupply, setTotalSupply] = useState(0);
  const templateNFT = useTemplateNFTContract();
  useEffect(() => {
    if (!chainId) return;
    if (chainId !== 1 && chainId !== 1337 && chainId !== 4) {
      openNotificationWithIcon('info', 'Please connect to Ethereum Mainnet', 'Switch your network to Ethereum Mainnet')
      return;
    }
    const getStageInfto = async () => {
      if (!templateNFT) return;
      setStageInfo((await templateNFT?.stageInfo()))
      setTotalSupply((await templateNFT.totalSupply()).toNumber())

    }
    getStageInfto()
  }, [chainId, templateNFT])

  const handleClick = async () => {
    if (!account) {
      openNotificationWithIcon('info', 'Please connect to Wallet', "")
      return;
    }
    if (chainId !== 1 && chainId !== 1337 && chainId !== 4) {
      openNotificationWithIcon('info', 'Please connect to Ethereum Mainnet', 'Switch your network to Ethereum Mainnet')
      return;
    }
    if (!amount) return;

    if (stageInfo?.stageId === 1) {

      const data = whitelist.get(account)
      if (!data) {
        openNotificationWithIcon('info', 'Not in whitelist', '')
        return
      }
      if (stageInfo.startTime * 1000 > Date.now()) {
        openNotificationWithIcon('info', "Sales has'nt started yet", '')
        return
      }
      const voucher = data?.voucher
      const signature = data?.signature

      try {
        setMintButtonDisabled(true)
        const tx = await templateNFT?.whitelistMint(voucher, signature, amount, {
          value: stageInfo?.mintPrice?.mul(amount)
        })
        const receipt = await tx?.wait()
        if (receipt?.status) {
          openNotificationWithIcon('success', 'Mint success!', "Welcome to the templateNFT! You can now check on Opensea.")
          setMintAmount('1')
        }
      } catch (err) {
        setMintButtonDisabled(false)
        // @ts-ignore:next-line
        if (err.code === "INSUFFICIENT_FUNDS") {
          openNotificationWithIcon('error', 'INSUFFICIENT FUND', "You might not have enough fund to perform this opertaion")
          return
        }
        // @ts-ignore:next-line
        if (err.code === 4001) {
          openNotificationWithIcon('error', 'User denied transaction signature', "")
          return
        }
        openNotificationWithIcon('error', 'Error while sending transaction', "")
      }
    } else {
      try {
        setMintButtonDisabled(true)
        const tx = await templateNFT?.publicMint(amount, {
          value: stageInfo?.mintPrice?.mul(amount)
        })
        const receipt = await tx?.wait()
        if (receipt?.status) {
          openNotificationWithIcon('success', 'Mint success!', "Welcome to the templateNFT! You can now check on Opensea.")
          setMintAmount('1')
        }
      } catch (err) {
        setMintButtonDisabled(false)
        // @ts-ignore:next-line
        if (err.code === "INSUFFICIENT_FUNDS") {
          openNotificationWithIcon('error', 'INSUFFICIENT FUND', "You might not have enough fund to perform this opertaion")
          return
        }
        // @ts-ignore:next-line
        if (err.code === 4001) {
          openNotificationWithIcon('error', 'User denied transaction signature', "")
          return
        }
        openNotificationWithIcon('error', 'Error while sending transaction', "")
      }
    }

    setMintButtonDisabled(false)
  }

  const handleChange = (value: any) => {
    console.log(value)
    setMintAmount(value)
  }


  return (

    <nav className='navbar navbar-expand-lg change'>
      <div className='container'>
        <img src={logoG} style={{ width: "300px" }}></img>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <ul className='navbar-nav ml-auto'>
            <li>
              <a className='nav-link' target="_blank" rel="noreferrer" href="https://discord.gg/MrYr57kUzW">
                <svg stroke='currentColor' fill='currentColor' stroke-width='0' role='img' viewBox='0 0 24 24' height='20' width='20' xmlns="http://www.w3.org/2000/svg">
                  <title></title>
                  <path d='M20.317 4.3698a19.7913 19.7913 0 00-4.8851-1.5152.0741.0741 0 00-.0785.0371c-.211.3753-.4447.8648-.6083 1.2495-1.8447-.2762-3.68-.2762-5.4868 0-.1636-.3933-.4058-.8742-.6177-1.2495a.077.077 0 00-.0785-.037 19.7363 19.7363 0 00-4.8852 1.515.0699.0699 0 00-.0321.0277C.5334 9.0458-.319 13.5799.0992 18.0578a.0824.0824 0 00.0312.0561c2.0528 1.5076 4.0413 2.4228 5.9929 3.0294a.0777.0777 0 00.0842-.0276c.4616-.6304.8731-1.2952 1.226-1.9942a.076.076 0 00-.0416-.1057c-.6528-.2476-1.2743-.5495-1.8722-.8923a.077.077 0 01-.0076-.1277c.1258-.0943.2517-.1923.3718-.2914a.0743.0743 0 01.0776-.0105c3.9278 1.7933 8.18 1.7933 12.0614 0a.0739.0739 0 01.0785.0095c.1202.099.246.1981.3728.2924a.077.077 0 01-.0066.1276 12.2986 12.2986 0 01-1.873.8914.0766.0766 0 00-.0407.1067c.3604.698.7719 1.3628 1.225 1.9932a.076.076 0 00.0842.0286c1.961-.6067 3.9495-1.5219 6.0023-3.0294a.077.077 0 00.0313-.0552c.5004-5.177-.8382-9.6739-3.5485-13.6604a.061.061 0 00-.0312-.0286zM8.02 15.3312c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9555-2.4189 2.157-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.9555 2.4189-2.1569 2.4189zm7.9748 0c-1.1825 0-2.1569-1.0857-2.1569-2.419 0-1.3332.9554-2.4189 2.1569-2.4189 1.2108 0 2.1757 1.0952 2.1568 2.419 0 1.3332-.946 2.4189-2.1568 2.4189Z'></path>
                </svg>
              </a>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}

export default App;