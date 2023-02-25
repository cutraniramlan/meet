// src/App.js

import React, { Component } from "react";
import "./App.css";
import EventList from "./EventList";
import CitySearch from "./CitySearch";
import NumberOfEvents from "./NumberOfEvents";
import { getEvents, extractLocations } from "./api";
import "./nprogress.css";
import { InfoAlert } from "./Alert";

class App extends Component {
  state = {
    events: [],
    locations: [],
  };

  render() {
    return (
      <div className="App">
        {!navigator.onLine && (
          <InfoAlert
            className="alert-centered"
            text="App is currently offline. You are seeing your cached data."
          />
        )}
        <CitySearch
          locations={this.state.locations}
          updateEvents={this.updateEvents}
        />
        <NumberOfEvents />
        <EventList events={this.state.events} />
      </div>
    );
  }

  updateEvents = (location) => {
    getEvents().then((events) => {
      const locationEvents =
        location === "all"
          ? events
          : events.filter((event) => event.location === location);
      this.setState({
        events: locationEvents,
      });
    });
  };

  componentDidMount() {
    this.mounted = true;
    getEvents().then((events) => {
      if (this.mounted) {
        this.setState({ events, locations: extractLocations(events) });
      }
    });
  }

  componentWillUnmount() {
    this.mounted = false;
  }
}

export default App;
