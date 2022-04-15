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
import S__126140929 from "./images/S__126140929.jpg"


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
      <section style={{ display: 'flex', flexDirection: 'column', background: '#000000', color: '#ffffff', padding: '120px 200px' }}>

        <div>
          <h1 style={{ color: '#12c2e9', letterSpacing: '10px', marginBottom: '20px', marginLeft: '16px', fontSize: '30px', textTransform: 'uppercase' }}> Roadmap</h1>
        </div>
        <div style={{ backgroundColor: '#232323', display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center' }}>
          <div style={{ margin: '16px' }}>
            <div style={{ fontSize: "60px", fontWeight: 700, color: "transparent", WebkitTextStroke: "1px #b19777", marginLeft: '16px' }}>01</div>
            <div style={{ color: "#ffffff", letterSpacing: "1px", lineHeight: 1.4, fontWeight: 500, fontSize: '25px', marginLeft: '16px', margin: '12px' }}>GALOSSEUM GENESIS COLLECTION</div>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>We are planting our roots at this stage while we work on perfecting our galosseum. As our first goal involves a successful drop in order to let our early supporters to own a fighter soul and provide other investors opportunities for future investments.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>The GSMN project is a long term project built with many individual aspects included such as art, design, game, technology and quality control elements. We strive to guarantee our communities the finest results possible.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>When we’ll be able to proudly stand behind our promise for the GSMN community we will announce the utilities for the first drop of our project, so they can enjoy all the benefits and effort that we have put in each and every GSMN fighter.
            </p>
          </div>
          <div style={{ margin: '16px' }}>
            <div style={{ fontSize: "60px", fontWeight: 700, color: "transparent", WebkitTextStroke: "1px #b19777", marginLeft: '16px' }}>02</div>
            <div style={{ color: "#ffffff", letterSpacing: "1px", lineHeight: 1.4, fontWeight: 500, fontSize: '25px', marginLeft: '16px', margin: '12px' }}>GALOSSEUM GENESIS COLLECTION</div>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>We are planting our roots at this stage while we work on perfecting our galosseum. As our first goal involves a successful drop in order to let our early supporters to own a fighter soul and provide other investors opportunities for future investments.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>The GSMN project is a long term project built with many individual aspects included such as art, design, game, technology and quality control elements. We strive to guarantee our communities the finest results possible.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>When we’ll be able to proudly stand behind our promise for the GSMN community we will announce the utilities for the first drop of our project, so they can enjoy all the benefits and effort that we have put in each and every GSMN fighter.
            </p>
          </div>
          <div style={{ margin: '16px' }}>
            <div style={{ fontSize: "60px", fontWeight: 700, color: "transparent", WebkitTextStroke: "1px #b19777", marginLeft: '16px' }}>03</div>
            <div style={{ color: "#ffffff", letterSpacing: "1px", lineHeight: 1.4, fontWeight: 500, fontSize: '25px', marginLeft: '16px', margin: '12px' }}>GALOSSEUM GENESIS COLLECTION</div>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>We are planting our roots at this stage while we work on perfecting our galosseum. As our first goal involves a successful drop in order to let our early supporters to own a fighter soul and provide other investors opportunities for future investments.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>The GSMN project is a long term project built with many individual aspects included such as art, design, game, technology and quality control elements. We strive to guarantee our communities the finest results possible.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>When we’ll be able to proudly stand behind our promise for the GSMN community we will announce the utilities for the first drop of our project, so they can enjoy all the benefits and effort that we have put in each and every GSMN fighter.
            </p>
          </div>
          <div style={{ margin: '16px' }}>
            <div style={{ fontSize: "60px", fontWeight: 700, color: "transparent", WebkitTextStroke: "1px #b19777", marginLeft: '16px' }}>04</div>
            <div style={{ color: "#ffffff", letterSpacing: "1px", lineHeight: 1.4, fontWeight: 500, fontSize: '25px', marginLeft: '16px', margin: '12px' }}>GALOSSEUM GENESIS COLLECTION</div>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>We are planting our roots at this stage while we work on perfecting our galosseum. As our first goal involves a successful drop in order to let our early supporters to own a fighter soul and provide other investors opportunities for future investments.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>The GSMN project is a long term project built with many individual aspects included such as art, design, game, technology and quality control elements. We strive to guarantee our communities the finest results possible.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>When we’ll be able to proudly stand behind our promise for the GSMN community we will announce the utilities for the first drop of our project, so they can enjoy all the benefits and effort that we have put in each and every GSMN fighter.
            </p>
          </div>
          <div style={{ margin: '16px' }}>
            <div style={{ fontSize: "60px", fontWeight: 700, color: "transparent", WebkitTextStroke: "1px #b19777", marginLeft: '16px' }}>05</div>
            <div style={{ color: "#ffffff", letterSpacing: "1px", lineHeight: 1.4, fontWeight: 500, fontSize: '25px', marginLeft: '16px', margin: '12px' }}>GALOSSEUM GENESIS COLLECTION</div>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>We are planting our roots at this stage while we work on perfecting our galosseum. As our first goal involves a successful drop in order to let our early supporters to own a fighter soul and provide other investors opportunities for future investments.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>The GSMN project is a long term project built with many individual aspects included such as art, design, game, technology and quality control elements. We strive to guarantee our communities the finest results possible.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>When we’ll be able to proudly stand behind our promise for the GSMN community we will announce the utilities for the first drop of our project, so they can enjoy all the benefits and effort that we have put in each and every GSMN fighter.
            </p>
          </div>
          <div style={{ margin: '16px' }}>
            <div style={{ fontSize: "60px", fontWeight: 700, color: "transparent", WebkitTextStroke: "1px #b19777", marginLeft: '16px' }}>06</div>
            <div style={{ color: "#ffffff", letterSpacing: "1px", lineHeight: 1.4, fontWeight: 500, fontSize: '25px', marginLeft: '16px', margin: '12px' }}>GALOSSEUM GENESIS COLLECTION</div>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>We are planting our roots at this stage while we work on perfecting our galosseum. As our first goal involves a successful drop in order to let our early supporters to own a fighter soul and provide other investors opportunities for future investments.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>The GSMN project is a long term project built with many individual aspects included such as art, design, game, technology and quality control elements. We strive to guarantee our communities the finest results possible.
            </p>
            <p style={{ color: "#ffffff", marginLeft: '24px' }}>When we’ll be able to proudly stand behind our promise for the GSMN community we will announce the utilities for the first drop of our project, so they can enjoy all the benefits and effort that we have put in each and every GSMN fighter.
            </p>
          </div>
        </div>
      </section>
      <div style={{ backgroundColor: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
        <Row style={{ justifyContent: 'center', alignContent: 'center' }}>
          <p style={{ color: "#ffffff", textTransform: "uppercase", letterSpacing: "7px" }}>OUR TEAM</p>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <p style={{ color: "#ffffff", width: '800px', fontWeight: 300, fontSize: "14px", textTransform: "uppercase", letterSpacing: "7px", marginBottom: "10px", textAlign: 'center' }}>OUR TEAM IS COMPOSED WITH ARTISTS, INVESTORS, ENTREPRENEURS, NFT SPECIALISTS AND BLOCKCHAIN EXPERTS. A DIVERSIFIED TEAM OF PROFESSIONALS SPECIALISED IN THE WEB 3.0.</p>
        </Row>
      </div>
      <div style={{ backgroundColor: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', paddingTop: '64px' }}>
        <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <img src={S__126140929} alt='PFP' height='200px' />
          <img src={S__126140929} alt='PFP' height='200px' />
          <img src={S__126140929} alt='PFP' height='200px' />
          <img src={S__126140929} alt='PFP' height='200px' />
        </Row>

      </div>
      <section style={{ backgroundColor: '#000000', display: 'flex', flexDirection: 'row', paddingTop: '100px', paddingLeft: '120px', paddingRight: '120px' }}>
        <Col span={6} offset={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignContent: 'center', marginRight: '40px' }}>
          <div style={{ position: "relative" }}>
            <h6 style={{ color: '#ffffff', background: "linear-gradient(to right, #12c2e9, #c471ed, #f64f59)", padding: "7px 12px", borderRadius: "10px", display: 'inline-block', marginBottom: '15px' }}>Question and Answers</h6>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ display: 'block', color: "#ffffff", fontWeight: 600, marginBottom: '5px', lineHeight: 1.4, fontSize: '35px' }}>Have</h3>
            <h3 style={{ display: 'block', color: "#ffffff", fontWeight: 600, marginBottom: '5px', lineHeight: 1.4, fontSize: '35px' }}> Question?</h3>
          </div>
          <div style={{ marginTop: '40px', background: '#000000', marginBottom: '50px' }}>
            <span style={{ display: 'inline-block', letterSpacing: '10px', fontSize: '12px', color: '#ffffff', fontWeight: 400, paddingBottom: '10px' }}>JOIN US NOW</span>
            <div style={{}}>
              <div style={{ background: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)', height: '1px', width: '40%' }}>
              </div>
            </div>
          </div>

        </Col>
        <Col span={16} offset={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignContent: 'start', paddingRight: '120px' }}>
          <div style={{ display: 'flex' }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'block' }}>
                <h5 style={{ color: '#ffffff', fontSize: 22, fontWeight: 500 }}>
                  1. When can I mint a GSMN?
                </h5>
                <h6 style={{ color: '#ffffff', boxSizing: 'border-box', marginBottom: '20px', lineHeight: 1.5, fontWeight: 400, fontSize: 14 }}>
                  A pre-sale will be available for our early supporters on Twitter, Discord and Instagram. Details to be confirmed.
                </h6>
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'block' }}>
                <h5 style={{ color: '#ffffff', fontSize: 22, fontWeight: 500 }}>
                  2. When can I mint a GSMN?
                </h5>
                <h6 style={{ color: '#ffffff', boxSizing: 'border-box', marginBottom: '20px', lineHeight: 1.5, fontWeight: 400, fontSize: 14 }}>
                  A pre-sale will be available for our early supporters on Twitter, Discord and Instagram. Details to be confirmed.
                </h6>
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'block' }}>
                <h5 style={{ color: '#ffffff', fontSize: 22, fontWeight: 500 }}>
                  3. When can I mint a GSMN?
                </h5>
                <h6 style={{ color: '#ffffff', boxSizing: 'border-box', marginBottom: '20px', lineHeight: 1.5, fontWeight: 400, fontSize: 14 }}>
                  A pre-sale will be available for our early supporters on Twitter, Discord and Instagram. Details to be confirmed.
                </h6>
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'block' }}>
                <h5 style={{ color: '#ffffff', fontSize: 22, fontWeight: 500 }}>
                  4. When can I mint a GSMN?
                </h5>
                <h6 style={{ color: '#ffffff', boxSizing: 'border-box', marginBottom: '20px', lineHeight: 1.5, fontWeight: 400, fontSize: 14 }}>
                  A pre-sale will be available for our early supporters on Twitter, Discord and Instagram. Details to be confirmed.
                </h6>
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'block' }}>
                <h5 style={{ color: '#ffffff', fontSize: 22, fontWeight: 500 }}>
                  5. When can I mint a GSMN?
                </h5>
                <h6 style={{ color: '#ffffff', boxSizing: 'border-box', marginBottom: '20px', lineHeight: 1.5, fontWeight: 400, fontSize: 14 }}>
                  A pre-sale will be available for our early supporters on Twitter, Discord and Instagram. Details to be confirmed.
                </h6>
                <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', marginTop: 30 }}>
            <div style={{ display: 'flex' }}>
              <div style={{ display: 'block' }}>
                <h5 style={{ color: '#ffffff', fontSize: 22, fontWeight: 500 }}>
                  6. When can I mint a GSMN?
                </h5>
                <h6 style={{ color: '#ffffff', boxSizing: 'border-box', marginBottom: '12px', lineHeight: 1.5, fontWeight: 400, fontSize: 14 }}>
                  A pre-sale will be available for our early supporters on Twitter, Discord and Instagram. Details to be confirmed.
                </h6>
                <div style={{}}></div>
              </div>
            </div>
          </div>
        </Col>

      </section>
      <section style={{ backgroundColor: '#000000' }}>
        <div style={{ margin: 100, display: "flex", justifyContent: "center", alignContent: 'center', paddingLeft: 50, paddingRight: 50 }}>
          <Col span={8}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ color: "#ffffff", marginBottom: 20, fontSize: 30, fontWeight: 500 }}>Social</p>
              <p style={{ display: 'flex', justifyContent: 'start', lineHeight: 1.4, gap: '10px', paddingLeft: 15 }}>
                <a href={INSTAGRAM_LINK} target="_blank" style={{ fontSize: '32px', color: "#ffffff" }}>
                  <InstagramFilled />
                </a>
                <a href={TWITTER_LINK} target="_blank" style={{ fontSize: '32px', color: "#ffffff" }}>
                  <TwitterSquareFilled />
                </a>
              </p>
            </div>
          </Col>

          <Col span={8} offset={6}>
            <div style={{ display: "flex", flexDirection: 'column', alignContent: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }}>

                < img src={bombClubBlack} alt='bombClubBlack' height='40px' />

                <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 20 }} >BombClub</div>
              </div>
              <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-end' }}>
                <p style={{ color: "#ffffff", fontSize: 10, fontWeight: 20, lineHeight: 1.4 }} >@All right reserved</p>

              </div>



            </div>
          </Col>

        </div>
      </section >


    </Layout >
  );
}

export default App;