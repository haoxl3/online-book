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
        // 异步方法时loading先为True，请求成功再为false，但在每个方法里都这样写比较
        // 繁琐，故写一个共用方法被调用即可
        const withLoading = cb => {
            // 获取回调函数的参数ES6...args
            return (...args) => {
                this.setState({
                    isLoading: true
                });
                return cb(...args);
            };
        };
        // 创建全局变量actions,然后自顶向下传deleteItem事件
        this.actions = {
            // getInitalData: () => {
            //     this.setState({
            //         isLoading: true
            //     });
            //     const {currentDate} = this.state;
            //     const getURLWithData = `/items?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
            //     const promiseArr = [axios.get('/categories'), axios.get(getURLWithData)];
            //     Promise.all(promiseArr).then(arr => {
            //         const [categories, items] = arr;
            //         this.setState({
            //             items: flatternArr(items.data),
            //             categories: flatternArr(categories.data),
            //             isLoading: false
            //         });
            //     });
            // },
            // 将上面的方法改成async await
            getInitalData: withLoading(async () => {
                this.setState({
                    isLoading: true
                });
                const {currentDate} = this.state;
                const getURLWithData = `/items?monthCategory=${currentDate.year}-${currentDate.month}&_sort=timestamp&_order=desc`;
                const results = await Promise.all([axios.get('/categories'), axios.get(getURLWithData)]);
                const [categories, items] = results;
                this.setState({
                    items: flatternArr(items.data),
                    categories: flatternArr(categories.data),
                    isLoading: false
                });
            }),
            // selectNewMonth: (year, month) => {
            //     // 根据选择的日期，请求相应日期的数据，并更新日期选择框与展示的结果
            //     const getURLWithData = `/items?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
            //     axios.get(getURLWithData).then(items => {
            //         this.setState({
            //             items: flatternArr(items.data),
            //             currentDate: {year, month}
            //         });
            //     });
            // },
            // async版
            selectNewMonth: withLoading(async (year, month) => {
                // 根据选择的日期，请求相应日期的数据，并更新日期选择框与展示的结果
                const getURLWithData = `/items?monthCategory=${year}-${month}&_sort=timestamp&_order=desc`;
                const items = await axios.get(getURLWithData);
                this.setState({
                    items: flatternArr(items.data),
                    currentDate: {year, month},
                    isLoading: false
                });
            }),
            // deleteItem: item => {
            //     // this.state.items = {1: {}, 2:{}}
            //     axios.delete(`/items/${item.id}`).then(() => {
            //         delete this.state.items[item.id];
            //         this.setState({
            //             items: this.state.items
            //         });
            //     });
            // },
            // async版
            deleteItem: withLoading(async item => {
                // this.state.items = {1: {}, 2:{}}
                const deleteItem = await axios.delete(`/items/${item.id}`);
                delete this.state.items[item.id];
                this.setState({
                    items: this.state.items,
                    isLoading: false
                });
                return deleteItem; // 如果不需要可不返回
            }),
            getEditData: withLoading(async id => {
                const {items, categories} = this.state;
                // 在编辑页可修改地址栏的id进行切换条目，需要先判断id是否存在
                let promiseArr = [];
                if (Object.keys(categories).length === 0) {
                    promiseArr.push(axios.get('/categories'));
                }
                const itemAlreadyFeched = (Object.keys(items).indexOf(id) > -1);
                if (id && !itemAlreadyFeched) {
                    promiseArr.push(axios.get(`/items/${id}`));
                }
                const [fetchedCategories, editItem] = await Promise.all(promiseArr);
                const finalCategories = fetchedCategories ? flatternArr(fetchedCategories.data) : categories;
                const finalItem = editItem ? editItem.data : items[id];
                if (id) {
                    this.setState({
                        categories: finalCategories,
                        isLoading: false,
                        items: {...this.state.items, [id]: finalItem}
                    });
                } else {
                    this.setState({
                        categories: finalCategories,
                        isLoading: false
                    });
                }
                return {
                    categories: finalCategories,
                    editItem: finalItem
                };
            }),
            createItem: withLoading(async (data, categoryId) => {
                const newId = ID();
                const parsedDate = parseToYearAndMonth(data.date);
                data.monthCategory = `${parsedDate.year}-${parsedDate.month}`;
                data.timestamp = new Date(data.date).getTime();
                const newItem = await axios.post('/items', {...data, id: newId, cid: categoryId});
                this.setState({
                    items: {...this.state.items, [newId]: newItem},
                    isLoading: false
                });
                return newItem.data;
            }),
            updateItem: withLoading(async (item, updatedCategoryId) => {
                const updatedData = {
                    ...item,
                    cid: updatedCategoryId,
                    timestamp: new Date(item.date).getTime()
                };
                const modifedItem = await axios.put(`/items/${item.id}`, updatedData);
                this.setState({
                    items: {...this.state.items, [modifedItem.id]: modifedItem.data},
                    isLoading: false
                });
                return modifedItem.data;
            })
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
