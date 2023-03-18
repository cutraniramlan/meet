import React, { Component } from "react";
import "./App.css";
import EventList from "./EventList";
import CitySearch from "./CitySearch";
import NumberOfEvents from "./NumberOfEvents";
import EventGenre from "./EventGenre";
import WelcomeScreen from "./WelcomeScreen";
import { checkToken, getAccessToken, extractLocations, getEvents } from "./api";
import { WarningAlert } from "./Alert";
import "./nprogress.css";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import "react-responsive-carousel/lib/styles/carousel.min.css";

class App extends Component {
  state = {
    events: [],
    locations: [],
    eventsNumber: 32,
    isLight: true,
    isLoaded: false,
    showWelcomeScreen: undefined,
  };

  updateLocation = (location) => {
    getEvents().then((events) => {
      const locationEvents =
        location === "all"
          ? events
          : events.filter((event) => event.location === location);
      this.setState({
        events: locationEvents.slice(0, this.state.eventsNumber),
      });
    });
  };

  updateEventsNumber = (eventNumb) => {
    getEvents().then((events) => {
      this.setState({
        eventsNumber: eventNumb,
        events: events.slice(0, eventNumb),
      });
    });
  };

  toggleTheme = () => {
    this.setState((currentState) => ({
      isLight: !currentState.isLight,
    }));
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("color-theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("color-theme", "dark");
    }
  };

  getData = () => {
    const { locations, events } = this.state;
    const data = locations.map((location) => {
      const number = events.filter(
        (event) => event.location === location
      ).length;
      const city = location.split(", ").shift();
      return { city, number };
    });
    return data;
  };

  async componentDidMount() {
    this.mounted = true;
    const accessToken = localStorage.getItem("access_token");
    const isTokenValid = (await checkToken(accessToken)).error ? false : true;
    const searchParams = new URLSearchParams(window.location.search);
    const code = searchParams.get("code");
    this.setState({ showWelcomeScreen: !(code || isTokenValid) });

    // getEvents().then((events) => {
    //   if (this.mounted) {
    //     this.setState({
    //       events, locations: extractLocations(events),
    //       isLoaded: true
    //     });
    //   }
    // });

    if ((code || isTokenValid) && this.mounted) {
      console.log("code or token valid");
      getEvents().then((events) => {
        events = events.slice(0, this.state.eventsNumber);
        if (this.mounted) {
          this.setState({
            events: events,
            locations: extractLocations(events),
            isLoaded: true,
          });
        }
      });
    }
  }

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    const { events, showWelcomeScreen, isLight, isLoaded } = this.state;

    if (showWelcomeScreen === undefined) return <div className="App" />;

    return (
      <div className="App bg-white dark:bg-dark-navy text-navy dark:text-white text-lg font-sans min-h-screen flex items-center flex-col tracking-wide">
        <h1 className="text-5xl font-extrabold text-navy dark:text-coral my-11">
          Meet App
        </h1>
        <div className="w-full flex flex-wrap justify-center">
          <CitySearch
            locations={this.state.locations}
            updateLocation={this.updateLocation}
          />

          <NumberOfEvents
            eventsNumber={this.state.eventsNumber}
            updateEventsNumber={this.updateEventsNumber}
          />
        </div>
        <div className="WarningAlert mb-9 mx-2 text-center">
          {!navigator.onLine && (
            <WarningAlert
              text={
                "You are currently offline, the events may not be up to date."
              }
            />
          )}
        </div>
        <h2 className="text-4xl mb-4 text-center font-bold text-navy dark:text-coral">
          Charts
        </h2>
        {!showWelcomeScreen && (
          <div className="data-vis-wrapper">
            <EventGenre className="mb-20" events={events} />

            <ScatterChart
              width={400}
              height={400}
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid />
              <XAxis type="category" dataKey="city" name="city" />
              <YAxis type="number" dataKey="number" name="number of events" />
              <Tooltip cursor={{ strokeDasharray: "3 3" }} />
              <Scatter data={this.getData()} fill="#8884d8" />
            </ScatterChart>
          </div>
        )}
        <div className="w-full flex justify-center mt-4">
          {!isLoaded ? (
            <div className="loader border-solid border-4 border-white border-t-coral rounded-full animate-spin w-14 h-14"></div>
          ) : (
            <EventList
              events={events}
              updateEventsNumber={this.updateEventsNumber}
              eventsNumber={this.state.eventsNumber}
            />
          )}
        </div>
        <WelcomeScreen
          showWelcomeScreen={showWelcomeScreen}
          getAccessToken={() => {
            getAccessToken();
          }}
        />
      </div>
    );
  }
}

export default App;
