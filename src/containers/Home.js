import React from 'react';
import logo from '../logo.svg';
import Ionicon from 'react-ionicons';
import {withRouter} from 'react-router-dom';
import {LIST_VIEW, CHART_VIEW, TYPE_INCOME, TYPE_OUTCOME, parseToYearAndMonth, padLeft} from '../utility';
import PriceList from '../components/PriceList';
import ViewTab from '../components/ViewTab';
import MonthPicker from '../components/MonthPicker';
import CreateBtn from '../components/CreateBtn';
import TotalPrice from '../components/TotalPrice';
import {Tabs, Tab} from '../components/Tabs';
import withContext from '../WithContext';

export const categories = {
    '1': {
        id: '1',
        name: '旅行',
        type: 'outcome',
        iconName: 'ios-plane'
    },
    '2': {
        id: '2',
        name: 'ad旅行',
        type: 'outcome',
        iconName: 'ios-plane'
    }
}
export const items = [
    {
        id: 1,
        title: '去旅游',
        price: 2000,
        date: '2020-10-16',
        cid: '1'
    },
    {
        id: 2,
        title: '去国外旅游',
        price: 2000,
        date: '2020-03-26',
        cid: '2'
    },
    {
        id: 3,
        title: '去旅游',
        price: 2000,
        date: '2020-10-19',
        cid: '1'
    }
];
const newItem = {
    id: 3,
    title: '新添加的项',
    price: 1000,
    date: '2020-10-18',
    cid: '1'
};
const tabsText = [LIST_VIEW, CHART_VIEW];

class Home extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            tabView: tabsText[0]
        }
    }
    componentDidMount() {
        this.props.actions.getInitalData();
    }
    changeView = (index) => {
        this.setState({
            tabView: tabsText[index]
        });
    }
    changeDate = (year, month) => {
        // 调用父组件的更新日期方法
        this.props.actions.selectNewMonth(year, month);
    }
    modifyItem = (item) => {
        // const modifiedItems = this.state.items.map(item => {
        //     if (item.id === modifiedItem.id) {
        //         return {...item, title: '更新后的标题'};
        //     } else {
        //         return item;
        //     }
        // });
        // this.setState({
        //     items: modifiedItems
        // });
        this.props.history.push(`/edit/${item.id}`);
    }
    createItem = () => {
        // this.setState({
        //     items: [newItem, ...this.state.items]
        // });
        // 使用路由withRouter后props便自带了history
        this.props.history.push('/create');
    }
    deleteItem = (item) => {
        // const filteredItems = this.state.items.filter(item => item.id !== deletedItem.id);
        // this.setState({
        //     items: filteredItems
        // });
        // 调用context中actions传来的deleteItem方法，即最初从App传来的
        this.props.actions.deleteItem(item);
    }
    render() {
        const {data} = this.props;
        const {items, categories, currentDate} = data;
        const {tabView} = this.state;
        // 将categories与items.cid关联,给item添加category属性并赋值
        const itemsWithCategory = Object.keys(items).map(id => {
            items[id].category = categories[items[id].cid];
            return items[id];
        });
        let totalIncome = 0;
        let totalOutcome = 0;
        itemsWithCategory.forEach(item => {
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
                                year={currentDate.year}
                                month={currentDate.month}
                                onChange={this.changeDate}
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
                    <Tabs activeIndex={0} onTabChange={this.changeView}>
                        <Tab>
                            <Ionicon
                                className="rounded-circle mr-2"
                                fontSize="25px"
                                color={'#007bff'}
                                icon='ios-paper'
                            />
                            列表模式
                        </Tab>
                        <Tab>
                            <Ionicon
                                className="rounded-circle mr-2"
                                fontSize="25px"
                                color={'#007bff'}
                                icon='ios-pie'
                            />
                            图表模式
                        </Tab>
                    </Tabs>
                    <ViewTab activeTab={tabView} onTabChange={this.changeView}/>
                    <CreateBtn onClick={this.createItem}/>
                    {tabView === LIST_VIEW &&
                        <PriceList
                            items={itemsWithCategory}
                            onModifyItem={this.modifyItem}
                            onDeleteItem={this.deleteItem}
                        />
                    }
                    {tabView === CHART_VIEW &&
                        <h1 className="chart-title">图表</h1>
                    }
                </div>
            </React.Fragment>
        );
    }
}
export default withRouter(withContext(Home));