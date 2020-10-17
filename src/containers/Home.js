import React from 'react';
import logo from '../logo.svg';
import {LIST_VIEW, CHART_VIEW, TYPE_INCOME, TYPE_OUTCOME} from '../utility';
import PriceList from '../components/PriceList';
import ViewTab from '../components/ViewTab';
import MonthPicker from '../components/MonthPicker';
import CreateBtn from '../components/CreateBtn';
import TotalPrice from '../components/TotalPrice';

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

class Home extends React.Component {
    render() {
        let totalIncome = 0;
        let totalOutcome = 0;
        items.forEach(item => {
            if (item.category.type === TYPE_OUTCOME) {
                totalOutcome += item.price;
            } else {
                totalIncome += item.price;
            }
        })
        return (
            <React.Fragment>
                <header className='App-header'>
                    <div className="row mb-5">
                        <img src={logo} className='App-logo' alt='logo'/>
                    </div>
                    <div className="row">
                        <div className="col">
                            <MonthPicker
                                year={2018}
                                month={8}
                                onChange={() => {}}
                            />
                        </div>
                        <div className="col">
                            <TotalPrice
                                income={totalIncome}
                                outcome={totalOutcome}
                            />
                        </div>
                    </div>
                </header>
                <div className="content-area py-3 px-3">
                    <ViewTab activeTab={LIST_VIEW} onTabChange={() => {}}/>
                    <CreateBtn onClick={() => {}}/>
                    <PriceList
                        items={items}
                        onModifyItem={() => {}}
                        onDeleteItem={() => {}}
                    />
                </div>
            </React.Fragment>
        );
    }
}
export default Home;