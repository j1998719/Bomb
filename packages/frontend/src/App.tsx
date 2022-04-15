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

    <Layout>

      <Header style={{ ...styles.header, zIndex: 1, width: '100%' }}>
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          alignItems: 'center',
          maxWidth: '960px',
          margin: '0 auto'
        }}>
          <div style={{ padding: '16px' }}>
            <Typography.Title level={1} style={{ margin: 0, color: '#ffffff' }}>Bomb Club</Typography.Title>
          </div>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>

            <a href={INSTAGRAM_LINK} target="_blank" style={{ fontSize: '32px', color: "#ffffff" }}>
              <InstagramFilled />
            </a>
            <a href={TWITTER_LINK} target="_blank" style={{ fontSize: '32px', color: "#ffffff" }}>
              <TwitterSquareFilled />
            </a>

            <Account />

          </div>
        </div>
      </Header >

      <Content style={{ minHeight: '100vh', display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', background: '#000000', flexWrap: "wrap" }}>
        <div style={{ display: 'flex', flexDirection: "column", maxWidth: "450px" }}>
          <div style={{ position: "relative" }}>
            <h6 className="h6" style={{ color: '#ffffff' }}>SUMMON YOUR FIGHTER SOUL</h6>
          </div>
          <h1 className="h1" style={{ margin: 0, color: '#ffffff' }}>Galosseum</h1>
          <p className='p' style={{ fontSize: "14px", maxWidth: '400px' }}>Galosseum (GSMN) is an art collection of 2,222 randomly generated portraits on the Ethereum Blockchain. Each GSMN is unique and comes with different traits varying in rarity. Public Sale Date is to be announced.</p>

          <div>
            <Button size="large" target="_blank" rel="noopener noreferrer" href="https://discord.gg/MrYr57kUzW" style={{ marginTop: '16px', color: '#ffffff', background: "#000000" }}>Join Discord</Button>
          </div>
        </div>
        <div style={{}}>
          <img src={bombClubBlack} alt='bombClubBlack' height='400px' />
        </div>
        <div className="lineButtonLeft"></div>
      </Content>
      <section style={{ display: 'flex', background: '#000000', color: '#ffffff', padding: '0px 120px' }}>
        <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <img src={GSMN2} alt='bombClubBlack' height='400px' />
        </Col>
        <Col span={12} style={{ display: 'flex', flexDirection: 'column', color: '#a4a7b1', lineHeight: 2 }}>
          <h1 style={{ color: '#12c2e9', letterSpacing: '10px', marginBottom: '16px' }}> WHAT IS GALOSSEUM?</h1>
          <b>Gallery x Colosseum.</b>
          <p>Due to the inequality of market rewards to talented artists and an unhealthy NFT ecosystem, we as a team decided to work with undiscovered talented artists all around the world to chase their NFT dreams.</p>
          <p>Galosseum is a colosseum floating in a space between dimensions. Every 100 years, Gods gather to watch a new tournament take place where the winner shall be granted excalibur and become the ruler for the next 100 years. Each of the contestants are capable of utilizing a variety of magic and summoning various fighter souls with magic cards.</p>
          <p>Please join us at the Galosseum, summon your fighter soul and unlock all stories about this secretive community.</p>
        </Col>

      </section>
      <div style={{ background: '#000000' }}>
        <div style={{ background: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)', height: '1.5px', width: '65%', margin: '64px 0px' }}>

        </div>
        <section style={{ display: 'flex', background: '#000000', color: '#ffffff', padding: '0px 120px' }}>

          <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={GSMN2} alt='bombClubBlack' height='400px' />
          </Col>
          <Col span={12} style={{ display: 'flex', flexDirection: 'column', color: '#a4a7b1', lineHeight: 2 }}>
            <h1 style={{ color: '#12c2e9', letterSpacing: '10px', marginBottom: '16px' }}> WHAT IS GALOSSEUM?</h1>
            <b>Gallery x Colosseum.</b>
            <p>Due to the inequality of market rewards to talented artists and an unhealthy NFT ecosystem, we as a team decided to work with undiscovered talented artists all around the world to chase their NFT dreams.</p>
            <p>Galosseum is a colosseum floating in a space between dimensions. Every 100 years, Gods gather to watch a new tournament take place where the winner shall be granted excalibur and become the ruler for the next 100 years. Each of the contestants are capable of utilizing a variety of magic and summoning various fighter souls with magic cards.</p>
            <p>Please join us at the Galosseum, summon your fighter soul and unlock all stories about this secretive community.</p>
          </Col>
        </section>
      </div>
      <div>
        <div>

        </div>
        <div>
          <div>
            <div>
              <div></div>
            </div>
            <div></div>
            <div></div>
          </div>
        </div>
      </div>

    </Layout >
  );
}

export default App;