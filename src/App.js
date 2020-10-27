import React from 'react';
import axios from 'axios';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Home from './containers/Home';
import Create from './containers/Create';
import {flatternArr, ID, parseToYearAndMonth} from './utility';

export const AppContext = React.createContext();
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: {},
            categories: {},
            isLoading: false,
            currentDate: parseToYearAndMonth()
        };
        // 创建全局变量actions,然后自顶向下传deleteItem事件
        this.actions = {
            getInitalData: () => {
                this.setState({
                    isLoading: true
                });
                const {currentDate} = this.state;
                const getURLWithData = `/items?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
                const promiseArr = [axios.get('/categories'), axios.get(getURLWithData)];
                Promise.all(promiseArr).then(arr => {
                    const [categories, items] = arr;
                    this.setState({
                        items: flatternArr(items.data),
                        categories: flatternArr(categories.data),
                        isLoading: false
                    });
                });
            },
            selectNewMonth: (year, month) => {
                // 根据选择的日期，请求相应日期的数据，并更新日期选择框与展示的结果
                const getURLWithData = `/items?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
                axios.get(getURLWithData).then(items => {
                    this.setState({
                        items: flatternArr(items.data),
                        currentDate: {year, month}
                    });
                });
            },
            deleteItem: item => {
                // this.state.items = {1: {}, 2:{}}
                axios.delete(`/items/${item.id}`).then(() => {
                    delete this.state.items[item.id];
                    this.setState({
                        items: this.state.items
                    });
                });
            },
            createItem: (data, categoryId) => {
                const newId = ID();
                const parsedDate = parseToYearAndMonth(data.date);
                data.monthCategory = `${parsedDate.year}-${parsedDate.month}`;
                data.timestamp = new Date(data.date).getTime();
                const newItem = {...data, id: newId, cid: categoryId};
                this.setState({
                    items: {...this.state.items, [newId]: newItem}
                });
            },
            updateItem: (item, updatedCategoryId) => {
                const modifedItem = {
                    ...item,
                    cid: updatedCategoryId,
                    timestamp: new Date(item.date).getTime()
                }
                this.setState({
                    items: {...this.state.items, [modifedItem.id]: modifedItem}
                })
            }
        };
    }
    render() {
        return (
            <AppContext.Provider value={{
                state: this.state,
                actions: this.actions
            }}>
                <Router>
                    <div className='App'>
                        <ul>
                            <Link to="/create">create</Link>
                        </ul>
                        <div className="container pb-5">
                            <Route path="/" exact component={Home}></Route>
                            <Route path="/create" component={Create}></Route>
                            <Route path="/edit/:id" component={Create}></Route>
                        </div>
                    </div>
                </Router>
            </AppContext.Provider>
        );
    }
}

export default App;
