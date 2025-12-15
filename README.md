# Windy ForeFlight Import Plugin

Import ForeFlight `.fpl` flight plan files directly into Windy.com and visualize your route with weather data.

## Features

- **Drag & Drop**: Simply drop your `.fpl` file to import
- **Route Visualization**: See your flight plan on the Windy map
- **Waypoint Display**: View all waypoints with coordinates
- **Distance Calculation**: Total route distance in nautical miles
- **Weather Integration**: Open route in Windy's Distance & Planning tool

## Usage

### Option 1: Use Hosted Plugin
Open this URL in your browser:
```
https://www.windy.com/?plugin=https://nickrioux.github.io/windy-plugin-foreflight-import/plugin.js
```

### Option 2: Run Locally
```bash
git clone https://github.com/nickrioux/windy-plugin-foreflight-import.git
cd windy-plugin-foreflight-import
npm install
npm start
```
Then open: `https://www.windy.com/?plugin=https://localhost:9999/plugin.js`

## How to Use

1. Open the plugin URL in your browser
2. Click "ForeFlight Import" in the Windy menu (or it opens automatically)
3. Drop your `.fpl` file onto the drop zone (or click to browse)
4. Review the route preview and waypoint list
5. Click "Open in Distance & Planning" to view weather along your route

## Supported Format

ForeFlight `.fpl` files (Garmin Flight Plan XML format) containing:
- Waypoint table with identifiers, types, and coordinates
- Route definition with waypoint sequence
- Optional cruise altitude

## Development

```bash
npm install    # Install dependencies
npm start      # Start dev server with hot reload
npm run build  # Build for production
```

## License

MIT
