import React from 'react'
import PropTypes from 'prop-types'
import {padLeft, range} from '../utility'

class MonthPicker extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            isOpen: false,
            selectedYear: this.props.year
        }
    }
    componentDidMount() {
        document.addEventListener('click', this.handleClick, false)
    }
    componentWillUnmount() {
        document.removeEventListener('click', this.handleClick, false)
    }
    handleClick = (event) => {
        // this.node出现在dom节点上
        if (this.node.contains(event.target)) {
            return;
        }
        this.setState({
            isOpen: false
        })
    }
    toggleDropdown = (event) => {
        event.preventDefault()
        this.setState({
            isOpen: !this.state.isOpen,
            selectedYear: this.props.year
        })
    }
    selectedYear = (event, yearNumber) => {
        event.preventDefault()
        this.setState({
            selectedYear: yearNumber
        })
    }
    selectedMonth = (event, monthNumber) => {
        event.preventDefault()
        // 关闭日期弹框
        this.setState({
            isOpen: false
        })
        // 传出所选的年与月
        this.props.onChange(this.state.selectedYear, monthNumber)
    }
    render() {
        const {year, month} = this.props
        const {isOpen, selectedYear} = this.state
        const monthRange = range(12, 1)
        const yearRange = range(9, -4).map(number => number + year)
        return (
            <div className="dropdown month-picker-component" ref={ref => {this.node = ref}}>
                <h4>选择月份</h4>
                <button
                    className="btn btn-lg btn-secondary dropdown-toggle"
                    onClick={this.toggleDropdown}
                >
                    {`${year}年 ${padLeft(month)}月`}
                </button>
                {isOpen &&
                    <div className="dropdown-menu" style={{display: 'block'}}>
                        <div className="row">
                            <div className="col border-right years-range">
                                {yearRange.map((yearNumber, index) =>
                                    <a
                                        href="#"
                                        key={index} 
                                        className={yearNumber === selectedYear ? 'dropdown-item active' : 'dropdown-item'}
                                        onClick={event => this.selectedYear(event, yearNumber)}
                                    >
                                        {yearNumber} 年
                                    </a>
                                )}
                            </div>
                            <div className="col months-range">
                                {monthRange.map((monthNumber, index) =>
                                    <a
                                        href="#"
                                        key={index}
                                        className={monthNumber === month ? 'dropdown-item active' : 'dropdown-item'}
                                        onClick={event => this.selectedMonth(event, monthNumber)}
                                    >
                                        {padLeft(monthNumber)} 月
                                    </a>
                                )}
                            </div>
                        </div>
                    </div>
                }
            </div>
        )
    }
}
MonthPicker.propTypes = {
    year: PropTypes.number.isRequired,
    month: PropTypes.number.isRequired,
    onChange: PropTypes.func.isRequired
}
export default MonthPicker