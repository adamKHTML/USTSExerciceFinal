import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import { FaHome } from 'react-icons/fa';

const Header = () => {
    return (
        <HeaderContainer>
            <HomeLink to="/dashboard">
                <FaHome size={30} />
            </HomeLink>
        </HeaderContainer>
    );
};

export default Header;

const HeaderContainer = styled.header`
    position: fixed;
    top: 0;
    width: 100%;
    background-color: transparent;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    padding: 15px;
    z-index: 1000;
`;

const HomeLink = styled(Link)`
    color: #23232e;
    text-decoration: none;
    margin-left: 20px;
    
    &:hover {
        color:  #ef41b5;
    }
`;
