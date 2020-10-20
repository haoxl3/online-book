import React from 'react';
import CategorySelect from '../components/CategorySelect';
import {Tabs, Tab} from '../components/Tabs';
import PriceForm from '../components/PriceForm';
import {testCategories} from '../testData';
import {TYPE_INCOME, TYPE_OUTCOME} from '../utility';
import PriceList from '../components/PriceList';

// match获取路由上的参数
// const Create = ({match}) => {
//     return <h1>create page {match.params.id}</h1>
// }
class Create extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        const filterCategories = testCategories.filter(category => category.type === TYPE_OUTCOME);
        return(
            <div className="create-page py-3 px-3 rounded mt-3" style={{background: '#fff'}}>
                <Tabs activeIndex={0} onTabChange={() => {}}>
                    <Tab>支出</Tab>
                    <Tab>收入</Tab>
                </Tabs>
                <CategorySelect categories={filterCategories} onSelectCategory={()=>{}}/>
                <PriceForm
                    onFormSubmit={() => {}}
                    onCancelSubmit={() => {}}
                />
            </div>
        )
    }
}

export default Create