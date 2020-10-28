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
        const {id} = props.match.params;
        const {categories, items} = props.data;
        this.state = {
            selectedTab: (id && items[id]) ? categories[items[id].cid].type : TYPE_OUTCOME,
            selectedCategory: (id && items[id]) ? categories[items[id].cid] : null
        }
    }
    componentDidMount() {
        const {id} = this.props.match.params;
        this.props.actions.getEditData(id).then(data => {
            const {editItem, categories} = data;
            // 因为constructor优先componentDidMount执行，导致items无值，故在更新后再执行一下,使分类高亮
            this.setState({
                selectedTab: (id && editItem) ? categories[editItem.cid].type : TYPE_OUTCOME,
                selectedCategory: (id && editItem) ? categories[editItem.cid] : null
            })
        });
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
            this.props.actions.createItem(data, this.state.selectedCategory.id).then(() => {
                this.props.history.push('/');
            });
        } else {
            // update
            this.props.actions.updateItem(data, this.state.selectedCategory.id).then(() => {
                this.props.history.push('/');
            });
        }
    }
    cancelSubmit = () => {
        this.props.history.push('/');
    }
    render() {
        const {data} = this.props;
        const {items, categories} = data;
        const {id} = this.props.match.params;
        const editItem = (id && items[id]) ? items[id] : {};
        const {selectedTab, selectedCategory} = this.state;
        const filterCategories = Object.keys(categories)
        .filter(id => categories[id].type === selectedTab)
        .map(id => categories[id]);
        const tabIndex = tabsText.findIndex(text => text === selectedTab);
        return (
            <div className="create-page py-3 px-3 rounded mt-3" style={{background: '#fff'}}>
                <Tabs activeIndex={tabIndex} onTabChange={this.tabChange}>
                    <Tab>支出</Tab>
                    <Tab>收入</Tab>
                </Tabs>
                <CategorySelect
                    categories={filterCategories}
                    onSelectCategory={this.selectCategory}
                    selectedCategory={selectedCategory}/>
                <PriceForm
                    onFormSubmit={this.submibForm}
                    onCancelSubmit={this.cancelSubmit}
                    item={editItem}
                />
            </div>
        );
    }
}

export default withRouter(withContext(Create));