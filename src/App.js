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
        <div><MapWithASearchBox></MapWithASearchBox></div>
        <br/>
        <div>{this.state.content}</div>
      </form>
    );
  }
}

const _ = require("lodash");
const { compose, withProps, lifecycle } = require("recompose");
const {
  withScriptjs,
  withGoogleMap,
  GoogleMap,
  Marker,
} = require("react-google-maps");
const { SearchBox } = require("react-google-maps/lib/components/places/SearchBox");

const MapWithASearchBox = compose(
  withProps({
    googleMapURL: "https://maps.googleapis.com/maps/api/js?key=AIzaSyAgYWSGICS5a7He-j0IRLowSyxUU46nchs&v=3.exp&libraries=geometry,drawing,places",
    loadingElement: <div style={{ height: `100%` }} />,
    containerElement: <div style={{ height: `400px` }} />,
    mapElement: <div style={{ height: `100%` }} />,
  }),
  lifecycle({
    componentWillMount() {
      const refs = {}

      this.setState({
        bounds: null,
        center: {
          lat: 41.9, lng: -87.624
        },
        markers: [],
        onMapMounted: ref => {
          refs.map = ref;
        },
        onBoundsChanged: () => {
          this.setState({
            bounds: refs.map.getBounds(),
            center: refs.map.getCenter(),
          })
        },
        onSearchBoxMounted: ref => {
          refs.searchBox = ref;
        },
        onPlacesChanged: () => {
          const places = refs.searchBox.getPlaces();
          const bounds = new window.google.maps.LatLngBounds();

          places.forEach(place => {
            if (place.geometry.viewport) {
              bounds.union(place.geometry.viewport)
            } else {
              bounds.extend(place.geometry.location)
            }
          });
          const nextMarkers = places.map(place => ({
            position: place.geometry.location,
          }));
          const nextCenter = _.get(nextMarkers, '0.position', this.state.center);

          this.setState({
            center: nextCenter,
            markers: nextMarkers,
          });
          // refs.map.fitBounds(bounds);
        },
      })
    },
  }),
  withScriptjs,
  withGoogleMap
)(props =>
  <GoogleMap
    ref={props.onMapMounted}
    defaultZoom={15}
    center={props.center}
    onBoundsChanged={props.onBoundsChanged}
  >
    <SearchBox
      ref={props.onSearchBoxMounted}
      bounds={props.bounds}
      controlPosition={window.google.maps.ControlPosition.TOP_LEFT}
      onPlacesChanged={props.onPlacesChanged}
    >
      <input
        type="text"
        placeholder="Customized your placeholder"
        style={{
          boxSizing: `border-box`,
          border: `1px solid transparent`,
          width: `240px`,
          height: `32px`,
          marginTop: `27px`,
          padding: `0 12px`,
          borderRadius: `3px`,
          boxShadow: `0 2px 6px rgba(0, 0, 0, 0.3)`,
          fontSize: `14px`,
          outline: `none`,
          textOverflow: `ellipses`,
        }}
      />
    </SearchBox>
    {props.markers.map((marker, index) =>
      <Marker key={index} position={marker.position} />
    )}
  </GoogleMap>
);

export default App;
