import React from 'react';
import logo from './logo.svg';
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import PriceList from './components/PriceList';
const items = [
    {
        id: 1,
        title: '去旅游',
        price: 2000,
        date: '2020-10-16',
        category: {
            id: '1',
            name: '旅行',
            type: 'outcome',
            iconName: 'ios-plane'
        }
    },
    {
        id: 2,
        title: '去国外旅游',
        price: 2000,
        date: '2020-10-16',
        category: {
            id: '1',
            name: '旅行',
            type: 'outcome',
            iconName: 'ios-plane'
        }
    }
];

function App() {
    return (
        <div className='App'>
            <header className='App-header'>
                <img src={logo} className='App-logo' alt='logo' />
                    <p>
                    Edit <code>src/App.js</code> and save to reload.
                    </p>
                <a
                    className='App-link'
                    href='https://reactjs.org'
                    target='_blank'
                    rel='noopener noreferrer'
                >
                Learn React
                </a>
            </header>
            <PriceList
                items={items}
                onModifyItem={item => {alert(item.id)}}
                onDeleteItem={item => {alert(item.id)}}
            />
        </div>
    );
}

export default App;
