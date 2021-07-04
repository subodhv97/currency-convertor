import React from "react";
import axios from "axios";
import { Card} from 'react-bootstrap';
import './Currency.css';
import { FaBeer,FaMoneyBill } from 'react-icons/fa';
class Currency extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            result: null,
            fromCurrency: "USD",
            toCurrency: "INR",
            amount: 1,
            currencies: []
        };
    }
    componentDidMount() {
        axios
            .get("http://api.exchangeratesapi.io/v1/latest?access_key=c773a1d9cd73dc6ccbab61a014bd37fc")
            .then(response => {
                const currencyAr = ["INR"];
                for (const key in response.data.rates) {
                    currencyAr.push(key);
                }
                this.setState({ currencies: currencyAr });
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }
    convertHandler = () => {
        if (this.state.fromCurrency !== this.state.toCurrency) {
            axios
                .get(
                    `http://api.exchangeratesapi.io/v1/latest?access_key=c773a1d9cd73dc6ccbab61a014bd37fc?base=${this.state.fromCurrency
                    }&symbols=${this.state.toCurrency}`
                )
                .then(response => {
                    const result =
                        this.state.amount * response.data.rates[this.state.toCurrency];
                    this.setState({ result: result.toFixed(5) });
                })
                .catch(error => {
                    console.log("Opps", error.message);
                });
        } else {
            this.setState({ result: "You cant convert the same currency!" });
        }
    };
    selectHandler = event => {
        if (event.target.name === "from") {
            this.setState({ fromCurrency: event.target.value });
        } else {
            if (event.target.name === "to") {
                this.setState({ toCurrency: event.target.value });
            }
        }
    };
    render() {
        return (
            <div className="Converter">
                <h2>
                    <span>Currency </span> Converter
                    <span role="img" aria-label="money">
                    <FaMoneyBill />
                    </span>
                </h2>
                <div className="From">
                    <input
                        name="amount"
                        type="text"
                        value={this.state.amount}
                        onChange={event => this.setState({ amount: event.target.value })}
                    />
                    <br/>
                    <br/>
                    <select
                        name="from"
                        onChange={event => this.selectHandler(event)}
                        value={this.state.fromCurrency}
                    >
                        {this.state.currencies.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                    </select>
                    <select
                        name="to"
                        onChange={event => this.selectHandler(event)}
                        value={this.state.toCurrency}
                    >
                        {this.state.currencies.map(cur => (
                            <option key={cur}>{cur}</option>
                        ))}
                    </select>
                    <br/>
                    <br/>

                    <button onClick={this.convertHandler}>Convert</button>
                  {this.state.result && <h3>{this.state.result}</h3>}
                    
                </div>
            </div>
        );
    }
}
export default Currency;