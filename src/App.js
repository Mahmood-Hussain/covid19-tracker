import {
  Card,
  CardContent,
  createMuiTheme,
  FormControl,
  FormControlLabel,
  MenuItem,
  Paper,
  Select,
  Switch,
  ThemeProvider,
} from "@material-ui/core";
import { useEffect, useState } from "react";
import "./App.css";
import InfoBox from "./InfoBox";
import LineGraph from "./LineGraph";
import Map from "./Map";
import TableComponent from "./TableComponent";
import { prettyPrintStat, sortData } from "./util";
import "leaflet/dist/leaflet.css";
import Cookies from "universal-cookie";
const cookies = new Cookies();

function App() {
  const [countries, setCountries] = useState([]);
  const [country, setCountry] = useState("worldwide");
  const [countryInfo, setCountryInfo] = useState({});
  const [tableData, setTableData] = useState([]);
  const [mapCenter, setMapCenter] = useState([34.80746, -40.4796]);
  const [mapZoom, setMapZoom] = useState(3);
  const [mapCountries, setMapCountries] = useState([]);
  const [casesType, setCasesType] = useState("cases");
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    fetch("https://disease.sh/v3/covid-19/all")
      .then((response) => response.json())
      .then((data) => {
        setCountryInfo(data);
      });
  }, []);

  useEffect(() => {
    const getCountriesData = async () => {
      await fetch("https://disease.sh/v3/covid-19/countries")
        .then((response) => response.json())
        .then((data) => {
          const countries = data.map((country) => ({
            name: country.country,
            value: country.countryInfo.iso2,
          }));
          const sortedData = sortData(data);
          setCountries(countries);
          setMapCountries(data);
          setTableData(sortedData);
        });
    };
    getCountriesData();
  }, []);

  const onCountryChange = async (event) => {
    const countryCode = event.target.value;

    const url =
      countryCode === "worldwide"
        ? "https://disease.sh/v3/covid-19/all"
        : `https://disease.sh/v3/covid-19/countries/${countryCode}`;

    await fetch(url)
      .then((response) => response.json())
      .then((data) => {
        setCountry(countryCode);
        setCountryInfo(data);
        setMapCenter(
          countryCode !== "worldwide"
            ? [data.countryInfo.lat, data.countryInfo.long]
            : [34.80746, -40.4796]
        );
        setMapZoom(4);
      });
  };

  useEffect(() => {
    document.title = "Covid19 Tracker App - ReactJS";
    console.log("cookie", cookies.get("darkMode"));
    setDarkMode(cookies.get("darkMode") === "true" ? true : false);
  }, []);

  const handleChange = (event) => {
    setDarkMode(event.target.checked);
    cookies.set("darkMode", event.target.checked);
  };

  const theme = createMuiTheme({
    palette: {
      type: darkMode || cookies.get("darkMode") === "true" ? "dark" : "light",
    },
  });

  return (
    <ThemeProvider theme={theme}>
      <Paper className="app">
        <div className="app__left">
          {/* Header */}
          {/* Title + select dropdown menu */}
          <div className="app__header">
            <h1>COVID19 TRACKER</h1>

            <FormControl variant="outlined">
              <FormControlLabel
                control={
                  <Switch
                    checked={darkMode}
                    onChange={handleChange}
                    name="darkMode"
                    color="secondary"
                  />
                }
                label="Dark Mode"
              />
            </FormControl>

            <FormControl variant="outlined">
              <Select value={country} onChange={onCountryChange}>
                <MenuItem value="worldwide">Worldwide</MenuItem>
                {countries.map((country, i) => (
                  <MenuItem key={i} value={country.value}>
                    {country.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>

          {/* Infobox */}
          <div className="app__stats">
            <InfoBox
              active={casesType === "cases"}
              onClick={(e) => setCasesType("cases")}
              title="Coronavirus Cases"
              cases={prettyPrintStat(countryInfo.todayCases)}
              total={countryInfo.cases}
            />
            <InfoBox
              active={casesType === "recovered"}
              onClick={(e) => setCasesType("recovered")}
              title="Recovered"
              cases={prettyPrintStat(countryInfo.todayRecovered)}
              total={countryInfo.recovered}
            />
            <InfoBox
              active={casesType === "deaths"}
              onClick={(e) => setCasesType("deaths")}
              title="Deaths"
              cases={prettyPrintStat(countryInfo.todayDeaths)}
              total={countryInfo.deaths}
            />
          </div>

          {/* Map */}
          <Map
            casesType={casesType}
            countries={mapCountries}
            center={mapCenter}
            zoom={mapZoom}
          />
        </div>

        <Card className="app__right">
          <CardContent>
            <h3 style={{ paddingTop: 14, paddingBottom: 14 }}>
              Live cases by country
            </h3>
            {/* Table */}
            <TableComponent countries={tableData} />
            <h3 style={{ marginTop: 24, marginBottom: 24 }}>
              Worldwide new {casesType}
            </h3>
            {/* Graph */}
            <LineGraph casesType={casesType} />
          </CardContent>
        </Card>
      </Paper>
    </ThemeProvider>
  );
}

export default App;
