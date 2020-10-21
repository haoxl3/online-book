import React from 'react';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css';
import Home from './containers/Home';
import Create from './containers/Create';
import {flatternArr} from './utility';
import {testItems, testCategories} from './testData';

export const AppContext = React.createContext();
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            items: flatternArr(testItems),
            categories: flatternArr(testCategories)
        };
        // 创建全局变量actions,然后自顶向下传deleteItem事件
        this.actions = {
            deleteItem: item => {
                // this.state.items = {1: {}, 2:{}}
                console.log('***item', item)
                delete this.state.items[item.id];
                this.setState({
                    items: this.state.items
                });
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
