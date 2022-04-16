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
    question: String,
    answer: String,
}

const QuestionBlock = (props: Props) => {

    return <div style={{ display: 'flex', maxWidth: 800 }}>
        <div style={{ display: 'block' }}>
            <h5 style={{ color: '#ffffff', fontSize: 24, fontWeight: 500 }}>
                {props.question}
            </h5>
            <h6 style={{ color: '#ffffff', boxSizing: 'border-box', marginBottom: 25, lineHeight: 1.6, fontWeight: 400, fontSize: 18 }}>
                {props.answer}
            </h6>
            <div style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.2)' }}></div>
        </div>
    </div>



}

export default QuestionBlock
