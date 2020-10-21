import React from 'react';
import CategorySelect from '../components/CategorySelect';
import {withRouter} from 'react-router-dom';
import {Tabs, Tab} from '../components/Tabs';
import PriceForm from '../components/PriceForm';
import {testCategories} from '../testData';
import {TYPE_INCOME, TYPE_OUTCOME, LIST_VIEW, CHART_VIEW} from '../utility';
import PriceList from '../components/PriceList';
import {AppContext} from '../App';
import withContext from '../WithContext';

// match获取路由上的参数
// const Create = ({match}) => {
//     return <h1>create page {match.params.id}</h1>
// }

const tabsText = [LIST_VIEW, CHART_VIEW];
class Create extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedTab: TYPE_OUTCOME,
            selectedCategory: null
        }
    }
    tabChange = (index) => {
        this.setState({
            selectedTab: tabsText[index]
        });
    }
    selectCategory = (category) => {
        // 记录所选择的支出分类，如旅行、吃饭等
        this.setState({
            selectedCategory: category
        });
    }
    submibForm = (data, isEditMode) => {
        if (!isEditMode) {
            // create
            this.props.actions.createItem(data, this.state.selectedCategory.id);
        } else {
            // update
        }
        this.props.history.push('/');
    }
    cancelSubmit = () => {
        this.props.history.push('/');
    }
    render() {
        const {data} = this.props;
        const {items, categories} = data;
        const {selectedTab} = this.state;
        const filterCategories = Object.keys(categories)
        .filter(id => categories[id].type === selectedTab)
        .map(id => categories[id])
        return (
            <div className="create-page py-3 px-3 rounded mt-3" style={{background: '#fff'}}>
                <Tabs activeIndex={0} onTabChange={this.tabChange}>
                    <Tab>支出</Tab>
                    <Tab>收入</Tab>
                </Tabs>
                <CategorySelect
                    categories={filterCategories}
                    onSelectCategory={this.selectCategory}/>
                <PriceForm
                    onFormSubmit={this.submibForm}
                    onCancelSubmit={this.cancelSubmit}
                />
            </div>
        );
    }
}

export default withRouter(withContext(Create));