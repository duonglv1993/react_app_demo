import React, { Component } from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './App.css';
import { isDate } from 'util';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dob: new Date(),
      id: '',
      content: ''
    };

    this.handleInputChange = this.handleInputChange.bind(this);
  }

  handleInputChange(event) {
    if(isDate(event)) {
      this.setState({
        dob: event
      });
      this.handleSubmit(event);
    }
    else {
      const target = event.target;
      const value = target.value;
      const name = target.name;

      this.setState({
        [name]: value
      });
    }
  }

  handleSubmit(time) {
    const url = 'https://raw.githubusercontent.com/duonglv1993/react_app_demo/master/data.js';
    fetch(url)
       .then(response => response.text())
       .then(text => {
          var data = JSON.parse(text);
          data.forEach(element => {
            var monthFrom = parseInt(element.date_from.split('/')[1]);
            var monthTo = parseInt(element.date_to.split('/')[1]);
            var dayFrom = parseInt(element.date_from.split('/')[0]);
            var dayTo = parseInt(element.date_to.split('/')[0]);
            if(time.getMonth() + 1 === monthFrom && time.getDate() >= dayFrom){
              this.setState({
                id: element.id,
                content: element.content
              });
            }
            else if(time.getMonth() + 1 === monthTo && time.getDate() <= dayTo){
              this.setState({
                id: element.id,
                content: element.content
              });
            }
          });
        });
  }


  render() {
    return (
      <form>
        <div>
          <div>Name:<input name="name" type="text" value={this.state.name} onChange={this.handleInputChange}/></div>
          <div>Birthday:<DatePicker selected={this.state.dob} dateFormat="MM/dd/yyyy" onChange={this.handleInputChange}/></div>
        </div>
        <div>Kết quả của {this.state.name} : {this.state.id}</div>
        <br/>
        <div>{this.state.content}</div>
      </form>
    );
  }
}

export default App;
