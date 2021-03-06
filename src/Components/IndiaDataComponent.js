import React, {  PureComponent } from 'react';
import {LineChart, Line, ResponsiveContainer} from 'recharts';
import "./IndiaDataComponent.css";


class NationData extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            IndData: null,
            GraphData: null,
            confirmedData:null,
            activeData: null,
            deceasedData: null,
            recoveredData: null,
        }
    }
    async componentDidMount(){
        const response = await fetch("https://api.covid19india.org/v4/data.json");
        const data = await response.json();
        this.setState({IndData: data.TT, loading: false})
        console.log(this.state.IndData)
        const resp = await fetch("https://api.covid19india.org/data.json");
        const d = await resp.json();
        this.setState({GraphData: d.cases_time_series.slice(d.cases_time_series.length-30, d.cases_time_series.length), loading: false});

        var activearr = [];
        var confirmarr=[];
        var deceasearr=[];
        var recoverarr=[];
        for(var i=0;i< this.state.GraphData.length;i++){
            var activeobj = {
                "active": parseInt(this.state.GraphData[i].dailyconfirmed)-parseInt(this.state.GraphData[i].dailydeceased)-parseInt(this.state.GraphData[i].dailyrecovered),
            }
            var confirmobj ={
                "confirm": parseInt(this.state.GraphData[i].dailyconfirmed)
            }
            var deceaseobj={
                "decease": parseInt(this.state.GraphData[i].dailydeceased)
            }
            var recoverobj={
                "recover": parseInt(this.state.GraphData[i].dailyrecovered)
            }
            activearr.push(activeobj);
            confirmarr.push(confirmobj);
            deceasearr.push(deceaseobj);
            recoverarr.push(recoverobj);
        }
        this.setState({activeData: activearr, confirmedData:confirmarr, deceasedData: deceasearr, recoveredData: recoverarr});
        console.log(this.state.activeData);
        console.log(this.state.GraphData)
        console.log(this.state.GraphData.length)
    }

    render(){
        return (
            <div className="totcases">
                <div>

                {this.state.loading || (!this.state.IndData.total && !this.state.GraphData)? (
                    <div>loading ...</div>
                ) :

            <div>
                <div className='row justify-content-center' >
                    <div className="confirmed col-3 ">
                        <h6 style={{fontSize: 14}}>Confirmed</h6>
                        <p>+{this.state.IndData.delta.confirmed}</p>
                        <h2>{this.state.IndData.total.confirmed}</h2>
                        <div  className="confirmedchart minichart">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart width={150} height={100} data={this.state.confirmedData}>
                            <Line type="monotone" dataKey="confirm" stroke="red" strokeWidth={2}  dot={false}/>
                            </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                    <div className="active col-3">
                        <h6 style={{fontSize: 14}}>Active</h6>
                        <h2 style={{marginTop: 50}}>{this.state.IndData.total.confirmed - this.state.IndData.total.recovered - this.state.IndData.total.deceased - this.state.IndData.total.other}</h2>
                        <div className="activechart minichart" >
                        <ResponsiveContainer width="100%" height="100%">

                        <LineChart width={150} height={100} data={this.state.activeData}>
                        <Line type="monotone" dataKey="active" stroke="blue" strokeWidth={2} dot={false}/>
                        </LineChart>
                        </ResponsiveContainer>

                        </div>
                        
                    </div>

                    <div className="recovered col-3">
                        <h6 style={{fontSize: 14}}>Recovered</h6>
                        <p>+{this.state.IndData.delta.recovered}</p>
                        <h2>{this.state.IndData.total.recovered}</h2>
                        <div  className="recoveredchart minichart" >
                        <ResponsiveContainer width="100%" height="100%">

                        <LineChart width={150} height={100} data={this.state.recoveredData}>
                        <Line type="monotone" dataKey="recover" stroke="green" strokeWidth={2}  dot={false} />
                        </LineChart>
                        </ResponsiveContainer>

                        </div>
                    </div>
                    <div className="deceased col-3">
                        <h6 style={{fontSize: 14}}>Deceased</h6>
                        <p>+{this.state.IndData.delta.deceased}</p>
                        <h2>{this.state.IndData.total.deceased}</h2>
                        <div  className="deceasedchart minichart">
                        <ResponsiveContainer width="100%" height="100%">
                        <LineChart width={150} height={100}  data={this.state.deceasedData}>
                        <Line type="monotone" dataKey="decease" stroke="Grey" strokeWidth={2} dot={false}/>
                        </LineChart>
                        </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
            }
                </div>
 
            </div>
        );

        }
    }


export default NationData;