import { Button, Card, Layout, Select, Typography, Menu, Breadcrumb, Radio, Row, Col } from 'antd';
import "antd/dist/antd.css";
import { BigNumber, ethers } from 'ethers';
import React, { useEffect, useState } from 'react';
import Countdown from 'react-countdown';
import styled from 'styled-components';
import Account from './components/Account';
import RoadmapBlock from './components/RoadmapBlock';
import QuestionBlock from './components/QuestionBlock';

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
import S__126140931 from "./images/S__126140931.jpg"
import S__126140932 from "./images/S__126140932.jpg"
import S__126140933 from "./images/S__126140933.jpg"
import S__126140934 from "./images/S__126140934.jpg"

import discordIcon from "./images/discordIcon.png"
import instagramIcon from "./images/instagramIcon.png"
import twitterIcon from "./images/twitterIcon.png"



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
          alignItems: 'flex-start',
          maxWidth: '960px',
          margin: '0 auto'
        }}>

          <a style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }}>
            < img src={bombClubBlack} alt='bombClubBlack' height='40px' />
            <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 400 }} >BombClub</div>
          </a>

          <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', alignItems: 'center' }}>
            <a href={DISCORD_LINK} target="_blank" >
              <img src={discordIcon} height='32px' />
            </a>
            <a href={INSTAGRAM_LINK} target="_blank" >
              <img src={instagramIcon} height='32px' />
            </a>
            <a href={TWITTER_LINK} target="_blank" >
              <img src={twitterIcon} height='32px' />
            </a>

            <Account />

          </div>
        </div>
      </Header >

      <Content style={{ minHeight: '100vh', display: 'flex', gap: 32, justifyContent: 'center', alignItems: 'center', background: '#000000', flexWrap: "wrap" }}>
        <div style={{ display: 'flex', flexDirection: "column", maxWidth: "480px" }}>
          <div style={{ position: "relative" }}>
            <h6 className="h6" style={{ color: '#ffffff' }}>SUMMON YOUR FIGHTER SOUL</h6>
          </div>
          <h1 className="h1" style={{ margin: 0, color: '#ffffff' }}>BombClub</h1>
          <p className='p' style={{ fontSize: 20, maxWidth: '500px' }}>Galosseum (GSMN) is an art collection of 2,222 randomly generated portraits on the Ethereum Blockchain. Each GSMN is unique and comes with different traits varying in rarity. Public Sale Date is to be announced.</p>

          <div>
            <Button size="large" target="_blank" rel="noopener noreferrer" href={DISCORD_LINK} style={{ marginTop: '16px', color: '#ffffff', background: "#000000", fontSize: 20 }}>Join Discord</Button>
          </div>
        </div>
        <div style={{}}>
          <img src={bombClubBlack} alt='bombClubBlack' height='450px' />
        </div>
      </Content>

      <div style={{ background: '#000000' }}>
        <div style={{ background: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)', height: '1.5px', width: '65%', margin: '64px 0px' }}>

        </div>
        <section style={{ display: 'flex', background: '#000000', color: '#ffffff', padding: '100px 150px' }}>

          <Col span={12} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src={S__126140931} height='500px' />
          </Col>
          <Col span={12} style={{ display: 'flex', flexDirection: 'column', color: '#a4a7b1', lineHeight: 2, maxWidth: 600 }}>
            <h1 style={{ color: '#12c2e9', letterSpacing: '10px', marginBottom: '16px', fontSize: 24 }}> WHAT IS GALOSSEUM?</h1>
            <p style={{ fontSize: 20 }}>Gallery x Colosseum.</p>
            <p style={{ fontSize: 20 }}>Due to the inequality of market rewards to talented artists and an unhealthy NFT ecosystem, we as a team decided to work with undiscovered talented artists all around the world to chase their NFT dreams.</p>
            <p style={{ fontSize: 20 }}>Galosseum is a colosseum floating in a space between dimensions. Every 100 years, Gods gather to watch a new tournament take place where the winner shall be granted excalibur and become the ruler for the next 100 years. Each of the contestants are capable of utilizing a variety of magic and summoning various fighter souls with magic cards.</p>
            <p style={{ fontSize: 20 }}>Please join us at the Galosseum, summon your fighter soul and unlock all stories about this secretive community.</p>
            <div>
              <Button size="large" target="_blank" rel="noopener noreferrer" href={DISCORD_LINK} style={{ marginTop: '16px', color: '#ffffff', background: "#000000" }}>Join Discord</Button>
            </div>
          </Col>

        </section>
      </div>
      <section style={{ display: 'flex', flexDirection: 'column', background: '#000000', color: '#ffffff', padding: '120px 300px' }}>

        <div>
          <h1 style={{ color: '#12c2e9', letterSpacing: '10px', marginBottom: '20px', marginLeft: '16px', fontSize: '30px', textTransform: 'uppercase' }}> Roadmap</h1>
        </div>
        <div style={{ backgroundColor: '#232323', display: 'flex', flexDirection: 'column', justifyContent: "center", alignItems: 'center', padding: 40 }}>

          <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <RoadmapBlock stage="Phase 1" stageName="Art" text="In ultra-high 4k resolution, all 7,777 Bomb Club NFTs will be of the highest quality our award-winning artists are used to delivering. Our goal is to deliver the most bespoke and aesthetically pleasing design in the NFT world. With over 200+ different traits, each bomb is also guaranteed to be excitingly unique from all others." ></RoadmapBlock>
          </div>
          <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <RoadmapBlock stage="Phase 2" stageName="Merchandise" text="Not a single corner was cut in the making of bomb club , and we continue this through the extension of physical merchandise for our community .The official website of the bomb club brand will be set up to sell luxury goods on it. Players who own our nft can get the agency rights of clothing. There will be a brand member account. There will be a 50% discount on the official website and counter prices for products. Bomb nft as the official pass clothing brand's revenue will also be divided equally among all holders after deducting costs" ></RoadmapBlock>
          </div>
          <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <RoadmapBlock stage="Phase 3" stageName="DAO" text="bomb made in a healthy community where everyone has a say. For that reason, they use a Decentralized Autonomous Organization (DAO) to make decisions crucial to the development of the lab. Each bomb’s vote is equally important to the growth and evolution of the colony.We will launch 5-10 special NFTs, which will be recycled at the guaranteed price of 3E-10E after launch, and must be listed for sale again at the recycling price * 0.7. Buying and holding special NFTs can join the ranks of community decision makers and participate in All formulations and decision-making directions in the later stage, all our activities and follow-up actions will be discussed with members who hold special bombs, so that we can hear the voice of the community" ></RoadmapBlock>
          </div>
          <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <RoadmapBlock stage="Phase 4" stageName="Metaverse" text="Joining the Metaverse - All bomb club NFTs will be fully functional in the Metaverse. As a holder, you will be able to use your avatar in games, movies, in 3D form, for Metaverse meetings or in any other way you want." ></RoadmapBlock>
          </div>
          <div style={{ borderBottom: "1px solid rgba(255, 255, 255, 0.2)" }}>
            <RoadmapBlock stage="Phase 5" stageName="GAMEFI" text="The game will be similar to Coin master
(Using your own unique bomb to attack other people's cities and earn currency)
To promote the game, we will use the money earned by NFT to find suitable advertisements. 50% of the game's income will be given to the holder." ></RoadmapBlock>
          </div>
          <div style={{}}>
            <RoadmapBlock stage="Phase 6" stageName="sustainable" text="Bomb club doesn't stop. Ever. We will continue creating value for our NFT owners and community members, to make your investments pay off on short-, medium- and long-terms. We are committed to making our project an industry best practices example. To do so, we'll support all activities with massive marketing campaigns which will take over the world's largest cities." ></RoadmapBlock>
          </div>


        </div>
      </section>
      <div style={{ backgroundColor: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center' }}>
        <Row style={{ justifyContent: 'center', alignContent: 'center' }}>
          <p style={{
            color: "#ffffff", textTransform: "uppercase", letterSpacing: "7px", fontSize: 20
          }}>OUR TEAM</p>
        </Row>
        <Row style={{ display: 'flex', justifyContent: 'center', alignContent: 'center' }}>
          <p style={{
            background: "-webkit-linear-gradient(45deg, #12c2e9, #c471ed, #f64f59)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent", width: '800px', fontWeight: 400, fontSize: 16, textTransform: "uppercase", letterSpacing: "7px", marginBottom: "10px", textAlign: 'center'
          }}>OUR TEAM IS COMPOSED WITH ARTISTS, INVESTORS, ENTREPRENEURS, NFT SPECIALISTS AND BLOCKCHAIN EXPERTS. A DIVERSIFIED TEAM OF PROFESSIONALS SPECIALISED IN THE WEB 3.0.</p>
        </Row>
      </div>
      <div style={{ backgroundColor: '#000000', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignContent: 'center', paddingTop: '64px' }}>
        <Row style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-evenly' }}>
          <img src={S__126140929} alt='PFP' height='300px' />
          <img src={S__126140931} alt='PFP' height='300px' />
          <img src={S__126140932} alt='PFP' height='300px' />
          <img src={S__126140933} alt='PFP' height='300px' />
        </Row>

      </div>
      <section style={{ backgroundColor: '#000000', display: 'flex', flexDirection: 'row', paddingTop: '100px', paddingLeft: '120px', paddingRight: '120px' }}>
        <Col span={4} offset={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignContent: 'center', paddingTop: 30, marginRight: 20 }}>
          <div style={{ position: "relative" }}>
            <h6 style={{ color: '#ffffff', background: "linear-gradient(to right, #12c2e9, #c471ed, #f64f59)", padding: "7px 12px", borderRadius: "10px", display: 'inline-block', marginBottom: '15px', fontSize: 20 }}>Question and Answers</h6>
          </div>
          <div style={{ textAlign: 'left' }}>
            <h3 style={{ display: 'block', color: "#ffffff", fontWeight: 600, marginBottom: '5px', lineHeight: 1.4, fontSize: 40 }}>Have</h3>
            <h3 style={{ display: 'block', color: "#ffffff", fontWeight: 600, marginBottom: '5px', lineHeight: 1.4, fontSize: 40 }}> Question?</h3>
          </div>
          <div style={{ marginTop: '40px', background: '#000000', marginBottom: '50px' }}>
            <span style={{ display: 'inline-block', letterSpacing: '10px', fontSize: 18, color: '#ffffff', fontWeight: 400, paddingBottom: '10px' }}>JOIN US NOW</span>
            <div style={{}}>
              <div style={{ background: 'linear-gradient(to right, #12c2e9, #c471ed, #f64f59)', height: '1px', width: '40%' }}>
              </div>
            </div>
          </div>

        </Col>
        <Col span={16} offset={2} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'start', alignContent: 'start', paddingRight: '120px' }}>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="1. WHY SHOULD I BECOME A HOLDER OF BOMB CLUB ?" answer="From the ultra-high resolution 4k digital collectibles designed by our award-winning artists, to our strong leadership with aims to dominate multiple aspects of gaming and the metaverse, and the amount of hype and influencers joining our team, Meta Penguin Island is positioned to be one of the strongest projects of the year."></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="2. WHEN IS THE OFFICIAL LAUNCH ?" answer="Raffle registration will open on April 12th @ 10am EST, and will be open for 12 hours. Minting starts April 13th @ 10am EST, exactly 24 hours after the start of the raffle. If you are whitelisted, you can mint 1 hour earlier, at 9am EST, and will have until 10am to exercise your guaranteed mint."></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="3. WHAT BLOCKCHAIN DOES THE PROJECT LIVE ON ?" answer="Bomb Club will blasting on the Ethereum blockchain."></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="4. WHAT IS THE TOTAL SUPPLY ?" answer="There will be 7,777 bomb in the collection, created randomly from over 200+ unique traits."></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="5. WHAT IS THE MINT PRICE ?" answer="Ξ0.18"></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="5. HOW MANY CAN I MINT ?" answer="Max per person is 2"></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="6. WILL BOMB CLUB HAVE UTILITY ?" answer="Of course! Our development team is of the same top-tier caliber as our artists, and have big plans to enter the gaming space and metaverse with the bomb club. As an early supporter, you'll have the ability to get into a blue chip project before it reaches the masses."></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="7. HOW CAN I GET WHITELISTED ?" answer="Good question! Please refer to 《📌》how-to-wl for details."></QuestionBlock>
          </div>
          <div style={{ display: 'flex', padding: 30 }}>
            <QuestionBlock question="8. WILL WE EVER SEND YOU DMs ?" answer=":alert:  Absolutely not! bomb club admins, moderators, and team members will never send you a DM on Discord. If you get one that appears as if it's from us, it is a scam. To ensure safety, we highly recommend turning off your DMs from server members entirely. You won't miss anything important - just follow the 《📣》announcements channel. Additionally, the ONLY links you should ever click will be in 《🔗》official-links  . To turn off DMs from server members, click our server name in the top left to open the drop-down menu. Select 《Privacy Settings》 and toggle the button."></QuestionBlock>
          </div>
        </Col>

      </section>
      <section style={{ backgroundColor: '#000000' }}>
        <div style={{ margin: 100, display: "flex", justifyContent: "center", alignContent: 'center', paddingLeft: 50, paddingRight: 50 }}>
          <Col span={8}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <p style={{ color: "#ffffff", marginBottom: 20, fontSize: 30, fontWeight: 500 }}>Social</p>
              <p style={{ display: 'flex', justifyContent: 'start', lineHeight: 1.4, gap: 30, paddingLeft: 15 }}>
                <a href={DISCORD_LINK} target="_blank" >
                  <img src={discordIcon} height='32px' />
                </a>
                <a href={INSTAGRAM_LINK} target="_blank" >
                  <img src={instagramIcon} height='32px' />
                </a>
                <a href={TWITTER_LINK} target="_blank" >
                  <img src={twitterIcon} height='32px' />
                </a>
              </p>
            </div>
          </Col>

          <Col span={8} offset={6}>
            <div style={{ display: "flex", flexDirection: 'column', alignContent: 'flex-start' }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '10px', justifyContent: 'flex-end', alignContent: "center", alignItems: 'center' }}>

                < img src={bombClubBlack} alt='bombClubBlack' height='40px' />

                <div style={{ color: "#ffffff", fontSize: 30, fontWeight: 40 }} >BombClub</div>
              </div>
              <div style={{ display: "flex", flexDirection: 'row', justifyContent: 'flex-end' }}>
                <p style={{ color: "#ffffff", fontSize: 20, fontWeight: 20, lineHeight: 1.4 }} >@All right reserved</p>

              </div>
            </div>
          </Col>

        </div>
      </section >


    </Layout >
  );
}

export default App;