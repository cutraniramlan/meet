/* // src/CitySearch.js

import React, { Component } from "react";

class CitySearch extends Component {
  state = {
    query: "",
    suggestions: [],
    showSuggestions: undefined,
  };

  handleInputChanged = (event) => {
    const value = event.target.value;
    const suggestions = this.props.locations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    });
    this.setState({
      query: value,
      suggestions,
    });
  };

  handleItemClicked = (suggestion) => {
    this.setState({
      query: suggestion,
      showSuggestions: false,
    });

    this.props.updateEvents(suggestion);
  };

  render() {
    return (
      <div className="CitySearch">
        <input
          type="text"
          className="city"
          value={this.state.query}
          onChange={this.handleInputChanged}
          onFocus={() => {
            this.setState({ showSuggestions: true });
          }}
        />
        <ul
          className="suggestions"
          style={this.state.showSuggestions ? {} : { display: "none" }}
        >
          {this.state.suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => this.handleItemClicked("suggestion")}
            >
              {suggestion}
            </li>
          ))}
          <li key="all" onClick={() => this.handleItemClicked("suggestion")}>
            <b>See all cities</b>
          </li>
        </ul>
      </div>
    );
  }
}

export default CitySearch;
 */

import React, { Component } from "react";

class CitySearch extends Component {
  state = {
    query: "",
    suggestions: [],
    showSuggestions: undefined,
  };

  handleInputChanged = (event) => {
    const value = event.target.value;
    this.setState({ showSuggestions: true });
    const suggestions = this.props.locations.filter((location) => {
      return location.toUpperCase().indexOf(value.toUpperCase()) > -1;
    });

    if (suggestions.length === 0) {
      this.setState({
        query: value,
        suggestions: [],
        showSuggestions: false,
      });
    } else {
      return this.setState({
        query: value,
        suggestions: suggestions,
      });
    }
  };

  handleItemClicked = (suggestion) => {
    this.setState({
      query: suggestion,
      suggestions: [],
      showSuggestions: false,
    });

    this.props.updateEvents(suggestion);
  };

  handleInputFocus = () => {
    this.setState({ showSuggestions: true });
  };

  render() {
    return (
      <div className="CitySearch">
        <h3>Find a City</h3>
        <input
          type="text"
          className="city"
          placeholder="Search"
          value={this.state.query}
          onChange={this.handleInputChanged}
          onFocus={this.handleInputFocus}
        />
        <ul
          className="suggestions"
          style={this.state.showSuggestions ? {} : { display: "none" }}
        >
          {this.state.suggestions.map((suggestion) => (
            <li
              key={suggestion}
              onClick={() => this.handleItemClicked(suggestion)}
            >
              {suggestion}
            </li>
          ))}
          <li key="all" onClick={() => this.handleItemClicked("all")}>
            <h4>List events from all cities</h4>
          </li>
        </ul>
      </div>
    );
  }
}

export default CitySearch;
