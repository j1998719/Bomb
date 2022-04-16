import React, { useState } from 'react'
import { Button, Modal, Typography } from 'antd'
import styled from 'styled-components';
import { injected, walletconnect } from '../connectors'
import MetaMaskIcon from '../images/metamask.png';
import WalletConnectIcon from '../images/walletConnectIcon.svg';
import { useActiveWeb3React } from '../hooks/web3';
import { getEllipsisTxt } from '../helpers/formatters'
import { useMediaQuery } from 'react-responsive'
import { isMobile } from '../utils/userAgent'
import { RightOutlined } from '@ant-design/icons'

interface Props {
    stage: String,
    stageName: String,
    text: String
}

const RoadmapBlock = (props: Props) => {

    return <div style={{ padding: '16px' }}>
        <div style={{ fontSize: "48px", fontWeight: 700, color: "transparent", WebkitTextStroke: "1px #b19777", paddingLeft: '16px' }}>{props.stage}</div>
        <div style={{ color: "#ffffff", letterSpacing: "1px", lineHeight: 1.4, fontWeight: 500, fontSize: 24, paddingLeft: '16px', padding: '12px', textTransform: 'uppercase' }}>{props.stageName}</div>
        <p style={{ color: "#ffffff", padding: 24, paddingBottom: 36, fontSize: 20, lineHeight: 1.6 }}>{props.text}
        </p>
    </div>



}

export default RoadmapBlock
